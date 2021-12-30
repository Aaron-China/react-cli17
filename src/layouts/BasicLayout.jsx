import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Dropdown, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CMenu } from '@components/index'
import MENU from '@router/menu'
import { getUserInfo } from "@api/login";
import { filterMenu, getMenuKeys } from '@utils/util'
import { setToken, setUser } from "@store/modules/app/action";
import './BasicLayout.less'

// 递归路由
const mapMenu = (l) => {
  return l.map((item,index) => {
    if(item.component) {
      return (<Route exact path={item.path} element={<item.component />} key={index}>
        {item.children && item.children.length && mapMenu(item.children)}
      </Route>)
    } else {
      return item.children && item.children.length && mapMenu(item.children)
    }
  })
};

const BasicLayout = () => {
  const navigate = useNavigate();
  const navigation = useRef(navigate);
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  let [menu, setMenu] = useState({
    list: [],
    activeKey: '',
    activeKeys: ''
  });

  // 退出登录
  const logout = () => {
    dispatch(setToken({token: ''}));
    navigate('/login');
  }
  const dropdownMenu = (<Menu>
    <Menu.Item key="logout" onClick={logout}>退出登录</Menu.Item>
  </Menu>);
  // 渲染路由,减少页面渲染次数
  const renderRoute = useMemo(() => mapMenu(MENU), []);

  useEffect(() => {
    // 初始化时，获取用户信息、权限等
    getUserInfo().then(res => {
      if(res.code === 200) {
        let auth = {}, perm = res.data.permission, to = res.data.token, param = {}, factoryList = res.data.factoryList;
        perm.filter(item => item.type === 'btn').forEach(item => {
          if(auth[item.path]) {
            auth[item.path][item.key] = true
          } else {
            auth[item.path] = {
              [item.key]: true
            }
          }
        })
        param = {
          user: { id: 1186, name: '张三' },
          perm,
          auth,
          token: to,
          factoryList: factoryList
        };
        dispatch(setUser(param));
        // 刷新界面、输入地址时，校验权限
        // 相当于实现了路由守卫的功能
        let flag = perm.some(item => item.path === window.location.pathname);
        if(!flag) navigation.current.navigate('/login');
        // 按权限过滤菜单,转一下json，避免对象原型修改, 默认菜单数据
        let m = JSON.parse(JSON.stringify(MENU)),
            permi = perm.filter(item => item.type === 'menu'),
            list = filterMenu(m, permi);
        let actives = getMenuKeys(MENU, window.location.pathname);
        
        setMenu({
          list,
          ...actives
        });
      } else {
        message.error(res.msg);
      }
    })
  }, [dispatch, navigation]);

  return (<div className='basicLayout'>
    <CMenu 
      list={menu.list}
      active={menu.activeKey}
      actives={menu.activeKeys}
    />
    <div className='content'>
      <div className='header'>
        <div className="avatar">
          <Dropdown overlay={dropdownMenu} placement="bottomLeft">
            <div>
              <UserOutlined />
              <span className="name">{user.name || ''}</span>
            </div>
          </Dropdown>
        </div>
      </div>
      <div className='body'>
        <Routes>
          { renderRoute }
        </Routes>
      </div>
    </div>
  </div>);
}
export default BasicLayout
