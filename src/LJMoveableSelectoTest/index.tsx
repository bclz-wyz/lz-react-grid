import { deepFlat } from "@daybrush/utils";
import * as React from "react";
import { useKeycon } from "react-keycon";
import Selecto from "react-selecto";
import Moveable, { MoveableTargetGroupsType } from "react-moveable";
import "./style.less";
import { GroupManager, TargetList } from "@moveable/helper";
import * as AHooks from 'ahooks'
import { Button } from "antd";
import { LjMoveableChild, LjMoveableChildStyle } from "./type";
import * as _ from 'lodash'

type Props = {
    data: LjMoveableChild[],
    canvasConfig?: {
        width: number,
        height: number,
    }
}

// 使用match方法提取字符串所有正整数、负整数、正小数、负小数
const reg = /translate\(([\d.-]+)px, ([\d.-]+)px\) rotate\(([\d.-]+)deg\) scale\(([\d.-]+)\)/

export function styleDToS(value: LjMoveableChildStyle) {
    const result = {
        width: String(value.width).endsWith('px') ? value.width : `${value.width}px`,
        height: String(value.height).endsWith('px') ? value.height : `${value.height}px`,
        transform: `translate(${value.x}px, ${value.y}px) rotate(${value.rotate||0}deg) scale(${value.scale||1})`,
    }
    // console.log(result)
    return result
}

