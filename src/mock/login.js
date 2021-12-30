const LOGIN = {
  userInfo: {
    token: '21312312312312',
    permission: [
      { type: 'menu', path: '/report', key: '' },
      { type: 'menu', path: '/setting', key: '' },
      { type: 'btn', path: '/report', key: 'add' },
      { type: 'btn', path: '/report', key: 'edit' },
      { type: 'btn', path: '/report', key: 'delete' },
      { type: 'btn', path: '/report', key: 'export' },
      { type: 'menu', path: '/setting/user/add' },
      { type: 'menu', path: '/setting/user/edit' },
      { type: 'menu', path: '/setting/user/delete' },
      { type: 'menu', path: '/setting/role' },
      { type: 'menu', path: '/login' },
      { type: 'menu', path: '/gantt' },
    ],
    factoryList: [
      {value: '001', label: '华为'},
      {value: '002', label: '谷歌'},
      {value: '003', label: '中芯国际'},
      {value: '004', label: '宁德时代'}
    ]
  }
}

export default LOGIN
