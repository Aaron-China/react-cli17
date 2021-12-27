import React, { useState, useEffect } from "react";
import { CTable, CSearchModal, CEditModal } from '@components/index.js'
import { Button} from 'antd';
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { getList, saveD } from "@api/report";
import { checklength, checkRepeat } from '@utils/util'
const formList = [
  { label: '工厂', key: 'factoryNo', type: 'select', option: [], needBack: true },
  { label: '物料编码', key: 'materialCode', type: "batchInput", rules: [
    { pattern: new RegExp(/^[a-zA-Z0-9,]*$/, 'g'), message: '仅允许输入数字和字母，并以英文逗号分隔' },
    { validator: checkRepeat }, // 校验长度
    { validator: checklength }  // 校验重复性
  ] },
  { label: '物料名称', key: 'materialName', type: "input" },
  { type: "btn", name: 'btn' },
  { label: '版本号', key: 'version', type: "largeSelect", option: [] },
  { label: '数量', key: 'qty', type: "number" },
  { label: '发货时间', key: 'sendTime', type: "datepicker" },
  { label: '生产时间', key: 'createTime', type: "rangepicker" },
  { label: '换产', key: 'change', type: "checkbox" },
];
const modalFormList = [
  { label: '工厂', key: 'factoryNo', type: "select", option: [], required: true },
  { label: '物料编码', key: 'materialCode', type: "batchInput" },
  { label: '数量', key: 'qty', type: "number" },
];
let pagination = { current: 1, pageSize: 3, total: 0 };

function Report() {
  const factoryList = useSelector(state => state.app.factoryList),
        auth = useSelector(state => state.app.auth[window.location.pathname] || {});
  let [loading, setLoading] = useState(false),
      [search, setSearch] = useState({}),
      [dataSource, setDataSource] = useState([]),
      [selectedRowId, setSelectedRowId] = useState([]),
      [selectedRowKeys, setSelectedRowKeys] = useState([]),
      [modal, setModal] = useState({}),
      [formData, setFormData] = useState({});
  const columns = [
    { title: '工厂名称', dataIndex: "factoryName", width: 80 },
    { title: '物料编码', dataIndex: "materialCode", width: 90 },
    { title: '物料名称', dataIndex: "materialName", width: 130, ellipsis: true },
    { title: 'BOM层级', dataIndex: "bomLevel", width: 80 },
    { title: '版本号', dataIndex: "version", width: 80 },
    { title: '数量', dataIndex: "qty", width: 100 },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 70,
      align: 'center',
      render: (text, record ) => {
        return auth.edit ? (<a onClick={() => edit(record) }>编辑</a>) : ''
      }
    }
  ];
  useEffect(() => {
    //初始化数据 
    formList[0].option = factoryList
    modalFormList[0].option = factoryList
    let list =[];
    for (let i = 0; i < 999; i++) {
      list.push({label: i+1, value: i+1})
    }
    formList[4].option = list
    getData();
  }, []);

  // 查询表格数据
  const getData = () => {
    setLoading(true);
    const params = {
      ...search,
      current: pagination.current,
      size: pagination.pageSize
    }
    getList(params).then(res => {
      if (res.code === 200) {
        let d = res.data;
        setDataSource(d.records);
        pagination = {
          current: d.current, pageSize: d.size, total: d.total
        };
      }
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
    });
  };
  // 搜索
  const handleSearch = (d) => {
    if(d.sendTime) d.sendTime = dayjs(d.sendTime).format('YYYY-MM-DD HH:mm:ss')
    if(d.createTime) {
      d.createTime = [
        dayjs(d.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(d.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      ]
    }
    pagination.current = 1;
    setSearch(d);
    getData();
  };
  // 搜索框单个项值变化的回调
  const handleBack = (v, k) => {
    console.log(v, k)
  };
  // 选择表格数据
  const handleSelect = (keys, rows) => {
    setSelectedRowId(keys);
    setSelectedRowKeys(rows);
  };
  // 分页、筛选、排序变化
  const tableChange = (p, f, s) => {
    pagination.current = p.current
    pagination.pageSize = p.pageSize
    getData();
  };
  // 新增
  const add = () => {
    setModal({
      visible: true,
      title: '新增',
      type: 'add'
    });
    setFormData({});
  }
  // 编辑
  const edit = (d) => {
    setModal({
      visible: true,
      title: '编辑',
      type: 'edit'
    });
    setFormData({...d});
  }
  // 新增/编辑弹窗保存
  const modalClose = (d) => {
    if(d !== 'cancel') {
      setModal({ ...modal, loading: true });
      saveD().then(res => {
        if (res.code === 200) {
          setModal({
            loading: false,
            visible: false,
            title: '新增',
            type: 'add'
          });
          setFormData({});
        } else {
          setModal({ ...modal, loading: false });
        }
      })
      .catch(err => {
        setModal({ ...modal, loading: false });
      });
    } else {
      setModal({
        loading: false,
        visible: false,
        title: '新增',
        type: 'add'
      });
      setFormData({});
    }
  }
  // 批量删除
  const deleteM = () => {
    let list = dataSource.filter(item => {
      return !selectedRowId.some(s => s === item.id)
    })
    setDataSource([...list]);
  }
  // 导出
  const exportE = () => {
    // let newC = []
    // columns.forEach(item => {
    //   if(item.dataIndex !== "operation") {
    //     newC.push(item)
    //   }
    // })
    // expoerExcel(newC, dataSource, '表格下载')
  }

  return (
    <div className="report-page">
      <CSearchModal formList={formList} onSearch={handleSearch} onBack={handleBack}>
        <div>
          {auth.add && <Button className="n-btn" onClick={add} >新增</Button>}
          {auth.delete && <Button className="d-btn" style={{marginLeft: '15px'}} onClick={deleteM}>批量删除</Button>}
          {auth.export && <Button className="n-btn" style={{marginLeft: '15px'}} onClick={exportE}>导出</Button>}
        </div>
      </CSearchModal>
      <CTable
        loading={loading}
        selected
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        total={pagination.total}
        selectedRow={selectedRowId}
        tableChange={tableChange}
        selectChange={handleSelect}
      >
      </CTable>
      <CEditModal
        loading={modal.loading}
        visible={modal.visible}
        title={modal.title}
        type={modal.type}
        span={12}
        initData={formData}
        formItems={modalFormList}
        onClose={modalClose}
      />
    </div>
  );
}

export default Report;
