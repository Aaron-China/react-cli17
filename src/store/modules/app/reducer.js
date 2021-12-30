
const initState = {
  token: '',   //token
  user: {},   // 用户信息
  factoryList: [],
  permission: [],   // 所有权限. type 类型 区分菜单和按钮  path权限所在的菜单路径  key 是权限关键字,按钮才有
  auth: [],         //   按钮权限
};
const app = (state = initState, action) => {
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
      token: d.token,
      factoryList: d.factoryList
    }
  default:
    return state
  }
};
let  a = app
export default a;
