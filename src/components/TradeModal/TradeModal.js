import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, InputNumber, Button } from 'antd'
import LineTabs from '../LineTabs/LineTabs'

import styles from '../../components/Login/Login.module.scss'
import { openNotificationWithIcon, toDecimal } from '../../utils/utilFunc'
import { openOrder } from '../../pages/MainPage/MainAction'
import { FormattedMessage, useIntl } from 'react-intl'

const TradeModal = ({ dispatch, symbolInfo, visible, onHideTradeModal }) => {

  // console.log("====TradeModal symbol:", symbolInfo)

  const defaultVolume = 0.01
  
  const [loadings, setLoadings] = useState([])
  const [isTouch, setIsTouch] = useState(false)
  const [orderForm] = Form.useForm()
  const [positionForm] = Form.useForm()
  // 仅用于触发下单按钮重绘
  const [price, setPrice] = useState(orderForm.getFieldValue('price'))
  // 表单初始值
  const pInitialValues = { volume: 0.01, tp: 0.00, sl: 0.00 }
  const oInitialValues = {
    price: orderForm.getFieldValue('price'), volume: 0.01, tp: 0.00, sl: 0.00
  }
  const intl = useIntl()

  const handleOrderChange = (changedValues, allValues) => {  // 均为对象形式
    // 若当前更新值为挂单--->价格
    if(changedValues.price) {
      // 设置该字段已被用户操作过，不再自动进行更新
      setIsTouch(true)
      orderForm.setFieldsValue({ price: changedValues.price })
      setPrice(changedValues.price)
    }
  }
  // 改变按钮loading状态
  const changeLoading = (index, bool) => {
    setLoadings((prevLoadings) => {
      const _loadings = [...prevLoadings]
      _loadings[index] = bool
      return _loadings
    })
  }
  // 交易
  const toTransaction = (index, cmd) => {
    changeLoading(index, true)
    const values = cmd < 2 ? positionForm.getFieldsValue() : orderForm.getFieldsValue()
    const { volume, price = 0, tp, sl } = values
    
    dispatch(openOrder({
      lots: volume, cmd, open_price: price, tp, sl, symbol: symbolInfo.symbol, comment: ''
    })).then(res => {
      onHideTradeModal()
      changeLoading(index, false)
      openNotificationWithIcon({
        type: 'success', msg: intl.formatMessage({
          id: "tradeModal.noti.success",
          defaultMessage: "创建订单成功"
        })
      })
    }).catch(err => {
      changeLoading(index, false)
      openNotificationWithIcon({
        type: 'error', msg: intl.formatMessage({
          id: "tradeModal.noti.error",
          defaultMessage: "创建订单失败"
        }), desc: err.msg || `${err}`
      })
    })
  }
  // 获取下单表单JSX
  const getTradeJSX = (key) => {
    switch (key) {
      case '0':  // 即时交易
        return (
          <div className="wt-trade-x">
            <div className="tm-desc-ul">
              <p className="tm-desc-li">
                <span>
                  <FormattedMessage id="tradeModal.size" defaultMessage="合约大小" />
                </span>
                <span>{symbolInfo.size}&nbsp;{symbolInfo.margin_currency}</span>
              </p>
              <p className="tm-desc-li">
                <span>
                  <FormattedMessage id="tradeModal.spread" defaultMessage="点差" />
                </span>
                <span>{symbolInfo.ask ? ((symbolInfo.ask - symbolInfo.bid) / symbolInfo.point / 10).toFixed(2) : '---'}</span>
              </p>
            </div>
            <Form
              form={positionForm}
              initialValues={pInitialValues}
            >
              <Form.Item
                name="volume"
                label={intl.formatMessage({
                  id: "tradeModal.volume",
                  defaultMessage: "交易量"
                })}
                colon={false}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  // defaultValue={defaultVolume}
                />
              </Form.Item>
              <Form.Item
                name="tp"
                label={intl.formatMessage({
                  id: "tradeModal.tp",
                  defaultMessage: "止盈"
                })}
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
                label={intl.formatMessage({
                  id: "tradeModal.sl",
                  defaultMessage: "止损"
                })}
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
                  loading={loadings[0]}
                  onClick={() => toTransaction(0, 1)}
                >
                  <span className="wt-trans-price">{toDecimal(symbolInfo.bid, symbolInfo.digits) || '---'}</span>
                  <span className="wt-trans-cmd">Sell</span>
                </Button>
                <Button 
                  type="default"
                  className="wt-trans-btn buy"
                  loading={loadings[1]}
                  onClick={() => toTransaction(1, 0)}
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
                <span>
                  <FormattedMessage id="tradeModal.size" defaultMessage="合约大小" />
                </span>
                <span>{symbolInfo.size}&nbsp;{symbolInfo.margin_currency}</span>
              </p>
              <p className="tm-desc-li">
                <span>
                  <FormattedMessage id="tradeModal.spread" defaultMessage="点差" />
                </span>
                <span>{symbolInfo.ask ? ((symbolInfo.ask - symbolInfo.bid) / symbolInfo.point / 10).toFixed(2) : '---'}</span>
              </p>
            </div>
            <Form
              form={orderForm}
              initialValues={oInitialValues}
              onValuesChange={handleOrderChange}
            >
              <Form.Item
                name="price"
                label={intl.formatMessage({
                  id: "tradeModal.price",
                  defaultMessage: "价格"
                })}
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
                label={intl.formatMessage({
                  id: "tradeModal.volume",
                  defaultMessage: "交易量"
                })}
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
                label={intl.formatMessage({
                  id: "tradeModal.tp",
                  defaultMessage: "止盈"
                })}
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
                label={intl.formatMessage({
                  id: "tradeModal.sl",
                  defaultMessage: "止损"
                })}
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
                  loading={loadings[2]}
                  onClick={() => toTransaction(2, 
                    price <= symbolInfo.bid ? '5' :  '3'
                  )}
                >
                  <span className="wt-trans-cmd">
                    { price <= symbolInfo.bid ? 
                      intl.formatMessage({ id: "orderType.sellStop", defaultMessage: "卖出止损" }) : 
                      intl.formatMessage({ id: "orderType.sellLimit", defaultMessage: "限价卖出"})
                    }
                  </span>
                </Button>
                <Button 
                  type="default"
                  className="wt-trans-btn buy"
                  loading={loadings[3]}
                  onClick={() => toTransaction(3, 
                    price > symbolInfo.bid ? '4' :  '2'
                  )}
                >
                  <span className="wt-trans-cmd">
                    { price > symbolInfo.bid ? 
                      intl.formatMessage({ id: "orderType.buyStop", defaultMessage: "买入止损" }) : 
                      intl.formatMessage({ id: "orderType.buyLimit", defaultMessage: "限价买入"})
                    }
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
  // 关闭当前弹窗： 需要重置初始值
  const onCancel = () => {
    positionForm.resetFields()
    orderForm.resetFields()
    setIsTouch(false)
    onHideTradeModal()
  }
  
  // 当前货币对价格发生变化且用户尚未操作过该输入框时自动更新挂单价格
  useEffect(() => {
    if(!isTouch) {  // 该字段未被用户操作过
      orderForm.setFieldsValue({ 'price': symbolInfo.ask })
      setPrice(symbolInfo.ask)
    }
  }, [symbolInfo.ask])

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
          onCancel={onCancel}
        >
          <LineTabs 
            initialPanes={[
              { title: intl.formatMessage({
                id: "tradeModal.tabName.position",
                defaultMessage: "即时交易"
              }), content: getTradeJSX('0'), key: '0' },
              { title: intl.formatMessage({
                id: "tradeModal.tabName.order",
                defaultMessage: "挂单交易"
              }), content: getTradeJSX('1'), key: '1' }
            ]}
          />  
        </Modal>
      }
    </>
  )
}

export default connect()(TradeModal)