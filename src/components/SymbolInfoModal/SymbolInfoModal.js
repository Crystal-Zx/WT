import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getSymbolInfo } from '../../pages/MainPage/MainAction'

import { Modal, Descriptions, Spin } from 'antd'
import styles from './SymbolInfoModal.module.scss'

import { getForTwoDigits, toDecimal } from '../../utils/utilFunc'
import { FormattedMessage, useIntl } from 'react-intl'


const SymbolInfoModal = ({ _getSymbolInfo, symbol, visible, onCancel }) => {

  const weekForCh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekForEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [info, setInfo] = useState({})
  const intl = useIntl()
  console.log("===intl: ", intl.locale.slice(0,2))

  useEffect(() => {
    !Object.keys(info).length && _getSymbolInfo(symbol).then(res => {
      setInfo(res.value)
    })
  }, [])

  return (
    <>
      <Modal 
        title={symbol}
        width={550}
        className={styles['wt-sim-x']}  // sim: symbolInfo Modal
        wrapClassName="wt-sim-x"
        visible={visible}
        footer={null}
        destroyOnClose={true}
        onCancel={e => { e.stopPropagation(); onCancel() }}
      >
        {
          Object.keys(info).length ? 
          <>
            <Descriptions 
              className="sim-desc-x left"
              layout="vertical"
              column={3}
            >
              <Descriptions.Item 
                label={intl.formatMessage({
                  id: "symbolInfo.descItem.desc",
                  defaultMessage: "描述"
                })}
                span={3}
              >
                {info.description}
              </Descriptions.Item>
              <Descriptions.Item label={
                intl.formatMessage({ id: "symbolInfo.descItem.sizeof1Pip", defaultMessage: "1点的大小" })
              }>
                {(Math.pow(10,-1 * info.digits)).toFixed(info.digits)}
              </Descriptions.Item>
              <Descriptions.Item label={
                intl.formatMessage(({ id: "symbolInfo.descItem.valueof1Pip", defaultMessage: "1点的名义价值" }))
              }>
                {info.contract_size}&nbsp;{info.currency}
              </Descriptions.Item>
              <Descriptions.Item label={
                intl.formatMessage({ id: "symbolInfo.descItem.tickValue", defaultMessage: "报价值" })
              }>
                {toDecimal(info.tick_value, 2)}
              </Descriptions.Item>
              <Descriptions.Item label={
                intl.formatMessage({ id: "symbolInfo.descItem.tickSize", defaultMessage: "报价量" })
              }>
                {toDecimal(info.tick_size, 2)}
              </Descriptions.Item>
              {/* <Descriptions.Item label="最小头寸规模">0.001</Descriptions.Item>
              <Descriptions.Item label="最大头寸规模">1.0</Descriptions.Item> */}
              <Descriptions.Item label={
                intl.formatMessage({ id: "symbolInfo.descItem.dailySwapPoints", defaultMessage: "每日掉期点" })
              }>
                <p>
                  <span>
                    <FormattedMessage 
                      id="symbolInfo.descItem.swapLong"
                      defaultMessage="买多"
                    />：{info.swap_long}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span>
                    <FormattedMessage 
                      id="symbolInfo.descItem.swapShort"
                      defaultMessage="卖空"
                    />：{info.swap_short}</span> 
                </p>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              className="sim-desc-x right"
              layout="vertical"
              column={1}
            >
              <Descriptions.Item className="sim-sessions-x" label={
                intl.formatMessage({ id: "symbolInfo.descItem.marketHours", defaultMessage: "市场小时" })
              }>
                {
                  info.sessions.map((item, index) => {
                    console.log(item, index)
                    return (
                      <div className="sim-ssn-li">
                        <p className="sim-ssn-key">
                          {intl.locale.slice(0,2) === "zh" ? weekForCh[index] : weekForEn[index]}
                        </p>
                        <p className="sim-ssn-value">
                          {
                            item.trade.map(item => {
                              if(!Number(item.open_hour) && !Number(item.close_hour)) {
                                return
                              }
                              return (
                                <span>
                                  {getForTwoDigits(item.open_hour)}:{getForTwoDigits(item.open_min)}
                                  &nbsp;-&nbsp;
                                  {getForTwoDigits(item.close_hour)}:{getForTwoDigits(item.close_min)}；
                                </span>
                              )
                            })
                          }
                        </p>
                      </div>
                    )
                  })
                }
              </Descriptions.Item>
            </Descriptions>
          </>
          :
          <Spin />
        }
      </Modal>
    </>
  )
}

export default connect(null, 
  dispatch => {
    return {
      _getSymbolInfo: function (symbol) {
        return dispatch(getSymbolInfo({ name: symbol }))
      }
    }
  }
)(SymbolInfoModal)