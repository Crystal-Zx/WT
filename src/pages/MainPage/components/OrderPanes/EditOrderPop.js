import { useState } from 'react'
import { Modal, Button, InputNumber } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'

const EditOrderPop = ({ data }) => {
  console.log("====EOP:", data)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setVisible(false)
    }, 3000);
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const bodyStyle = {

  }

  return (
    <>
      <Button type="default" className="op-btn-edit" onClick={showModal}>
        <IconFont type="iconEdit" className="op-icon-edit" />
      </Button>
      <Modal
        className="eop-x"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={360}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
        ]}
        destroyOnClose={true}  // 关闭时销毁元素
        getContainer={document.querySelector(".main-middle-x .ant-tabs-card")}
      >
        <div className="eop-top-x">
          <div>
            <p>
              <span className="eop-symbol">USDJPY</span>
              <span className="eop-cmd color-up">Buy</span>
            </p>
            <p className="eop-price">
              <span>103.396</span>
              &rarr;
              <span>102.801</span>
            </p>
          </div>
          <p className="eop-profit">浮动盈亏：
            <span className="color-up">5.79</span>
          </p>
        </div>
        <div className="eop-body-x">
          <div className="eop-input-x">
            <span>止盈</span>
            <InputNumber
              min={0.01}
              step={0.01}
              defaultValue={0.01}
            />
          </div>
          <div className="eop-input-x">
            <span>止损</span>
            <InputNumber
              min={0.01}
              step={0.01}
              defaultValue={0.01}
            />
          </div>
          <div className="eop-info-x">
            <p>
              <span>订单号</span>
              <span>1264255</span>
            </p>
            <p>
              <span>开仓时间</span>
              <span>2020-12-18 00:15:40</span>
            </p>
            <p>
              <span>手数</span>
              <span>0.01</span>
            </p>
            <p>
              <span>手续费</span>
              <span>0.00</span>
            </p>
            <p>
              <span>库存费</span>
              <span>-0.60</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditOrderPop