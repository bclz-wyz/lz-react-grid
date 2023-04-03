import React from 'react'
import {Button} from 'antd'
import * as AHooks from 'ahooks'
import './style.less'

const UseHistoryTravel:React.FC = () => {
    const { value: childList = [],backLength,forwardLength, setValue: setChildList, back: childListBack,reset:childListReset} = AHooks.useHistoryTravel<any[]>([],10);


  return (
    <div className="UseHistoryTravel">
        <div className="toolBar">
        <Button onClick={() => { setChildList([...childList,new Date().valueOf()]);console.log(backLength,forwardLength) }}>添加</Button>
            <Button disabled={backLength<=0} onClick={() => { childListBack();console.log(backLength,forwardLength) }}>撤销</Button>
            <Button disabled={backLength<=0} onClick={() => { childListReset();console.log(backLength,forwardLength) }}>还原</Button>
        </div>
        <div className="content">
            {childList.map((item)=>{
                return <li key={item}>{item}</li>
            })}
        </div>
    </div>
  )
}

export default UseHistoryTravel