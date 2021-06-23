import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Radio } from 'antd'
import LineTabs from '../../../components/LineTabs/LineTabs'
import IconFont from '../../../utils/iconfont/iconfont'
import user from '../../../services/user'
import { getQueryString, popMessage } from '../../../utils/utilFunc'

const Login = (props) => {
  const { history } = props

  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('0')

  const onFinishByOA = (values) => {
    // console.log("===onFinishByOA values:", values)
    setLoading(true)
    const formData = Object.assign({}, values, { device: 'pc' })
    user.login(formData, 'oa2').then(res => {
      // 存储用户WT账号信息
      popMessage({ type: 'success', msg: '登录成功！' })
      setTimeout(() => {  // 加一个延时，否则message来不及显示
        // window.location.href = "./"
        history.push("/index")
      }, 1000);
    }).catch(err => {
      popMessage({ type: 'error', msg: '用户名或密码错误' })//err.msg || `${err}` })
      setLoading(false)
    })
  }
  const onFinishByMT4 = (values) => {
    setLoading(true)
    user.login(values, 'mt4').then(res => {
      popMessage({ type: 'success', msg: '登录成功！' })
      setTimeout(() => {  // 加一个延时，否则message来不及显示
        // window.location.href = "./"
        history.push("/index")
      }, 1000);
    }).catch(err => {
      popMessage({ type: 'error', msg: err.msg || `${err}` })
      setLoading(false)
    })
  }
  const autoLogin = () => {
    const token = getQueryString('t')
    if(token) {
      user.login({ token }, 'oa1').then(res => {
        popMessage({ type: 'success', msg: '已为您自动登入账号' })

        history.push("/index")
        history.location.search = ''
      }).catch(err => {
        history.location.search = ''
        popMessage({ type: 'error', msg: '出错啦，请手动登入' })//err.msg || `${err}` })
        setLoading(false)
      })
    }
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
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinishByOA}
          >
            <Form.Item 
              name="username"
              label="ALPHAZONE账号"
              rules={[{ required: true, message: '请输入ALPHAZONE账号'}]}
            >
              <Input 
                prefix={<IconFont type="iconUser" className="wt-icon" />}
                placeholder="请输入ALPHAZONE账号"
              />
            </Form.Item>
            <Form.Item 
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码'}]}
            >
              <Input.Password 
                prefix={<IconFont type="iconLock" className="wt-icon" />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item >
              没有ALPHAZONE账号？&nbsp;&nbsp;
              <a href="https://www.alphazone.com.cn/register.html">创建一个&nbsp;&gt;&gt;</a>
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
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinishByMT4}
          >
            <Form.Item 
              name="login"
              label="MT4账号"
              rules={[{ required: true, message: '请输入MT4账号'}]}
            >
              <Input 
                prefix={<IconFont type="iconUser" className="wt-icon" />}
                placeholder="请输入MT4账号"
              />
            </Form.Item>
            <Form.Item 
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码'}]}
            >
              <Input.Password 
                prefix={<IconFont type="iconLock" className="wt-icon" />}
                placeholder="请输入密码"
              />
            </Form.Item>
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
                className="lg-btn-submit"
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
    autoLogin()
  }, [])

  return (
    <div className="login-x">
      <h1 className="title">登录</h1>
      {/* <LineTabs 
        onChange={onChangeAcc}
        initialPanes={[
          { title: "ALPHAZONE账号登录", content: getFormJSX('0'), key: '0' },
          { title: "MT4账号登录", content: getFormJSX('1'), key: '1' }
        ]}
        activeKey={activeKey}
      /> */}
      <Form
        name="wt-login-oa"
        className="wt-login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinishByOA}
      >
        <Form.Item 
          name="username"
          label="ALPHAZONE账号"
          rules={[{ required: true, message: '请输入ALPHAZONE账号'}]}
        >
          <Input 
            prefix={<IconFont type="iconUser" className="wt-icon" />}
            placeholder="请输入ALPHAZONE账号"
          />
        </Form.Item>
        <Form.Item 
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码'}]}
        >
          <Input.Password 
            prefix={<IconFont type="iconLock" className="wt-icon" />}
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item >
          没有ALPHAZONE账号？&nbsp;&nbsp;
          <a href="https://www.alphazone.com.cn/register.html">创建一个&nbsp;&gt;&gt;</a>
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
    </div>
  )
}

export default Login