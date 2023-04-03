import React, { memo, useMemo } from 'react'
import clsx from 'clsx';
import './style.less'

interface data {
    id: string;
    value: string
}

interface TableProps {
    row: Number;
    column: Number;
    data?: data[];
    development?: boolean

}
const LJTableSelect: React.FC<TableProps> = memo((props) => {

    const onChangeRow = (key: any, event: any) => {
        console.log(key, event.target.value, 1234)

    }
    const gridState = useMemo(() => {
        const { data, row, column } = props;
        console.log(props, 123)
        if (data) {
            let rows: JSX.Element[] = [];
            let columns: JSX.Element[] = [];
            let nullElm: JSX.Element[] = [];
            let arrs: any = [];
            let firstRows: JSX.Element[] = [];
            for (let index = 0; index < column; index++) {
                firstRows.push(<input type="text" key={index} defaultValue={data[0].value.split(",")[index]} onChange={() => { onChangeRow(index, event) }} />);
            }
            for (let i = 1; i < data.length; i++) {
                columns = []
                nullElm = []
                for (let index = 0; index < column; index++) {
                    nullElm.push(<span key={index}></span>);
                    columns.push(<span key={index}>{data[i].value.split(",")[index]}</span>);

                }
                arrs[i] = columns
            }
            const rander = () => {
                const fristElm = arrs
                // 设置其他行
                for (let index = 1; index < row; index++) {
                    const item = <div className={clsx("rowElm")} key={data[index] ? data[index].id : index + 1}>{fristElm[index] ? fristElm[index] : nullElm} </div>
                    rows.push(item)
                }
                rows.unshift(
                    <div onClick={() => { }} className={clsx("fristElm")} key={data[0].id}>{firstRows} </div>
                )
                return rows

            }
            return (
                <div>
                    {
                        rander()
                    }
                </div>
            )
        }
    }, [props])

    return (
        <div>
            <div>{gridState}</div>
        </div>)


})
export default LJTableSelect