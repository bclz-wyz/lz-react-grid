import { LJGridContainer, layoutsMock } from 'lj-react-grid';
import React from 'react';

export const Demo:React.FC =  () => {
    const layoutsList = []
    for (let index = 0; index < layoutsMock.length; index++) {
        const gridItem = layoutsMock[index];
        if(gridItem){
            layoutsList.push({ ...gridItem, i: gridItem.id });
        }
    }
    console.log(layoutsList)

    return <LJGridContainer
        style={{
            height: '100%',
        }}
        cols={8000}
        rowHeight={1}
        width={8000}
        margin={[0, 0]}
        compactType={null} // 允许纵向自由布局
        allowOverlap={true} // 允许重叠
        preventCollision={true}
        isDroppable={false}
        useCSSTransforms={false}
        // transformScale={1}
        layout={layoutsList}
    />
}