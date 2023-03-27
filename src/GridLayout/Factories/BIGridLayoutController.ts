import { Layout as ReactGridItemProps } from 'react-grid-layout';

export declare interface BIGridItemData extends ReactGridItemProps {
  children?: JSX.Element;
  development?: boolean;
  id: string;
}

class BIGridItem {
  readonly state: BIGridItemData;
  constructor(data: BIGridItemData) {
    this.state = new Proxy(
      { ...data },
      {
        get(target, key, receiver) {
          return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
          return Reflect.set(target, key, value, receiver);
        },
      },
    );
  }
}

/**
 * 工厂函数
 * description:返回Layout以及
 *
 * @param data
 * @returns
 */
const FcBIGridItem = (data: BIGridItemData) => {
  return new Proxy(new BIGridItem(data), {
    get(target, key) {
      return Reflect.get(target.state.hasOwnProperty(key) ? target.state : target, key);
    },
    set: function (target, key, value) {
      return Reflect.set(target.state.hasOwnProperty(key) ? target.state : target, key, value);
    },
  });
};

export default FcBIGridItem;
