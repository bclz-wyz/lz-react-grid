import React from 'react'
import * as ahooks from 'ahooks'
import Moveable, { OnDrag, OnResize, OnScale, OnRotate, MoveableTargetGroupsType } from 'react-moveable';
import './style.less'
import Selecto from 'react-selecto';
import { useKeycon } from 'react-keycon';
import { deepFlat } from '@daybrush/utils';
import { GroupManager, TargetList } from '@moveable/helper';

const LJMoveableSelecto: React.FC = () => {
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const [targets, setTargets] = React.useState<MoveableTargetGroupsType>([]);
    const { isKeydown: isCommand } = useKeycon({ keys: "meta" });
    const { isKeydown: isShift } = useKeycon({ keys: "shift" });
    const groupManagerRef = React.useRef<GroupManager>();

    const setSelectedTargets = React.useCallback((nextTargetes: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
        setTargets(nextTargetes);
    }, []);

    const childrenList = [
        {
            group: 'target1',
            name: '1',
            content: 'target1-1',
            style: {
                width: '100px',
                height: '100px',
                transform: 'translate(100px,100px)',
                backgroundColor: 'red',
                // left: '10px',
                // top: '10px'
            }
        },
        {
            group: 'target1',
            name: '2',
            content: 'target1-2',
            style: {
                width: '100px',
                height: '100px',
                transform: 'translate(20px,20px)',
                backgroundColor: 'yellow'
            }
        }
    ]

    React.useEffect(() => {
        const elements = selectoRef.current!.getSelectableElements();
        groupManagerRef.current = new GroupManager([
            ...elements
        ]);
    }, []);

    // 监听resize
    const resizeRef = React.useRef<HTMLDivElement>(null);
    const size = ahooks.useSize(resizeRef)

    React.useEffect(()=>{
        console.log('size',size)
    },[size])

    return (
        <div className='lj-moveable' ref={resizeRef} >
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
                scalable={false}
                keepRatio={false}
                throttleScale={0}
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                rotatable={true}
                throttleRotate={0}
                rotationPosition={"top"}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                    console.log('onDrag')
                }}
                // onScale={e => {
                //     e.target.style.transform = e.drag.transform;

                // }}
                onDragGroup={e=>{
                    console.log('onDragGroup')
                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;
                    console.log('onRotate')
                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                    console.log('onResize')
                }}
                onResizeEnd={(e) => {
                    console.log("onResizeEnd", e.target, e.isDrag, e.datas);
                }}
            />
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
                    const flatted = targets.flat(3) as Array<HTMLElement | SVGElement>;
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
                            nextChilds = groupManager.selectSingleChilds(targets, added, removed);
                        } else {
                            nextChilds = groupManager.selectCompletedChilds(targets, added, removed, isShift);
                        }
                    } else {
                        nextChilds = groupManager.selectSameDepthChilds(targets, added, removed);
                    }
                    e.currentTarget.setSelectedTargets(nextChilds.flatten());
                    setSelectedTargets(nextChilds.targets());
                }}
            ></Selecto>
            <div className="elements selecto-area">
            {
                    childrenList.map(item => {
                        return <div className={`target cube ${item.group}`} style={item.style} key={item.name} >{item.content}</div>
                    })
                }
            </div>
            <div className="empty elements"></div>
        </div>
    )
}

export default LJMoveableSelecto