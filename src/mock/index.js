import Mock from 'mockjs';
import LOGIN from './login';
import REPORT from './report';

Mock.setup({
  timeout: 700
});

// 登陆
Mock.mock('/api/login', 'post', () => {
  return {
    code: 200,
    msg: 'success',
    data: {
      ...LOGIN.userInfo
    }
  }
})
// 获取用户信息
Mock.mock('/api/getUserInfo', 'post', () => {
  return {
    code: 200,
    msg: 'success',
    data: {
      ...LOGIN.userInfo
    }
  }
})

// 获取报表列表
Mock.mock('/api/report/list', 'post', d => {
  let body = JSON.parse(d.body), list = [...REPORT.list], newL = [];
  if(body.factoryNo) {
    list = list.filter(item => item.factoryNo === body.factoryNo)
  }
  if(body.materialCode) {
    list = list.filter(item => item.materialCode.indexOf(body.materialCode) > -1 )
  }
  newL = list.slice((body.current-1)*body.size, body.current*body.size);

  return {
    code: 200,
    msg: 'success',
    data: {
      records: newL,
      current: body.current,
      size: body.size,
      total: list.length
    }
  }
})

// 报表保存
Mock.mock('/api/report/save', 'post', d => {
  return {
    code: 200,
    msg: 'success',
  }
})
