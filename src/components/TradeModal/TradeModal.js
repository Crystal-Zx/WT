import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, InputNumber, Button } from 'antd'
import LineTabs from '../LineTabs/LineTabs'

import styles from '../../components/Login/Login.module.scss'
import { toDecimal } from '../../utils/utilFunc'

const TradeModal = ({ _symbolList, visible, symbol, onHideTradeModal }) => {

  const symbolInfo = _symbolList.filter(item => item.symbol === symbol)[0]
  visible && console.log("====TradeModal symbol:", symbolInfo)

  const defaultVolume = 0.01
  // const [size, setSize] = useState(0)
  // const [volume, setVolume] = useState(defaultVolume)

  // const handleValuesChange = (changedValues, allValues) => {  // 均为对象形式
  //   // console.log(changedValues, allValues)
  //   if(changedValues.volume) {
  //     setVolume(changedValues.volume)
  //     setSize(changedValues.volume * symbolInfo.size)
  //   }
  // }
  const getTradeJSX = (key) => {
    switch (key) {
      case '0':
        return (
          <>
            <div className="tm-desc-ul">
              <p className="tm-desc-li">
                <span>合约大小</span>
                <span>{symbolInfo.size}&nbsp;{symbolInfo.margin_currency}</span>
              </p>
              <p className="tm-desc-li">
                <span>点差</span>
                <span>{symbolInfo.ask ? ((symbolInfo.ask - symbolInfo.bid) / symbolInfo.point / 10).toFixed(2) : '---'}</span>
              </p>
            </div>
            <Form
              // onValuesChange={handleValuesChange}
            >
              <Form.Item
                name="volume"
                label="交易量"
                colon={false}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  defaultValue={defaultVolume}
                />
              </Form.Item>
              <Form.Item
                name="tp"
                label="止盈"
                colon={false}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  defaultValue={defaultVolume}
                />
              </Form.Item>
              <Form.Item
                name="sl"
                label="止损"
                colon={false}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  defaultValue={defaultVolume}
                />
              </Form.Item>
              <Form.Item className="wt-trans-x">
                <Button 
                  type="default"
                  className="wt-trans-btn sell"
                >
                  <span className="wt-trans-price">{toDecimal(symbolInfo.bid, symbolInfo.digits) || '---'}</span>
                  <span className="wt-trans-cmd">Sell</span>
                </Button>
                <Button 
                  type="default"
                  className="wt-trans-btn buy"
                >
                  <span className="wt-trans-price">{toDecimal(symbolInfo.ask, symbolInfo.digits) || '---'}</span>
                  <span className="wt-trans-cmd">Buy</span>
                </Button>
              </Form.Item>
            </Form>
          </>
        )
    
      default:
        break;
    }
  }

  return (
    <>
      {
        symbolInfo && Object.keys(symbolInfo).length &&
        <Modal
          title={(
            <p className="tm-header-title">{symbolInfo.symbol}
              <span className="tm-header-desc">{symbolInfo.group}</span>
            </p>
          )}
          width={360}
          className={styles['wt-tm-x']}
          wrapClassName='wt-tm-x'
          visible={visible}
          footer={null}
          destroyOnClose={true}
          onCancel={onHideTradeModal}
        >
          <LineTabs 
            initialPanes={[
              { title: "即时交易", content: getTradeJSX('0'), key: '0' },
              { title: "挂单交易", content: getTradeJSX('1'), key: '1' }
            ]}
          />  
        </Modal>
      }
    </>
  )
}

export default connect(
  state => {
    const { symbolList } = state.MainReducer
    
    return {
      _symbolList: symbolList.list
    }
  }
)(TradeModal)