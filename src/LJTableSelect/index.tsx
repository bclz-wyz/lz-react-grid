import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button, InputNumber, Input, message } from 'antd'
import './style.less'


const LJTableSelect: React.FC = () => {
    const [currentRow, setCurrentRow] = useState(3)
    const [currentColumn, setCurrentColumn] = useState(5)
    const onChangeRow = useCallback(() => {
    }, [])
    const onChangeColumn = useCallback(() => {
    }, [])
    return (
        <div >
            <InputNumber addonBefore={'行'} min={1} defaultValue={currentRow} onChange={onChangeRow} />
            <InputNumber addonBefore={'列'} min={1} defaultValue={currentColumn} onChange={onChangeColumn} />
            <div className='info'>
                <div><span>字段</span><span>映射</span><span>状态</span></div>
            </div>
            <div>
                <Input placeholder='请输入IP地址' />
                <Button type='primary' placeholder='请输入IP地址'>测试</Button>

            </div>
            <div>
                <Button >取消</Button>

                <Button type='primary'>确定</Button>

            </div>
        </div>)

}
export default LJTableSelect