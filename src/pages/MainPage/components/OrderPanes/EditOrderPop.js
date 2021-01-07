import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, InputNumber, notification } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import { isBuy } from '../../../../utils/utilFunc'

import { modifyOrder } from './OrderAction'

const EditOrderPop = ({ data, dispatch }) => {
  console.log("====EOP:", data)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isTpError, setIsTpError] = useState(false)
  const [isSlError, setIsSlError] = useState(false)
  const tpRef = useRef(null)
  const slRef = useRef(null)

  const digits = (data.close_price + "").split(".")[1].length
  

  const showModal = (e) => {
    console.log("====showModal",e)
    e.stopPropagation()
    setVisible(true)
  }
  // 右上角全局提示
  const openNotificationWithIcon = params => {
    const { type, msg, desc } = params
    notification[type]({
      message: msg, description: desc
    })
  }

  // 订单修改
  // --- 修改止盈
  const changeTpOrSl = (val,type) => {
    // 判断止盈
    if(type === "tp") {
      setIsTpError((!isBuy(data.cmdForCh) && val > data.close_price) || (isBuy(data.cmdForCh) && val < data.close_price))
    } else if(type === "sl") {
      setIsSlError((!isBuy(data.cmdForCh) && val < data.close_price) || (isBuy(data.cmdForCh) && val > data.close_price))
    }
    console.log(tpRef.current.input.value, slRef.current.input.value)
  }
  // --- 提交
  const handleOk = (e) => {
    e.stopPropagation()
    setLoading(true)
    // 提交订单修改
    dispatch(modifyOrder({
      open_price: data.open_price,
      ticket: data.ticket[0] || data.ticket,
      tp: tpRef.current.input.value,
      sl: slRef.current.input.value
    })).then(res => {
      openNotificationWithIcon({
        type: 'success', msg: '修改订单成功'
      })
      setLoading(false)
      setVisible(false)
    }).catch(err => {
      openNotificationWithIcon({
        type: 'error', msg: '修改订单失败', desc: err
      })
      setLoading(false)
    })
  }
  // --- 取消
  const handleCancel = (e) => {
    e.stopPropagation()
    setVisible(false)
  }  

  return (
    <>
      <Button 
        type="default" 
        className="op-btn-edit" 
        onClick={showModal}
      >
        <IconFont type="iconEdit" className="op-icon-edit" />
      </Button>
      <Modal
        width={360}
        className="eop-modal-x"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        destroyOnClose={true}  // 关闭时销毁元素
        getContainer={document.querySelector(".main-middle-x .ant-tabs-card")}
        footer={[
          <Button 
            key="back" 
            className="wt-btn-cancel"
            onClick={handleCancel}
          >
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            className="wt-btn-ok"
            loading={loading} 
            onClick={handleOk}
            disabled={isTpError || isSlError}
          >
            确认
          </Button>,
        ]}
      >
        <div className="eop-top-x">
          <div>
            <p>
              <span className="eop-symbol">{data.symbol}</span>
              <span className={`eop-cmd ${isBuy(data.cmdForCh) ? "color-up" : "color-down"}`}>{data.cmdForCh}</span>
            </p>
            <p className="eop-price">
              <span>{data.open_price}</span>
              &rarr;
              <span>{data.close_price}</span>
            </p>
          </div>
          <p className="eop-profit">浮动盈亏：
            <span className={data.profit >= 0 ? 'color-up' : 'color-down'}>{data.profit}</span>
          </p>
        </div>
        <div className="eop-body-x">
          <div className="eop-input-x">
            <span>止盈</span>
            <InputNumber
              ref={tpRef}
              min={0.00}
              step={Math.pow(10, -1 * digits).toFixed(digits)}
              defaultValue={data.tp || 0.00}
              onChange={val => changeTpOrSl(val, 'tp')}
              className={isTpError ? 'wt-input-error' : ''}
            />
          </div>
          <div className="eop-input-x">
            <span>止损</span>
            <InputNumber
              ref={slRef}
              min={0.00}
              step={Math.pow(10, -1 * digits).toFixed(digits)}
              defaultValue={data.sl || 0.00}
              onChange={val => changeTpOrSl(val, 'sl')}
              className={isSlError ? 'eop-error' : ''}
            />
          </div>
          <div className="eop-info-x">
            <p>
              <span>订单号</span>
              <span>{data.ticket[0] || data.ticket}</span>
            </p>
            <p>
              <span>开仓时间</span>
              <span>{data.open_time}</span>
            </p>
            <p>
              <span>手数</span>
              <span>{data.volume}</span>
            </p>
            <p>
              <span>手续费</span>
              <span>{data.commission}</span>
            </p>
            <p>
              <span>库存费</span>
              <span>{data.storage}</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

// const areEqual = (prevProps, nextProps) => {
//   console.log("====areEqual",prevProps, nextProps)
// }

export default connect()(EditOrderPop)