import { Row, Col } from 'antd'
import styles from './Login.module.scss'
import Description from './components/Description'
import Login from './components/Login'

const LoginPage = (props) => {
  
  const { history } = props
  // const linkToIndex = url => history.push(url)

  return (
    <div className={styles['login-x']}>
      <div className="container-x">
        <Row className="row-x" gutter={80} wrap={true}>
          <Col className="col-desc-x" xs={24} sm={24} md={10} lg={10} xl={10}>
            <Description />
          </Col>
          <Col className="col-login-x" xs={24} sm={24} md={14} lg={14} xl={14}>
            <Login history={history} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default LoginPage