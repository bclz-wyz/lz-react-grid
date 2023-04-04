# LJTableSelect

This is an example component.

```jsx
import { LJTableSelect } from 'lj-react-grid';
// 模拟异步请求用户信息
const fetchUserInfo = (url) => {
  console.log('Changeurl:', url);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.5) {
        resolve({
          data: [
            { name: 'John', time: new Date().toLocaleString() },
            {
              name: 'job',
              time: new Date().toLocaleString(),
            },
          ],
        });
      } else {
        reject('这是一个随机的 Error');
      }
    }, 1000);
  });
};
const arr = ['id', 'value'];
// 获取行列，数据
const getInfo = (row, column, data) => {
  console.log(row, column, data, 11);
};
export default () => {
  return (
    <LJTableSelect fetchUrlData={fetchUserInfo} arr={arr} getInfo={getInfo} />
  );
};
```
