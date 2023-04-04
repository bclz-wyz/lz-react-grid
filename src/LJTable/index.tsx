import React, { useEffect, memo, useMemo } from 'react'
import clsx from 'clsx';
import './style.less'
import * as _ from 'lodash'

interface data {
    id: string;
    value: string
}

interface TableProps {
    row: Number;
    column: Number;
    data?: data[];
    setOneRow: any;
    development?: boolean

}
const LJTableSelect: React.FC<TableProps> = memo((props) => {
    let oneRow: any = []

    const onChangeRow = (key: any, event: any, id: string) => {
        oneRow[key] = event.target.value
        props.setOneRow(id, oneRow)
    }
    const gridState = useMemo(() => {
        const { data, row, column } = props;
        if (data) {
            oneRow = _.cloneDeep(data[0].value.split(","))
            let rows: JSX.Element[] = [];
            let columns: JSX.Element[] = [];
            let nullElm: JSX.Element[] = [];
            let arrs: any = [];
            let firstRows: JSX.Element[] = [];
            for (let index = 0; index < column; index++) {
                firstRows.push(<input type="text" key={index} defaultValue={data[0].value.split(",")[index]} onChange={(e) => { onChangeRow(index, e, data[0].id) }} />);
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
    }, [])

    return (
        <div>
            {gridState}
        </div>)


})
export default LJTableSelect