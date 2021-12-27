import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Input, InputNumber, Select, DatePicker, Checkbox, Button } from "antd";
import { CLargeSelect, CBatchInput } from "@components/index.js";
import {
  SearchOutlined,
  ReloadOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./index.less";
const { RangePicker } = DatePicker;
const { Option } = Select;

// 一个搜索组件，适合和表格配合使用
const CSearchModal = ({
  span = 6,       // 表单布局
  formList = [],  // 表单项
  onBack,         // 表单项值变化的回调
  onSearch,       // 查询回调
  children,       // 闭合标签内部子节点，建议是一些按钮
}) => {
  const [searchForm] = Form.useForm();
  let [expand, setExpand] = useState(false);

  // 搜索的回调
  const handleSearch = (v) => {
    if (onSearch) onSearch(v);
  };
  // 重置的回调
  const handleReset = () => {
    searchForm.resetFields();
    if (onSearch) onSearch("reset");
  };
  // 展开/隐藏高级搜索
  const toggle = () => {
    setExpand(!expand);
  };
  // 筛选条件值变化的回调
  const handleBack = (v, k) => {
    if (onBack) onBack(v, k);
  };

  return (
    <div className="c-search-modal">
      <Form
        name="searchForm"
        form={searchForm}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={handleSearch}
      >
        <Row gutter="24">
          {formList.map((item, idx) => {
            return item.type === "btn" ? (
              <Col key={idx} span={item.span || span}>
                <div className="search-tool">
                  <Button
                    className="o-btn"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    查询
                  </Button>
                  <Button
                    className="w-btn"
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                  {formList.length > 4 && (
                    <a className="more-btn" onClick={toggle}>
                      {expand ? (
                        <span>
                          合并
                          <RightOutlined />
                        </span>
                      ) : (
                        <span>
                          展开
                          <DownOutlined />
                        </span>
                      )}
                    </a>
                  )}
                </div>
              </Col>
            ) : (
              <Col
                key={item.key}
                span={item.span || span}
                style={{
                  display: idx < 24 / span || expand ? "block" : "none",
                }}
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
      {children}
    </div>
  );
};

CSearchModal.propTypes = {
  span: PropTypes.number,
  formList: PropTypes.array,
  onBack: PropTypes.func,
  onSearch: PropTypes.func,
};

export default CSearchModal;
