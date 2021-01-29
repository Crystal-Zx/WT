import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Checkbox, message } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import styles from './Login.module.scss'
import user from '../../services/user'
import { popMessage } from '../../utils/utilFunc'

const Login = () => {
  
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  // console.log("====Login", visible)

  const onFinish = (values) => {
    setLoading(true)
    user.login(values).then(res => {
      // message.success("登录成功！")
      popMessage({ type: 'success', msg: '登录成功！' })
      setTimeout(() => {  // 加一个延时，否则message来不及显示
        setLoading(false)
        setVisible(false)
        window.location.reload()
      }, 1000);
    }).catch(err => {
      // message.error(err.msg || `${err}`)
      popMessage({ type: 'error', msg: err.msg || `${err}` })
      setLoading(false)
    })
  }
  useEffect(() => {
    setVisible(!user.isLogin())
  }, [user.isLogin()])

  return (
    <Modal
      title="登录"
      visible={visible}
      getContainer={document.body}
      className={styles['wt-login-x']}
      wrapClassName='wt-login-x'
      keyboard={false}
      closable={false}
      footer={null}
    >
      <Form
        name="wt-login"
        className="wt-login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item 
          name="login"
          rules={[{ required: true, message: '请输入MT4账号'}]}
        >
          <Input 
            prefix={<IconFont type="iconUser" className="wt-icon" />}
            placeholder="请输入MT4账号"
          />
        </Form.Item>
        <Form.Item 
          name="password"
          rules={[{ required: true, message: '请输入密码'}]}
        >
          <Input 
            prefix={<IconFont type="iconLock" className="wt-icon" />}
            placeholder="请输入密码"
          />
        </Form.Item>
        {/* <Form.Item
          name="remember"
          valuePropName="checked"
          // noStyle
        >
          <Checkbox>记住密码</Checkbox>
        </Form.Item> */}
        <Form.Item noStyle>
          <Button 
            type="primary"
            htmlType="submit"
            className="wt-btn-ok lg-btn-submit"
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Login