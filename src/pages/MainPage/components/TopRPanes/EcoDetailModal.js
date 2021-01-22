import { useEffect } from 'react'
import { Modal, Space } from 'antd'
import { DualAxes } from '@ant-design/charts'

const EcoDetailModal = (props) => {
  const { visible, data, onCancel } = props
  const ecoCharts = data[0].data.map(item => {
    if(item.time_period.indexOf("季度") !== -1) {
      item.xx = `${item.pub_time.split("-")[0]}年${item.time_period}`
    }
    return item
  })
  const ecoDesc = data[1]
  console.log("====EcoDetailModal",ecoCharts, ecoDesc)

  // useEffect(() => {
    
  // }, [input])
  
  const chartsConfig = {
    data: [ecoCharts, ecoCharts],
    height: 300,
    padding: 'auto',
    xField: 'xx',
    yField: ['actual', 'consensus'],
    geometryOptions: [
      {
        geometry: 'line',
        lineStyle: { lineWidth: 2 },
        color: '#3f535a'
      },
      { 
        geometry: 'column',
        color: '#e2e6e9'
      }
    ]
  }

  return (
    <>
      <Modal 
        width={800}
        className="ecod-modal-x"
        title={ecoDesc.title}
        visible={visible}
        footer={null}
        destroyOnClose={true}
        onCancel={onCancel}
      >
        <Space direction="vertical">
          <DualAxes {...chartsConfig} />
          <div>

          </div>
        </Space>
      </Modal>
    </>
  )
}

export default EcoDetailModal