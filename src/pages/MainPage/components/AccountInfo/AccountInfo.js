import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Image } from 'antd';
import { toDecimal } from '../../../../utils/utilFunc'

import { getAccountInfo } from '../../MainAction'
import { FormattedMessage } from 'react-intl';

const AccountInfo = ({ accountInfo, getAccountInfo }) => {
  const { info, isFetching } = accountInfo
  // console.log("====AccountInfo render", info)
  useEffect(() => {
    // 获取账户信息
    getAccountInfo()
  }, [])
  return (
    <>
      <div 
        className="user-x"
        onClick={() => window.open("https://www.alphazone.com.cn/login.html") }
      >
        <Image 
          width={'90%'} 
          src="./img/logo_fff.png"
          preview={false}
        />
      </div>
      <div className="account-info-x">
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item1" defaultMessage="余额" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.balance, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>
          <FormattedMessage id="accountInfo.item2" defaultMessage="净值" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.equity, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item3" defaultMessage="可用保证金" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.freeMargin, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item4" defaultMessage="保证金比例" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.marginLevel, 2)}%`}
          </span>
        </div>
        <div className="ai-li profit">
          <span>
            <FormattedMessage id="accountInfo.item5" defaultMessage="盈利" />：&nbsp;
          </span>
          <span
            className={info.profit > 0 ? 'color-up' : 'color-down'}
          >
            {isFetching ? '---' : toDecimal(info.profit, 2)}
          </span>
          <span>&nbsp;USD</span>
        </div>
      </div>
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