import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Radio } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import styles from './Login.module.scss'
import user from '../../services/user'
import { popMessage } from '../../utils/utilFunc'
import LineTabs from '../LineTabs/LineTabs'

const Login = () => {
  
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('0')

  const onFinishByOA = (values) => {
    console.log("===onFinishByOA values:", values)
    setLoading(true)
    const formData = Object.assign({}, values, { device: 'pc' })
    user.login(formData, 'oa').then(res => {
      console.log("===Login loginOA res:", res)
      // 存储用户WT账号信息
      popMessage({ type: 'success', msg: '登录成功！' })
      setTimeout(() => {  // 加一个延时，否则message来不及显示
        setLoading(false)
        setVisible(false)
        window.location.reload()
      }, 1000);
    }).catch(err => {
      console.log("===Login loginOA err:", err)
      popMessage({ type: 'error', msg: err.msg || `${err}` })
      setLoading(false)
    })
  }
  const onFinishByMT4 = (values) => {
    setLoading(true)
    user.login(values, 'mt4').then(res => {
      popMessage({ type: 'success', msg: '登录成功！' })
      setTimeout(() => {  // 加一个延时，否则message来不及显示
        setLoading(false)
        setVisible(false)
        window.location.reload()
      }, 1000);
    }).catch(err => {
      popMessage({ type: 'error', msg: err.msg || `${err}` })
      setLoading(false)
    })
  }
  const onChangeAcc = (acc) => {
    setActiveKey(acc)
  }
  const onChangeType = (e) => {
    sessionStorage.setItem("wt_selectType", e.target.value)
  }
  const getFormJSX = (currKey) => {
    switch(currKey) {
      case '0':
        return (
          <Form
            name="wt-login-oa"
            className="wt-login"
            initialValues={{ remember: true }}
            onFinish={onFinishByOA}
          >
            <Form.Item 
              name="username"
              rules={[{ required: true, message: '请输入ALPHAZONE账号'}]}
            >
              <Input 
                prefix={<IconFont type="iconUser" className="wt-icon" />}
                placeholder="请输入ALPHAZONE账号"
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
        )
      case '1':
        return (
          <Form
            name="wt-login-mt4"
            className="wt-login"
            initialValues={{ remember: true }}
            onFinish={onFinishByMT4}
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
            <Form.Item
              name="type"
            >
              <Radio.Group 
                defaultValue={1}
                onChange={onChangeType}
              >
                <Radio value={1}>模拟账户</Radio>
                <Radio value={2}>实盘账户</Radio>
              </Radio.Group>
            </Form.Item>
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
        )
      default: return
    }
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
      <LineTabs 
        onChange={onChangeAcc}
        initialPanes={[
          { title: "alphaZone账号登录", content: getFormJSX('0'), key: '0' },
          { title: "MT4账号登录", content: getFormJSX('1'), key: '1' }
        ]}
        activeKey={activeKey}
      />
    </Modal>
  )
}

export default Login