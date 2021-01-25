import { useRef } from 'react'
import { Modal, Button } from 'antd'
import { DualAxes } from '@ant-design/charts'
import IconFont from '../../../../utils/iconfont/iconfont'

const EcoDetailModal = (props) => {
  const { visible, data, onCancel } = props
  const ecoCharts = data[0].data.map(item => {
    if(item.time_period.indexOf("季度") !== -1) {
      item.xx = `${item.pub_time.split("-")[0]}年${item.time_period}`
    }
    return item
  })
  const ecoDesc = data[1]
  const seriesForCh = {
    'actual': '实际值',
    'consensus': '预测值'
  }
  const ref = useRef()
  
  const chartsConfig = {
    data: [ecoCharts, ecoCharts],
    height: 300,
    padding: 'auto',
    xField: 'xx',
    yField: ['actual', 'consensus'],
    xAxis: {
      line: {
        style: {
          stroke: '#363636',
          lineWidth: 1,
          strokeOpacity: 0.5,
          shadowColor: '#363636',
          shadowBlur: 5,
          shadowOffsetX: 3,
          shadowOffsetY: 3
        }
      }
    },
    yAxis: [{
      line: {
        style: {
          stroke: '#363636',
          lineWidth: 2,
          strokeOpacity: 0.3,
          shadowColor: '#363636',
          shadowBlur: 5,
          shadowOffsetX: 3,
          shadowOffsetY: 3
        }
      }
    }],
    legend: {
      position: 'top-left',
      itemName: {
        formatter: (text, item, index) => seriesForCh[text]
      }
    },
    geometryOptions: [
      {
        geometry: 'line',
        lineStyle: { 
          lineWidth: 2, 
          shadowColor: '#3f535a',
          lineDash: [4,5],
          strokeOpacity: 0.7,
          shadowBlur: 5,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        tooltip: {
          formatter: (data) => ({ name: seriesForCh['actual'], value: data.actual })
        },
        color: '#3f535a'
      },
      { 
        geometry: 'line',
        lineStyle: {
          lineWidth: 2, 
          shadowColor: '#9ea4a9',
          strokeOpacity: 0.7,
          shadowBlur: 3,
          shadowOffsetX: 1,
          shadowOffsetY: 1,
        },
        tooltip: {
          formatter: (data) => ({ name: seriesForCh['consensus'], value: data.consensus})
        },
        color: '#9ea4a9'
      }
    ]
  }

  // 下载图表
  const onDownload = () => {
    ref.current?.downloadImage(ecoDesc.title)
  }

  return (
    <>
      <Modal 
        width={700}
        className="ecod-modal-x"
        title={ecoDesc.title}
        visible={visible}
        getContainer={false}
        footer={null}
        destroyOnClose={true}
        onCancel={onCancel}
      >
        <Button
          type="default"
          className="ecod-btn-download"
          onClick={onDownload}
        >
          <IconFont type="iconxiazai" className="icon-download" />
          <span>保存为图片</span>
        </Button>
        <DualAxes {...chartsConfig} chartRef={ref} />
        <div className="ecod-desc-x">
          <p>
            <span>数据影响：</span>
            <span>{ecoDesc.impact}</span>
          </p>
          <p>
            <span>数据释义：</span>
            <span>{ecoDesc.paraphrase}</span>
          </p>
          <p>
            <span>趣味解读：</span>
            <span>{ecoDesc.concern}</span>
          </p>
          <p>
            <span>下次公布时间：</span>
            <span>{ecoDesc.public_time}</span>
          </p>
          <p>
            <span>数据公布机构：</span>
            <span>{ecoDesc.institutions}</span>
          </p>
          <p>
            <span>发布频率：</span>
            <span>{ecoDesc.frequency}</span>
          </p>
          <p>
            <span>统计方法：</span>
            <span>{ecoDesc.method}</span>
          </p>
        </div>
      </Modal>
    </>
  )
}

export default EcoDetailModal