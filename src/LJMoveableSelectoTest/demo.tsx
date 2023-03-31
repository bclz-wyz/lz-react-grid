import { LJMoveableSelectoTest, LjMoveableChild } from 'lj-react-grid';
import React from 'react';



export default () => {
    const childList: LjMoveableChild[] = []

    for (let i = 0; i < 20; i++) {
        childList.push({
            id: i.toString(),
            name: `child ${i}`,
            style: {
                x: Math.random() * 500,
                y: Math.random() * 500,
                width: '100px',
                height: '100px',
            }
        } as LjMoveableChild)

    }

    return <LJMoveableSelectoTest data={childList} />
}