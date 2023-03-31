import { message } from 'antd'

import type { ArgsProps } from 'antd/lib/message'

export declare type ConsoleDevProps = {
    isDev?: boolean
    msg: any,
    useMessage?: boolean | ArgsProps
} | any

const localDev = process.env.NODE_ENV === 'development';

const MsgDev = (props: ConsoleDevProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const propsType = typeof props
    switch (propsType) {
        case 'object': {
            const { isDev = localDev, msg, useMessage = false } = props
            // 非开发者模式=>不执行
            if (!(isDev && localDev)) {
                break;
            }
            if (useMessage) {
                const msgProps = typeof useMessage
                if (msgProps === 'boolean') {
                    messageApi.open({
                        content: `MsgDev: ${msg}`
                    })
                    console.log(`MsgDev: ${msg}`)
                } else {
                    message.open({
                        ...useMessage,
                        content: `MsgDev: ${msg} and ${useMessage.content}}`
                    })
                    console.log(`MsgDev: ${msg} and ${useMessage.content}}`)
                }
            }
        } break;
        case 'string':
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'symbol':
        case 'undefined':{
            if (localDev) {
                console.warn(`MsgDev: ${props}`)
            }
        }
        default: break;

    }
}
export default MsgDev