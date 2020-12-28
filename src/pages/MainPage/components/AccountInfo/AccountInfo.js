import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import IconFont from '../../../../utils/iconfont/iconfont'
import { toDecimal } from '../../../../utils/utilFunc'

const AccountInfo = ({ accountInfo}) => {
  // console.log("===AI", accountInfo)
  const { info, isFetching } = accountInfo
  return (
    <>
      <div className="user-x">
        <span className="account-type">DEMO</span>
        <Avatar icon={<UserOutlined />} size={24} />
        <span className="account">11593</span>
      </div>
      <div className="account-info-x">
        <div className="ai-li">
          <span>余额</span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.balance, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>净值</span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.equity, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>可用保证金</span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.freeMargin, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>保证金比例</span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.marginLevel, 2)}%`}
          </span>
        </div>
        <div className="ai-li profit">
          <span>盈利：&nbsp;</span>
          <span
            className={info.profit > 0 ? 'color-up' : 'color-down'}
          >
            {isFetching ? '---' : toDecimal(info.profit, 2)}
          </span>
          <span>&nbsp;USD</span>
        </div>
      </div>
      <Button type="primary" className="btn-more">
        <IconFont type="iconQues" className="main-icon-ques" />
      </Button>
    </>
  )
}

export default AccountInfo