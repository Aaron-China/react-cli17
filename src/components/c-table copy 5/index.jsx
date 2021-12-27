import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table } from 'antd';
import "./index.less";
const page = {
  default: {
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["20", "50", "100", "200", "500", "1000"],
  },
};

const CTable = ({
  loading = false,
  rowKey = "id",
  columns = [],
  dataSource = [],
  pagination = page,
  selected = false,
  scrollX,
  scrollY,
  total,
  selectedRow = [],
  selectChange,
  tableChange
}) => {
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setSelectedRowKeys(selectedRow);
  }, [selectedRow]);

  // 表格页码变化、排序、筛选回调
  const handleTableChange = (pagination, filters, sorter) => {
    if(tableChange) tableChange(pagination, filters, sorter)
  };
  // 单选回调
  const handleSelect = (d, dl) => {
    setSelectedRowKeys(d);
    if(selectChange) selectChange(d, dl);
  };
  // 全选回调，需要手动填充数据
  const handleSelectAll = (d) => {
    let keys = [], dates = []
    if(d) {
      keys = dataSource.map(item => item[rowKey])
      dates = [...dataSource]
    }
    handleSelect(keys, dates)
  };

  return (
    <div className="c-table">
      <Table
        loading={loading}
        columns={columns}
        row-key={record => record[rowKey]}
        rowClassName={(row, idx) => { return idx % 2 === 1? 'dark-row' : 'light-row'}}
        data-source={dataSource}
        row-selection={selected ? { selectedRowKeys: selectedRowKeys, onChange: handleSelect, onSelectAll: handleSelectAll } : null}
        onChange={handleTableChange}
        pagination={!!pagination ? {showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['20', '50', '100', '200', '500', '1000'], ...pagination} : false}
        scroll={{x: scrollX || true, x: scrollY || true}}
      />
      <span className="totalTip" style={{top: !!pagination ? '-27px' : '6px'}}>共 {total} 条数据</span>
    </div>
  );
};

CMenu.propTypes = {
  loading: PropTypes.bool,
  rowKey: PropTypes.string,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  selected: PropTypes.bool,
  scrollX: PropTypes.number,
  scrollY: PropTypes.number,
  total: PropTypes.number,
  selectedRow: PropTypes.array,
  selectChange: PropTypes.func,
  tableChange: PropTypes.func,
};

export default CTable;
