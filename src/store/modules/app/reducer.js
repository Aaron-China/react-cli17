
const initState={
  token: '',   //token
  user: {},   // 用户信息
  factoryList: [
    {value: '001', label: '华为'},
    {value: '002', label: '谷歌'},
    {value: '003', label: '中芯国际'},
    {value: '004', label: '宁德时代'}
  ],
  permission: [],   // 所有权限. type 类型 区分菜单和按钮  path权限所在的菜单路径  key 是权限关键字,按钮才有
  auth: [],         //   按钮权限

};
const reducer = (state = initState, action) => {
  const d = action.data;
  switch (action.type) {
  case 'app/setToken':
    localStorage.setItem('token', action.token);
    return {
      ...state,
      token: d.token
    }
  case 'app/setUser':
    localStorage.setItem('token', action.token);
    return {
      ...state,
      user: d.user,
      permission: d.permission,
      auth: d.auth,
      token: d.token
    }
  default:
    return state
  }
};

export default reducer
