import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@store/index';
import 'dayjs/locale/zh-cn';
import App from './App';
import './index.less';

import '@mock/index.js';

// antd 某些组件，StrictMode 模式，会有报警告的语法
ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);
