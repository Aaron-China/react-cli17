import React, { useState } from "react";
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from "@api/login";
import { setUser } from "@store/modules/app/action";
import "./index.less";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    login(values).then(res => {
      setLoading(false);
      if(res.code === 200) {
        const { permission, token } = res.data;
        let auth = {}, param = {};
        permission.filter(item => item.type === 'btn').forEach(item => {
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
          permission,
          auth,
          token
        };
        dispatch(setUser(param))
        message.success('登陆成功');
        // 这里应该根据实际权限跳转，通常是home，或者其他页面
        navigate('/report');
      } else {
        message.error(res.msg);
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('error', error);
      message.error(error)
    });
  };

  return (
    <div className="login-page">
      <div className="login">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
