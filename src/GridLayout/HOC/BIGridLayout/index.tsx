import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import ReactGridLayout, {
  Layout as ReactGridItemProps,
  ReactGridLayoutProps,
  Responsive,
  WidthProvider,
} from 'react-grid-layout';

import BIGridLayoutController from '../../Factories/BIGridFactory';
import './style.less';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResponsiveReactGridLayout = WidthProvider(Responsive);
export declare interface BIGridLayoutProps extends ReactGridLayoutProps {
  development?: boolean;
  layouts:BIGridItemsData
}

export declare interface BIGridItemData extends ReactGridItemProps {
  children?: JSX.Element;
  development?: boolean;
  id: string;
}

export declare type BIGridItemsData = BIGridItemData[];

const BIGridItemRender:React.FC<BIGridItemData> = (props) => {
  const { id: key, children, development } = props;
  return (
    <div key={key} className={'123'}>
      <div
        className={clsx('lj-grid-BIGridItem', {
          ['lj-grid-gridDev']: development === true,
        })}
      >
        {children}
      </div>
    </div>
  );
};

const BIGridLayout:React.FC<BIGridLayoutProps> = (props)=>{
  const { development = false,layouts } = props;
  console.warn('render');
  // 缓存gridItemRender方法
  

  const gridState = useMemo(() => {
    const fcStage = new BIGridLayoutController({
      layoutData: layouts, // 传入layout列表
      layoutRender: BIGridItemRender, // 传入render
    });
    return fcStage;
  }, [layouts]);

  return (
    <div
    className={clsx('lj-grid-BIGridLayout', {
      ['lj-grid-development']: development === true,
    })}
    style={{
      transform: 'scale(0.5)',
    }}
  >
    <ReactGridLayout
      style={{
        height: '100%',
      }}
      cols={8069}
      rowHeight={1}
      width={8069}
      margin={[0, 0]}
      compactType={null} // 允许纵向自由布局
      allowOverlap={true} // 允许重叠
      preventCollision={true}
      isDroppable={false}
      useCSSTransforms={false}
      {...props}
      layout={[...gridState.layoutsList]}
      {...gridState.eventHandler}
      transformScale={0.5}
      // compactType={'vertical'}
    >
      {/* {gridState.layoutsEl} */}
    </ReactGridLayout>
  </div>
  );
}
export default BIGridLayout