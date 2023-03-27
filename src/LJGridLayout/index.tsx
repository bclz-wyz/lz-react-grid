import React from 'react'
import clsx from 'clsx';
import { Layout as ReactGridItemProps } from 'react-grid-layout';



const LJGridLayout = (props:BIGridItemData) => {
    const { id: key, children, development } = props;
    console.log(props)
    return (
        <div key={key} className='lj-grid-gridLayout' >
            {children}
        </div>

    )
}

export default LJGridLayout