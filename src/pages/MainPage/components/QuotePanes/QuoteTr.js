import { useState } from 'react'
import { connect } from 'react-redux'
import { Button, InputNumber, Spin } from 'antd'
import { openNotificationWithIcon, toDecimal } from '../../../../utils/utilFunc'
import { openOrder } from '../../MainAction'

const QuoteTr = ({ dispatch, data }) => {
  const [volume, setVolume] = useState(0.01)
  const [isFetching0, setIsFetching0] = useState(false)
  const [isFetching1, setIsFetching1] = useState(false)

  const onChange = (value) => {
    setVolume(value)
  }
  const toTransaction = (cmd) => {
    !!cmd ? setIsFetching1(true) : setIsFetching0(true)
    dispatch(openOrder({
      lots: volume, cmd, open_price: 0.00, tp: 0.00, sl: 0.00, symbol: data.symbol, comment: ''
    })).then(res => {
      console.log(res)
      !!cmd ? setIsFetching1(false) : setIsFetching0(false)
      openNotificationWithIcon({
        type: 'success', msg: '创建订单成功'
      })
    }).catch(err => {
      console.log("err", err)
      openNotificationWithIcon({
        type: 'error', msg: '创建订单失败', desc: err
      })
    })
  }

  return (
    <>
      <div className="qtr-row-1">
        <Spin 
          wrapperClassName="qtr-btn-loading"
          spinning={!Number(data.bid) ? true : isFetching1}
          size="small"
        >
          <Button 
            type="primary" 
            className="qtr-btn qtr-btn-sell"
            onClick={() => toTransaction(1)}
          >
            <span className="qtr-price">{data.bid || '---'}</span>
            <span className="qtr-type">Sell</span>
          </Button>
        </Spin>
        <InputNumber
          className="qtr-volume-x"
          min={0.01}
          step={0.01}
          defaultValue={0.01}
          onChange={onChange}
        />
        <Spin 
          wrapperClassName="qtr-btn-loading"
          spinning={!Number(data.ask) ? true : isFetching0}
          size="small"
        >
          <Button 
            type="primary" 
            className="qtr-btn qtr-btn-buy"
            onClick={() => toTransaction(0)}
          >
            <span className="qtr-price">{data.ask || '---'}</span>
            <span className="qtr-type">Buy</span>
          </Button>
        </Spin>
      </div>
      <div className="qtr-row-2">
        <span className="qtr-val qtr-high">High: &nbsp;
          {data.high ? toDecimal(data.high, data.digits) : '---'}
        </span>
        <span>{data.per}</span>
        <span className="qtr-val qtr-low">Low: &nbsp;
          {data.low ? toDecimal(data.low, data.digits) : '---'}
        </span>
      </div>
    </>
  )
}

export default connect()(QuoteTr)