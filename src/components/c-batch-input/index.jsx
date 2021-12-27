import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import "./index.less";
const { TextArea } = Input;

// 一个自定义分隔符，批量输入的组件
const CBatchInput = ({
  title = '编辑',     // 弹窗标题
  value = '',         // 值
  mark = ',',         // 值的分隔符，默认英文逗号
  placeholder = '',   // 默认提示
  onChange            // 值变化的回调
}) => {
  let [visible, setVisible] = useState(false);
  let [input, setInput] = useState('');
  let [textarea, setTextarea] = useState('');

  useEffect(() => {
    setInput(value);
  }, [value]);

  // 输入框 回调
  const inputChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
    if(onChange) onChange(e)
  };
  //  展示弹窗
  const showModal =() => {
    const reg = new RegExp(mark,"g");;
    setTextarea((input || '').replace(reg, '\n'));
    setVisible(true);
  };
  // 文本域 回调
  const textChange = (e) => {
    setTextarea(e.target.value);
  };
  // 弹窗取消
  const handleCancel = () => {
    setVisible(false);
  };
  // 弹窗确定
  const handleOk = () => {
    const reg = new RegExp("[\r\n]","g");
    let newValue = (textarea || '').replace(reg, mark)
    if(newValue[newValue.length- 1] === mark) {
      newValue = newValue.slice(0, newValue.length - 1)
    }
    setInput(newValue)
    setVisible(false)
    // 返回默认监听的数据类型
    if(onChange) onChange(newValue)
  };

  return (
    <div className="c-batch-input">
      <Input 
        style={{width: '100%'}}
        value={input}
        placeholder={placeholder}
        addonAfter={<CopyOutlined style={{cursor: 'pointer'}} onClick={showModal} />}
        onChange={inputChange}
      />

      <Modal
        visible={visible}
        title={title}
        width="70%"
        okText="确认"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea className="batch-input-text" value={textarea} rows={16} onChange={textChange} />
      </Modal>
    </div>
  );
};

CBatchInput.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  mark: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default CBatchInput;
