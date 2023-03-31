/**
 * 用作子元素渲染的数据
 * 每个moveable内只包含一个子元素，即不对业务组件做逻辑分组
 */
export declare interface LjMoveableChild {
    id: string|number;
    name?:string,
    style?:LjMoveableChildStyle
    children?:LjTemplate
}

export declare type LjMoveableChildren = LjMoveableChild[];

export declare type LjMoveableChildStyle = {
    width?: string|number,
    height?:string|number,
    x?:string|number,
    y?:string|number,
    scale?:string|number,
    rotate?:string|number,
}

/**
 * 业务组件：template
 */
export declare type LjTemplate = {
    id:string,
    name?:string,
    data?:{
        style?:CSSStyleSheet,
    },
    Template:React.FC,
}