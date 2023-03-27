import { BIGridLayoutProps, default as  BIGridLayout } from './HOC/BIGridLayout';
import layouts from './layouts';
import React,{useState} from 'react'
import './style.less';

const BIDesign:React.FC = () => {
  const [scaleValue, setScaleValue] = useState(1);

  return (
    <div className="lj-grid-BIDesign">
      <div className={'lj-grid-designTemplate'}>
        <div
          className="droppable-element"
          draggable={true}
          unselectable={'on'}
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={(e) => e.dataTransfer.setData('text/plain', '')}
        >
          Droppable Element (Drag me!)
        </div>
      </div>
      <div
        className={'lj-grid-designContainer'}
        onWheel={(event) => {
          console.log('scroll');
          event.preventDefault();
          return;

          let scale = event.deltaY * -0.01 + scaleValue;

          // Restrict scale
          scale = Math.min(Math.max(0.125, scale), 4);

          // Apply scale transform
          setScaleValue(scale);
        }}
      >
        <div
          className={'lj-grid-designDomCanvas'}
          style={{
            transform: `scale(${scaleValue})`,
          }}
        >
          {/* {BIGridLayout({layouts})} */}
          {/* <AA></AA> */}
          <BIGridLayout layouts={layouts}></BIGridLayout>
        </div>
      </div>
      <div className={'lj-grid-designControl'}></div>
    </div>
  );
};

export default BIDesign;