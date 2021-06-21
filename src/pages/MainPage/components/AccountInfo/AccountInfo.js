import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Image, Modal } from 'antd';
import { toDecimal } from '../../../../utils/utilFunc'

import { getAccountInfo } from '../../MainAction'
import { FormattedMessage } from 'react-intl';
import IconFont from '../../../../utils/iconfont/iconfont';

const AccountInfo = ({ accountInfo, getAccountInfo }) => {
  
  const { info, isFetching } = accountInfo
  const [visible, setVisible] = useState(false)
  
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
        {/* <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item1" defaultMessage="余额" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.balance, 2)}`}
          </span>
        </div> */}
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item2" defaultMessage="当前权益（HP）" />
            <IconFont 
              type="iconQues"
              className="ai-li-tip"
              onClick={() => setVisible(true)}
            />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.equity, 2)}`}
          </span>
        </div>
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item3" defaultMessage="可用资金（HP）" />
            <IconFont 
              type="iconQues"
              className="ai-li-tip"
              onClick={() => setVisible(true)}
            />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.freeMargin, 2)}`}
          </span>
        </div>
        {/* <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item4" defaultMessage="保证金比例" />
          </span>
          <span>
            {isFetching ? '---' : `$ ${toDecimal(info.marginLevel, 2)}%`}
          </span>
        </div> */}
        <div className="ai-li">
          <span>
            <FormattedMessage id="accountInfo.item4" defaultMessage="风险度" />
            <IconFont 
              type="iconQues"
              className="ai-li-tip"
              onClick={() => setVisible(true)}
            />
          </span>
          <span>
            {isFetching ? '---' : `${toDecimal((info.margin / info.equity) * 100, 2)}%`}
          </span>
        </div>
        <div className="ai-li profit">
          <span>
            <FormattedMessage id="accountInfo.item5" defaultMessage="持仓盈亏" />：&nbsp;
          </span>
          <span
            className={info.profit > 0 ? 'color-up' : 'color-down'}
            style={{ marginTop: '-1px' }}
          >
            {isFetching ? '---' : toDecimal(info.profit, 2)}
          </span>
          <span>&nbsp;HP</span>
          <IconFont 
            type="iconQues"
            className="ai-li-tip"
            style={{ marginLeft: '.3em' }}
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <Modal 
        title={<FormattedMessage id="accountInfo.tipModal.title" defaultMessage="账户信息计算规则" />}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <p style={styles.key}>
          <FormattedMessage id="accountInfo.item2" defaultMessage="当前权益（HP）" />
        </p>
        <p>
          <FormattedMessage id="accountInfo.tipModal.rule.equity" defaultMessage="当前权益 = 余额 ± 浮动盈亏" />
        </p>
        <br />
        <p style={styles.key}>
          <FormattedMessage id="accountInfo.item3" defaultMessage="可用资金（HP）" />
        </p>
        <p>
          <FormattedMessage id="accountInfo.tipModal.rule.freeMargin" defaultMessage="可用资金 = 当前权益 - 已用保证金" />
        </p>
        <br />
        <p style={styles.key}>
          <FormattedMessage id="accountInfo.item4" defaultMessage="风险度" />
        </p>
        <p>
          <FormattedMessage id="accountInfo.tipModal.rule.riskDegree" defaultMessage="风险度 = 已用保证金 / 当前权益" />
        </p>
        <br />
        <p style={styles.key}>
          <FormattedMessage id="accountInfo.item5" defaultMessage="持仓盈亏" />
        </p>
        <p>
          <FormattedMessage id="accountInfo.tipModal.rule.profit" defaultMessage="即浮动盈亏。持仓盈亏 = 浮动盈亏 = 净值 - 余额" />
        </p>
      </Modal>
    </>
  )
}

const styles = {
  key: {
    fontWeight: '600',
  }
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