import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Select } from 'antd';
import "./index.less";
const { Option } = Select;
const ROWS = 8,           // 局部渲染的数据条数
      HEIGHT = 31.6,      // 每行的高度
      LISTHEIGHT = 250;   // 可视高度
let idx = 0,                  // 当前开始下标
    mousedown = false;        // 自定义滚动条按下事件标志

// 一个可支持大量数据 不卡顿的 下拉框组件
const CLargeSelect = ({
  value,              // 值
  placeholder = '',   // 默认填充文字
  list = [],          // 所有数据列表
  rows = ROWS,        // 实际渲染的数据条数
  rowHeight = HEIGHT, // 每条数据的行高
  listHeight = LISTHEIGHT,     // 下拉列表可视高度
  onChange            // 值变化的回调
}) => {
  const scrollEle = useRef();  // 滚动条dom对象
  let [totalHeight, setTotalHeight] = useState(LISTHEIGHT),
      [show, setShow] = useState([]),
      [open, setOpen] = useState(false);

  useEffect(() => {
    setShow(list.length > rows ? list.slice(0, rows) : list);
    setTotalHeight(list.length * rowHeight);
    initScroll();
    // 卸载前，取消监听
    return () => {
      if(list.length > rows && scrollEle.current) {
        scrollEle.current.removeEventListener('scroll', handleScroll, false);
        scrollEle.current.removeEventListener('mousedown', handleMouse, false);
        scrollEle.current.removeEventListener('mouseup', handleMouse, false);
      }
      setOpen(false);
      setShow([]);
    }
  }, [list]);

  // 初始化事件
  const initScroll = () => {
    if(list.length > rows) {
      scrollEle.current.scrollTop = 0
      scrollEle.current.addEventListener('scroll', handleScroll);
      scrollEle.current.addEventListener('mousedown', () => handleMouse(true));
      scrollEle.current.addEventListener('mouseup', () => handleMouse(false));
    }
  };
  // 监听鼠标事件的方法
  const handleMouse = (v) => {
    mousedown = v
  };
  // 监听虚拟滚轮变化，计算展示的数据
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight } = e.target
    let lenMax = list.length, nIdx;
    
    if(scrollTop === 0) { // 滑到顶，从头展示
      setShow(list.slice(0, rows));
      idx = 0
    } else if(scrollTop - (scrollHeight - listHeight) > -rowHeight ) { // 滑到底了，但是js监听精度不准，需要做一行的误差容错
      nIdx = lenMax - rows;
      setShow(list.slice(nIdx, nIdx + rows));
      idx = nIdx;
    } else {  // 其他情况，照常处理数据
      nIdx = Math.ceil(scrollTop * lenMax / scrollHeight)
      if(nIdx !== idx && nIdx <= (lenMax - rows)) {
        setShow(list.slice(nIdx, nIdx + rows));
        idx = nIdx;
      }
    }
  };
  const handleSearch = (d) => {
    let newList = list.filter(item => `${item.label}`.toLowerCase().indexOf(d.toLowerCase()) >= 0);
    setShow(newList.slice(0, rows));
    setTotalHeight(newList.length * rowHeight);
  };
  const handleChange = (d = '', op) => {
    if(list.length > rows) {
      let tar = list.find(item => item.value === d)
      setShow([tar, ...list.filter(item => item.value !== d).slice(0, rows - 1)]);
      setTotalHeight(list.length * rowHeight);
    }
    let tar = list.find(item => item.value === d);
    if(onChange) onChange(d, op, tar);
  };
  const handleDrop = (d) => {
    setOpen(mousedown ? true : d)
  };

  return (
    <div className='c-large-select'>
      <Select 
        style={{width: '100%'}}
        showSearch
        value={value}
        open={open}
        placeholder={placeholder}
        getPopupContainer={triggerNode => triggerNode.parentElement}
        optionFilterProp="children"
        filterOption={(input, option) =>
          `${option.children}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onSearch={handleSearch}
        onChange={handleChange}
        onDropdownVisibleChange={handleDrop}
      >
        {
          show.map(op => {
            return (<Option value={op.value} title={op.title || op.label} key={op.value}>{op.label}</Option>)
          })
        }
      </Select>
      <div className="sc" ref={scrollEle} style={{height: listHeight+'px', display: (open && list.length > rows) ? 'block' : 'none'}}>
        <div className="scbc" style={{height: totalHeight+'px'}}></div>
      </div>
    </div>
  )
};

CLargeSelect.propTypes = {
  placeholder: PropTypes.string,
  list: PropTypes.array,
  rows: PropTypes.number,
  rowHeight: PropTypes.number,
  listHeight: PropTypes.number,
  onChange: PropTypes.func,
};

export default CLargeSelect;
