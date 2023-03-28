import React from 'react'
import Moveable, { OnDrag, OnResize, OnScale, OnRotate } from 'react-moveable';
import './style.less'

const LJMoveable: React.FC = () => {
    const moveableRef = React.useRef<HTMLDivElement>(null);

    const childrenList = [
        {
            group:'target1',
            name:'1',
            content:'target1-1',
            style:{
                width:'100px',
                height:'100px',
                transform:'translate(100px,100px)',
                backgroundColor:'red',
                left:'10px',
                top:'10px'
            }
        },
        {
            group:'target1',
            name:'2',
            content:'target1-2',
            style:{
                width:'100px',
                height:'100px',
                transform:'translate(100px,100px)',
                backgroundColor:'yellow'
            }
        },
        {
            group:'target2',
            name:'1',
            content:'target2-1',
            style:{
                width:'100px',
                height:'100px',
                transform:'translate(100px,100px)',
                backgroundColor:'blue',
                left:'10px',
                top:'10px'
            }
        },
        {
            group:'target2',
            name:'2',
            content:'target2-2',
            style:{
                width:'100px',
                height:'100px',
                transform:'translate(100px,100px)',
                backgroundColor:'gray',
                
            }
        }
    ]

    return (
        <div className='lj-moveable'>
            <div className="container">
                {/* <div className='target target2' style={{
                    transform: 'translate(100px,100px)',
                    zIndex: 2,
                }}>
                    1
                </div>
                <div className='target target1' style={{
                    zIndex: 1
                }}>2</div>
                <div className='target-2 target2' style={{
                    transform: 'translate(100px,100px)',
                    zIndex: 2,
                }}>
                    1
                </div>
                <div className='target-2 target1' style={{
                    zIndex: 1
                }}>2</div>
                <div className='target target3' style={{
                    zIndex: 1
                }}>333</div> */}
                {
                    childrenList.map(item=>{
                        return <div className={`target ${item.group}`} style={item.style} key={item.name} />
                    })
                }


            </div>
            <Moveable
                onContextmenu={ 
                    (e) => {
                        e.preventDefault()
                        console.log('onContextmenu',e)
                    }
                }
                refs={moveableRef}
                target={".target1"}
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
                }}
                onScale={e => {
                    e.target.style.transform = e.drag.transform;

                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;

                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onResizeEnd={(e) => {
                    console.log("onResizeEnd", e.target, e.isDrag, e.datas);
                }}
                onDragGroup={({ events }) => {
                    console.log('onDragGroup',events)
                    events.forEach(ev => {
                        ev.target.style.transform = Number(ev.transform).toFixed(0);
                    });
                }}
                onResizeGroupStart={({ setMin, setMax }) => {
                    setMin([0, 0]);
                    setMax([0, 0]);
                }}
                onResizeGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.width = `${ev.width.toFixed(0)}px`;
                        ev.target.style.height = `${ev.height.toFixed(0)}px`;
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
                onRotateGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}

            />
            <Moveable
                refs={moveableRef}
                target={".target2"}
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
                }}
                onScale={e => {
                    e.target.style.transform = e.drag.transform;

                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;

                }}
                onResize={e => {
                    e.target.style.width = `${e.width.toFixed(0)}px`;
                    e.target.style.height = `${e.height.toFixed(0)}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onResizeEnd={(e) => {
                    console.log("onResizeEnd", e.target, e.isDrag, e.datas);
                }}
                onDragGroup={({ events }) => {
                    console.log('onDragGroup',events)
                    events.forEach(ev => {
                        ev.target.style.transform = Number(ev.transform).toFixed(0);
                    });
                }}
                onResizeGroupStart={({ setMin, setMax }) => {
                    setMin([0, 0]);
                    setMax([0, 0]);
                }}
                onResizeGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.width = `${ev.width.toFixed(0)}px`;
                        ev.target.style.height = `${ev.height.toFixed(0)}px`;
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
                onRotateGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
            />
        </div>
    )
}

export default LJMoveable