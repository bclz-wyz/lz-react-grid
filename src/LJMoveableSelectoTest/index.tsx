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

    const { value: childList = [], setValue: setChildList, go: childListGoBack } = AHooks.useHistoryTravel<LjMoveableChild[]>(props.data);

    const groupManagerRef = React.useRef<GroupManager>();

    const { value: targets = [], setValue: setTargets, go: goBack } = AHooks.useHistoryTravel<MoveableTargetGroupsType>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);

    const setSelectedTargets = React.useCallback((nextTargetes: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
        setTargets(nextTargetes);
    }, []);
    React.useEffect(() => {
        // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
        const elements = selectoRef.current!.getSelectableElements();

        // groupManagerRef.current = new GroupManager([
        //     [[elements[0], elements[1]], elements[2]],
        //     [elements[5], elements[6], elements[7]],
        // ], elements);
        groupManagerRef.current = new GroupManager(elements);
    }, []);

    return <div className="root LJMoveableSelectoTest">
        <div className="toolBar">
            <Button onClick={() => { childListGoBack(-1) }}>撤销</Button>
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
                    console.log(e)
                    const { transform } = e;
                    const [x, y] = transform
                    e.target.style.transform = e.transform;
                    // childList()
                }}
                /**
                 * 在drag结束后更新 childList
                 */
                onDragEnd={e => {
                    const { transform } = e.lastEvent;
                    const [x, y] = transform
                    console.group('onDragEnd')
                    console.log(e)
                    console.groupEnd()
                    const targetId = e.target.dataset['id']
                    const targetChild = childList.find(item => item.id === targetId)!
                    targetChild.style = {
                        ...(targetChild?.style||{}),
                        x,y
                    }
                    setChildList(_.cloneDeep(childList))
                    
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                        ev.target.style.width = `${ev.style.width}px`;
                        ev.target.style.height = `${ev.style.height}px`;
                    });
                }}
                
                // onDragGroupEnd={()=>{
                //     console.group('onDragEnd')
                //     console.groupEnd()
                // }}
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
                    console.group('onRenderEnd')
                    console.log(e)
                    console.log('width', e.target.style.width);
                    console.log('height', e.target.style.height);
                    console.log('transform', e.target.style.transform);
                    console.groupEnd()

                }}
                // onRenderGroup={e => {
                //     e.events.forEach(ev => {
                //         ev.target.style.cssText += ev.cssText;
                //     });
                // }}
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
                    }} key={item.id}>{item.name}</div>
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