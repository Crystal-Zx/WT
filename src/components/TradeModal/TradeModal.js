import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, InputNumber, Button } from 'antd'
import LineTabs from '../LineTabs/LineTabs'

import styles from '../../components/Login/Login.module.scss'
import { openNotificationWithIcon, toDecimal } from '../../utils/utilFunc'
import { openOrder } from '../../pages/MainPage/MainAction'

const TradeModal = ({ dispatch, symbolInfo, visible, onHideTradeModal }) => {

  // console.log("====TradeModal symbol:", symbolInfo)

  const defaultVolume = 0.01
  // const [size, setSize] = useState(0)
  // const [volume, setVolume] = useState(defaultVolume)
  const [loadings, setLoadings] = useState([])
  const [orderForm] = Form.useForm()

  // const handleValuesChange = (changedValues, allValues) => {  // 均为对象形式
  //   // console.log(changedValues, allValues)
  //   if(changedValues.volume) {
  //     setVolume(changedValues.volume)
  //     setSize(changedValues.volume * symbolInfo.size)
  //   }
  // }
  const handleOrderChange = (changedValues, allValues) => {  // 均为对象形式
    console.log(changedValues, allValues)
    if(changedValues.price) {
      orderForm.setFieldsValue({ price: changedValues.price })
    }
  }
  const changeLoading = (index, bool) => {
    const _loadings = [...loadings]
    _loadings[index] = bool
    setLoadings(_loadings)
  }
  const toTransaction = (index, cmd) => {
    changeLoading(index, true)
    console.log("====toTransaction", orderForm.getFieldsValue(), cmd, symbolInfo.ask)
    const { volume, price, tp, sl } = orderForm.getFieldsValue()
    dispatch(openOrder({
      lots: volume, cmd, open_price: price, tp, sl, symbol: symbolInfo.symbol, comment: ''
    })).then(res => {
      changeLoading(index, false)
      openNotificationWithIcon({
        type: 'success', msg: '创建订单成功'
      })
    }).catch(err => {
      changeLoading(index, false)
      openNotificationWithIcon({
        type: 'error', msg: '创建订单失败', desc: err.msg || `${err}`
      })
    })

    // setTimeout(() => {
    //   changeLoading(index, false)
    // }, 500);
  }
  const getTradeJSX = (key) => {
    switch (key) {
      case '0':  // 即时交易
        return (
          <div className="wt-trade-x">
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
                  min={0.00}
                  step={0.01}
                  defaultValue={0.00}
                />
              </Form.Item>
              <Form.Item
                name="sl"
                label="止损"
                colon={false}
              >
                <InputNumber
                  min={0.00}
                  step={0.01}
                  defaultValue={0.00}
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
          </div>
        )
      case '1':  // 挂单交易
        return (
          <div className="wt-trade-x">
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
              form={orderForm}
              initialValues={{
                price: orderForm.getFieldValue('price'), volume: 0.01, tp: 0.00, sl: 0.00
              }}
              onValuesChange={handleOrderChange}
            >
              <Form.Item
                name="price"
                label="价格"
                colon={false}
                // initialValue={toDecimal(symbolInfo.ask, symbolInfo.digits)}
              >
                <InputNumber
                  min={0.01}
                  step={Math.pow(10,-1 * symbolInfo.digits).toFixed(symbolInfo.digits)}
                  // defaultValue={toDecimal(symbolInfo.ask, symbolInfo.digits)}
                />
              </Form.Item>
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
                  min={0.00}
                  step={0.01}
                  defaultValue={0.00}
                />
              </Form.Item>
              <Form.Item
                name="sl"
                label="止损"
                colon={false}
              >
                <InputNumber
                  min={0.00}
                  step={0.01}
                  defaultValue={0.00}
                />
              </Form.Item>
              <Form.Item 
                className="wt-trans-x order">
                <Button 
                  type="default"
                  className="wt-trans-btn sell"
                  loading={loadings[0]}
                  onClick={() => toTransaction(0, 
                    orderForm.getFieldValue('price') <= symbolInfo.bid ? '5' :  '3'
                  )}
                >
                  <span className="wt-trans-cmd">
                    { orderForm.getFieldValue('price') <= symbolInfo.bid ? '卖出止损' :  '限价卖出'}
                  </span>
                </Button>
                <Button 
                  type="default"
                  className="wt-trans-btn buy"
                  loading={loadings[1]}
                  onClick={() => toTransaction(1, 
                    orderForm.getFieldValue('price') > symbolInfo.bid ? '4' :  '2'
                  )}
                >
                  <span className="wt-trans-cmd">
                    {symbolInfo.ask} {symbolInfo.bid}
                    { orderForm.getFieldValue('price') > symbolInfo.bid ? '买入止损' : '限价买入' }
                  </span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        )
      default:
        break;
    }
  }
  
  // 当前货币对发生变化及
  useEffect(() => {
    console.log("该字段是否被用户操作过", !orderForm.isFieldsTouched(['price']))
    if(!orderForm.isFieldsTouched(['price'])) {  // 该字段未被用户操作过
      console.log("更新价格")
      orderForm.setFieldsValue({ 'price': symbolInfo.ask})
    }
  }, [symbolInfo.symbol, symbolInfo.ask]) 

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
  // state => {
  //   const { symbolList } = state.MainReducer
    
  //   return {
  //     _symbolList: symbolList.list
  //   }
  // }
)(TradeModal)
// export default TradeModal