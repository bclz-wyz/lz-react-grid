import ReactGridLayout from 'react-grid-layout';
import { BIGridItemData, BIGridItemsData } from '../HOC/BIGridLayout';
import { MsgDev } from '../..';
import React from 'react';

interface BIGridLayoutProps {
  layoutData: BIGridItemsData;
  layoutRender: React.FC<BIGridItemData>;
}

interface BIGridLayoutEventsHandler {
  onDragStop?: ReactGridLayout.ItemCallback;
  onDragStart?: ReactGridLayout.ItemCallback;
  onDrag?: ReactGridLayout.ItemCallback;
  onLayoutChange?: (layout: ReactGridLayout.Layout[]) => void;
  onResizeStart?: ReactGridLayout.ItemCallback;
  onResize?: ReactGridLayout.ItemCallback;
  onResizeStop?: ReactGridLayout.ItemCallback;
  onDrop?: (layout: ReactGridLayout.Layout[], item?: ReactGridLayout.Layout, e?: Event) => void;
}

export default class BIGridLayoutController {
  dragItem: string | number = -1; // 移动的子元素
  selectedItem: string | number = -1; // 选中的子元素(待完善)
  layoutsList: ReactGridLayout.Layout[] = [];
  layoutsEl: JSX.Element[] = [];
  // 私有属性
  #_eventHandler: BIGridLayoutEventsHandler = {} as BIGridLayoutEventsHandler;
  constructor(data: BIGridLayoutProps) {
    this.initData(data);
    this.initEventHandler();
  }
  #_eventHandlerMap: {
    [key in keyof BIGridLayoutEventsHandler]: (
      | ReactGridLayout.ItemCallback
      | ((layout: ReactGridLayout.Layout[], item?: ReactGridLayout.Layout, e?: Event) => void)
    )[];
    // onDrop: ((layout: ReactGridLayout.Layout[], item?: ReactGridLayout.Layout, e?: Event) => void)[]
  };
  private initData(data: BIGridLayoutProps) {
    const { layoutData, layoutRender:LayoutRender } = data;
    for (let index = 0; index < layoutData.length; index++) {
      const gridItem = layoutData[index];
      if (gridItem) {
        this.layoutsList.push({ ...gridItem, i: gridItem.id });
        this.layoutsEl.push(<LayoutRender {...gridItem}/>);
      } else {
        MsgDev(`index ${index} of layoutData was ${typeof gridItem}`);
      }
    }
  }
  private initEventHandler() {
    this.#_eventHandler.onDragStart = (layout, oldItem, newItem) => { // placeholder, event, element
      console.log(this);
      console.log('onDragStart', layout, oldItem, newItem, oldItem === newItem);
    };
    // 移动结束触发
    this.#_eventHandler.onDragStop = (layout, oldItem, newItem,) => { // placeholder, event, element
      console.log('onDragStop', layout, oldItem, newItem, oldItem === newItem);
      alert(
        `Dropped element props:\n${JSON.stringify([oldItem, newItem], ['x', 'y', 'w', 'h'], 2)}`,
      );
    };
    // 移动中一直触发
    // this.#_eventHandler.onDrag = (layout, oldItem, newItem, placeholder, event, element) => {
    //   // debugger;
    //   // console.log('onDrag', layout, oldItem, newItem, oldItem === newItem);
    // };
    this.#_eventHandler.onDrop = (layout, layoutItem, _event) => {
      console.log(layout, layoutItem, _event);
      alert(`Dropped element props:\n${JSON.stringify(layoutItem, ['x', 'y', 'w', 'h'], 2)}`);
    };
  }
  customizeEventHandler() {}
  get eventHandler() {
    return this.#_eventHandler;
  }
}
