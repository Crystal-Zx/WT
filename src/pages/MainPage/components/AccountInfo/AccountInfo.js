import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Image } from 'antd';
import IconFont from '../../../../utils/iconfont/iconfont'
import { toDecimal } from '../../../../utils/utilFunc'

import { getAccountInfo } from '../../MainAction'

const AccountInfo = ({ accountInfo, getAccountInfo }) => {
  const { info, isFetching } = accountInfo
  // console.log("====AccountInfo render", info)
  useEffect(() => {
    // 获取账户信息
    getAccountInfo()
  }, [])
  return (
    <>
      <div className="user-x">
        {/* <span className="account-type">DEMO</span>
        <Avatar icon={<UserOutlined />} size={24} />
        <span className="account">11593</span> */}
        <Image 
          width={'90%'} 
          src="/img/logo_fff.png"
        />
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
      <Button type="default" className="btn-more">
        <IconFont type="iconQues" className="wt-icon main-icon-ques" />
      </Button>
    </>
  )
}

export default connect(
  state => {
    const {
      accountInfo
    } = state.MainReducer
    return {
      accountInfo
    }
  },
  dispatch => {
    return {
      getAccountInfo: () => {
        return dispatch(getAccountInfo())
      }
    }
  }
)(AccountInfo)