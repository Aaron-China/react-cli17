import React from 'react'

// hidden 是否展示位菜单，默认false展示， true 不在菜单中展示，仅渲染到路由中
const MENU = [
  {
    path: '/report',
    name: 'report',
    title: '报表中心',
    // hidden: true,
    component:  React.lazy(() => import('@views/Report')),
  },
]

export default MENU