const App: React.FC<Props> = (props) => {
    const { isKeydown: isCommand } = useKeycon({ keys: "meta" });
    const { isKeydown: isShift } = useKeycon({ keys: "shift" });
    
    const upDate = AHooks.useUpdate()

    const { value: childList = [],backLength,forwardLength, setValue: setChildList, back: childListBack,reset:childListReset} = AHooks.useHistoryTravel<LjMoveableChild[]>(props.data);

    React.useLayoutEffect(() => {
        // debugger
        setChildList([...props.data])
    },[])
    
    // 解决最后一步无法撤回的问题
    React.useLayoutEffect(()=>{
        if(backLength===0){
            setChildList(_.cloneDeep(childList))
        }
    },[backLength])

    

    const [ targets = [], setTargets] = React.useState<MoveableTargetGroupsType>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);

    const setSelectedTargets = React.useCallback((nextTargets: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargets));
        setTargets(nextTargets);
    }, []);


    const groupManagerRef = React.useRef<GroupManager>();
    React.useEffect(() => {
        // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
        const elements = selectoRef.current!.getSelectableElements();
        groupManagerRef.current = new GroupManager(elements);
    }, []);

    const newChildStyle = AHooks.useMemoizedFn((style:CSSStyleDeclaration)=>{
            const {transform,width,height} = style
            const transformInfo = transform.match(reg)
            console.log('newChildStyle',transform,transformInfo)
            return {
                width,height,
                x:transformInfo[1],
                y:transformInfo[2],
                rotate:transformInfo[3],
                scale:transformInfo[4],
            }
    })

    return <div className="root LJMoveableSelectoTest">
        <div className="toolBar">
            <Button disabled={backLength<=0} onClick={() => { childListBack();upDate();console.log(backLength,forwardLength) }}>撤销</Button>
            <Button onClick={() => { childListReset();upDate();console.log(backLength,forwardLength) }}>还原</Button>
        </div>
        <div className="container">
            <Moveable
                ref={moveableRef}
                target={targets}
                // target={".target1"}
                hideChildMoveableDefaultLines={true}
                // individualGroupable={true}
                draggable={true}
                throttleDrag={1}
                resizable={true}
                resizeFormat={(size) => {
                    return size.map(item => Number(item.toFixed(0)))
                }}
                edgeDraggable={false}
                startDragRotate={0}
                throttleDragRotate={0}
                scalable={true}
                keepRatio={true}
                throttleScale={0}
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                rotatable={true}
                throttleRotate={0}
                rotationPosition={"top"}
                onRotate={e => {
                    console.group('onRotate')
                    console.log(e)
                    console.groupEnd()
                    e.target.style.transform = e.transform;
                }}
                onClickGroup={e => {
                    if (!e.moveableTarget) {
                        setSelectedTargets([]);
                        return;
                    }
                    if (e.isDouble) {
                        const childs = groupManagerRef!.current!.selectSubChilds(targets!, e.moveableTarget);

                        setSelectedTargets(childs.targets());
                        return;
                    }
                    if (e.isTrusted) {
                        selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
                    }
                }}
                onDrag={e => {
                    // console.log(e)
                    const { transform } = e;
                    const [x, y] = transform
                    e.target.style.transform = e.transform;
                }}
                /**
                 * 在drag结束后更新 childList
                 */
                onDragEnd={e => {
                    const { translate } = e.lastEvent;
                    const [x, y] = translate
                    console.group('onDragEnd')
                    console.log(e)
                    console.groupEnd()
                    const targetId = e.target.dataset['id']
                    const newStyle = newChildStyle(e.target.style)
                    const targetIndex = childList.findIndex(item => item.id === targetId)!
                        childList.splice(targetIndex,1,{
                            ...childList[targetIndex],
                            style:{
                                ...(childList[targetIndex]?.style||{}),
                                ...newStyle
                            }
                        });
                    setChildList(_.cloneDeep(childList))
                }}
                onDragGroupEnd={(e)=>{
                    console.group('onDragGroupEnd')
                    console.log(e)
                    console.groupEnd()
                    e.events.forEach(({target})=>{
                        const {style} = target
                        const newStyle = newChildStyle(style)
                        const targetId = target.dataset['id']
                        const targetIndex = childList.findIndex(item => item.id === targetId)!
                        childList.splice(targetIndex,1,{
                            ...childList[targetIndex],
                            style:{
                                ...(childList[targetIndex]?.style||{}),
                                ...newStyle
                            }
                        });
                    })
                    console.log('beforeSet',backLength,forwardLength)
                    setChildList(_.cloneDeep(childList))
                    console.log('afterSet',backLength,forwardLength)
                }}


                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                        ev.target.style.width = `${ev.style.width}px`;
                        ev.target.style.height = `${ev.style.height}px`;
                    });
                }}
                
                
                onRenderGroupEnd={(e) => {
                    console.group('onRenderGroupEnd')
                    e.targets.forEach((target, index) => {
                        console.log('width', target.style.width)
                        console.log('height', target.style.height)
                        console.log('transform', target.style.transform)
                        console.groupEnd()
                    })
                    console.groupEnd()
                }}
                onRenderEnd={(e) => {
                    // 以group方式打印当前的target信息
                    /**
                     *  更新childList
                     */
                    // const {style} = e.target
                    // const {transform,width,height} = style
                    // const transformInfo = transform.match(reg)!
                    // console.group('onRenderEnd')
                    // console.log(e)
                    // console.log('transformInfo',transformInfo)
                    // console.log('width', width,height);
                    // console.log('height', height);
                    // console.log('transform', e.target.style.transform,[transformInfo[1],transformInfo[2]]);
                    // console.log('rotate',transformInfo[3]);
                    // console.log('scale',transformInfo[4]);
                    // console.groupEnd()

                    // const targetId = e.target.dataset['id']
                    // const targetChild = childList.find(item => item.id === targetId)!
                    // targetChild.style = {
                    //     ...(targetChild?.style||{}),
                    //     width,height,
                    //     x:transformInfo[1],y:transformInfo[2],
                    //     rotate:transformInfo[3],
                    //     scale:transformInfo[4],
                    // }
                    // console.log(targetChild?.style)
                    // setChildList(_.cloneDeep(childList))
                    // console.log(backLength,forwardLength)
                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onResizeGroup={({ events }) => {
                    console.log('onResizeGroupEvents', events);
                    return
                    events.forEach(ev => {
                        // ev.target.style.width = `${ev.width.toFixed(0)}px`;
                        // ev.target.style.height = `${ev.height.toFixed(0)}px`;
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
            ></Moveable>
            <Selecto
                ref={selectoRef}
                dragContainer={window}
                selectableTargets={[".selecto-area .cube"]}
                hitRate={0}
                selectByClick={true}
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                ratio={0}
                onDragStart={e => {
                    const moveable = moveableRef.current!;
                    const target = e.inputEvent.target;
                    // Must have use deep flat
                    const flatted = targets!.flat(3) as Array<HTMLElement | SVGElement>;
                    if (
                        moveable.isMoveableElement(target)
                        || flatted.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelectEnd={e => {
                    const {
                        isDragStart,
                        isClick,
                        added,
                        removed,
                        inputEvent,
                    } = e;
                    const moveable = moveableRef.current!;

                    if (isDragStart) {
                        inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(inputEvent);
                        });
                    }
                    const groupManager = groupManagerRef.current!;
                    let nextChilds: TargetList;

                    if (isDragStart || isClick) {
                        if (isCommand) {
                            nextChilds = groupManager.selectSingleChilds(targets!, added, removed);
                        } else {
                            nextChilds = groupManager.selectCompletedChilds(targets!, added, removed, isShift);
                        }
                    } else {
                        nextChilds = groupManager.selectSameDepthChilds(targets!, added, removed);
                    }
                    e.currentTarget.setSelectedTargets(nextChilds.flatten());
                    setSelectedTargets(nextChilds.targets());
                }}
            ></Selecto>
            <p>[[0, 1], 2] is group</p>
            <p>[5, 6, 7] is group</p>

            <div className="elements selecto-area" style={{
                width: '100%',
                height: '500px'
            }}>
                {childList.map(item => {
                    const itemStyle = styleDToS(item.style || {})
                    return <div data-id={item.id} className="cube" style={{
                        ...itemStyle
                    }} onClick={()=>{console.log(JSON.stringify(item))}} key={undefined}>{item.name}</div>
                })}
            </div>
        </div>
    </div>;
}

export default App

export {
    LjMoveableChild
}
export { default as DemoLJMoveableSelectoTest } from './demo'