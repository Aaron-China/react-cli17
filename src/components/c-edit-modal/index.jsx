import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Row, Col, Input, InputNumber, Select, DatePicker, Checkbox, Button } from "antd";
import { CLargeSelect, CBatchInput } from "@components/index.js";
import "./index.less";
const { RangePicker } = DatePicker;
const { Option } = Select;

// 一个搜索组件，适合和表格配合使用
const CEditModal = ({
  loading = false,    // 加载状态
  visible = false,    // 是否显示
  title = '',         // 标题
  width = '70%',      // 弹窗宽度
  type = 'add',       // 操作类型
  span = 6,           // 表单布局
  maskClosable = false,    // 点击遮罩层是否关闭
  initData = {},      // 初始化数据
  formItems = [],     // 所有的项
  onBack,             // 数据项变化的回调
  onClose             // 关闭的回调
}) => {
  const [editForm] = Form.useForm();

  useEffect(() => {
    if(visible) init()
  }, [visible]);

  // 初始化
  const init = () => {
    if(type === 'edit') {
      editForm.setFieldsValue(initData);
    } else {
      editForm.resetFields();
    }
  };
  // 确定的回调
  const handleOk = () => {
    let v = editForm.getFieldsValue();
    if (onClose) onClose(v);
  };
  // 去取消的回调
  const handleCancel = () => {
    if (onClose) onClose('cancel');
  };
  // 值变化的回调
  const handleBack = (v, k) => {
    if (onBack) onBack(v, k);
  };

  return (
    <Modal
      className="c-edit-modal"
      title={title} 
      width={width}
      visible={visible}
      forceRender={true}
      maskClosable={maskClosable}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="confirm" type="primary" loading={loading} onClick={handleOk}>
          确定
        </Button>
      ]}
    >
      <Form
        name="editForm"
        form={editForm}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Row gutter="24">
          {formItems.map(item => {
            return (
              <Col
                key={item.key}
                span={item.span || span}
              >
                {item.type === "input" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder={item.placeholder || "请输入"}
                      onChange={(e) =>
                        item.needBack && handleBack(e.target.value, item.key)
                      }
                    />
                  </Form.Item>
                )}
                {item.type === "number" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder={item.placeholder || "请输入"}
                      min={item.min || 0}
                      precision={item.precision || 0}
                      onChange={(e) =>
                        item.needBack && handleBack(e.target.value, item.key)
                      }
                    />
                  </Form.Item>
                )}
                {item.type === "select" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      allowClear
                      mode={item.mode || null}
                      placeholder={item.placeholder || "请输入"}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement
                      }
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        `${option.children}`
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(e) => item.needBack && handleBack(e, item.key)}
                    >
                      {item.option.map((optionItem, optionKey) => {
                        return (
                          <Option
                            key={optionKey}
                            title={optionItem.title || optionItem.label}
                            value={optionItem.value}
                          >
                            {optionItem.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                {item.type === "largeSelect" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <CLargeSelect
                      showSearch
                      list={item.option}
                      onChange={(e) => item.needBack && handleBack(e, item.key)}
                    />
                  </Form.Item>
                )}
                {item.type === "batchInput" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <CBatchInput
                      style={{ width: "100%" }}
                      placeholder={item.placeholder || "请输入"}
                      onChange={(e) =>
                        item.needBack && handleBack(e.target.value, item.key)
                      }
                    />
                  </Form.Item>
                )}
                {item.type === "datepicker" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      allowClear={item.allowClear || false}
                      format={item.format || "YYYY-MM-DD"}
                      showTime={!!item.showTime}
                      getPopupContainer={(trigger) => trigger.parentElement}
                      onChange={(e) => item.needBack && handleBack(e, item.key)}
                    />
                  </Form.Item>
                )}
                {item.type === "rangepicker" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <RangePicker
                      style={{ width: "100%" }}
                      allowClear={item.allowClear || false}
                      format={item.format || "YYYY-MM-DD"}
                      showTime={!!item.showTime}
                      getPopupContainer={(trigger) => trigger.parentElement}
                      onChange={(e) => item.needBack && handleBack(e, item.key)}
                    />
                  </Form.Item>
                )}
                {item.type === "checkbox" && (
                  <Form.Item
                    label={item.label}
                    name={item.key}
                    valuePropName='checked'
                    rules={[
                      {
                        required: !!item.required,
                        message: `${item.label}为必填项!`,
                      },
                      ...(item.rules || []),
                    ]}
                  >
                    <Checkbox
                      style={{width: '100%'}}
                      onChange={(e) => item.needBack && handleBack(e.target.value, item.key)}
                    >
                      {item.label}
                    </Checkbox>
                  </Form.Item>
                )}
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
};

CEditModal.propTypes = {
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.string,
  span: PropTypes.number,
  isMaskClosable: PropTypes.bool,
  initData: PropTypes.object,
  formItems: PropTypes.array,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onBack: PropTypes.func,
  onClose: PropTypes.func,
};

export default CEditModal;
