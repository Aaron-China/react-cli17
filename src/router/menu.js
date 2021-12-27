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
  {
    path: '/setting',
    name: 'setting',
    title: '配置中心',
    children: [
      {
        path: '/setting/user',
        name: 'user',
        title: '用户管理',
        children: [
          {
            path: '/setting/user/add',
            name: 'add',
            title: '新增',
            component: React.lazy(() => import('@views/setting/user/Add')),
          },
          {
            path: '/setting/user/edit',
            name: 'edit',
            title: '修改',
            component: React.lazy(() => import('@views/setting/user/Edit')),
          },
          {
            path: '/setting/user/delete',
            name: 'delete',
            title: '删除',
            component: React.lazy(() => import('@views/setting/user/Delete')),
          },
        ]
      },
      {
        path: '/setting/role',
        name: 'role',
        title: '角色管理',
        component: React.lazy(() => import('@views/setting/Role')),
      },
    ]
  },
  {
    path: '/gantt',
    name: 'gantt',
    title: '甘特图',
    component:  React.lazy(() => import('@views/Gantt')),
  },
]

export default MENU