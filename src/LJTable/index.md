# LJTable

This is an example component.

```jsx
import { LJTable } from 'lj-react-grid';
export default () => {
  const data = [
    { id: '1', value: '代号,名称,实测值,理论值,单位' },
    { id: '2', value: '2,1,~,1,v' },
    { id: '3', value: '3,1,~,1,v' },
  ];
  // 修改第一行
  const setOneRow = (id, oneRow) => {
    console.log(id, oneRow, 11);
  };
  return <LJTable row={6} column={6} data={data} setOneRow={setOneRow} />;
};
```
