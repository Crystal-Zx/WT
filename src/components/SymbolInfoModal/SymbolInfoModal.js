import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getSymbolInfo } from '../../pages/MainPage/MainAction'

import { Modal } from 'antd'


const SymbolInfoModal = ({ _getSymbolInfo, symbol, visible, onCancel }) => {

  // const [visible, setVisible] = useState(false)
  useEffect(() => {
    console.log("===SymbolInfoModal init")
    return () => {
      console.log("===SymbolInfoModal destory")
    }
  }, [])

  return (
    <>
      <Modal 
        title={symbol}
        width={360}
        // className={styles['wt-sim-x']}  // sim: symbolInfo Modal
        wrapClassName="wt-sim-x"
        visible={visible}
        footer={null}
        // destroyOnClose={true}
        onCancel={onCancel}
      >
        <p>{symbol}基本信息</p>
      </Modal>
    </>
  )
}

export default connect(null, 
  dispatch => {
    return {
      _getSymbolInfo: function (symbol) {
        dispatch(getSymbolInfo({ name: symbol }))
      }
    }
  }
)(SymbolInfoModal)