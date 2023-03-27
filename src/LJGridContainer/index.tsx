import React, { useMemo } from 'react'
import ReactGridLayout, { Layout as ReactGridItemProps }  from 'react-grid-layout';

import layoutsData from './layouts'
import LJGridLayout from 'lj-react-grid/LJGridLayout';
import './style.less'
import clsx from 'clsx';


export declare interface BIGridItemData extends ReactGridItemProps {
    children?: JSX.Element;
    development?: boolean;
    id?: string;
}

export declare interface LJGridContainerProps extends ReactGridLayout.ReactGridLayoutProps {
    eventHandler?: ReactGridLayout.ItemCallback
    development?: boolean
}



const LJGridContainer: React.FC<LJGridContainerProps> = (props) => {
    const { development = false, layout=[], children } = props
    console.log('layout',props)

    // const  = useMemo(()=>{
    //     return [...layout]
    // },[layout])

    const [layoutList,setLayoutList] = React.useState<ReactGridItemProps[]>(layout)

    const LJGridLayoutRender = useMemo(()=>{
        return (props:BIGridItemData)=>{
            const { i: key, children } = props;
            return <div key={key} onDoubleClick={()=>{
                setLayoutList([...layoutList].reverse())
                console.log('reverse')
            }} className='lj-grid-gridLayout' >
            {children}
        </div>
        }
    },[setLayoutList,layoutList])

    return (
        <div className={clsx("lj-grid-container", {
            ['lj-grid-containerDev']: development === true,
        })}><ReactGridLayout {...props} >{
            layoutList.map((item) => {
                return LJGridLayoutRender(item)
                // <LJGridLayout key={item.i} {...item} id={item.i}></LJGridLayout>
            })
        }</ReactGridLayout>
        </div>
    )
}

export default LJGridContainer
export const layoutsMock = layoutsData