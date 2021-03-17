import { useRef } from 'react'
import { Modal, Button } from 'antd'
import { DualAxes } from '@ant-design/charts'
import IconFont from '../../../../utils/iconfont/iconfont'

import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

const EcoDetailModal = (props) => {
  const { visible, data, onCancel, theme } = props
  const intl = useIntl()
  // console.log(data)
  const ecoCharts = data[0] && data[0].data.map(item => {
    if(item.time_period.indexOf("季度") !== -1) {
      item.xx = `${item.pub_time.split("-")[0]}年${item.time_period}`
    }
    return item
  })
  const ecoDesc = data[1]
  const seriesForCh = {
    'actual': intl.formatMessage({
      id: "calendar.ecoDetailModal.seriesActual",
      defaultMessage: "实际值"
    }),
    'consensus': intl.formatMessage({
      id: "calendar.ecoDetailModal.seriesConsensus",
      defaultMessage: "预测值"
    }),
  }
  const ref = useRef()
  
  const getChartsConfig = (theme) => {
    const themes = {
      "light": {
        grid: "#9ea4a9",
        text: "#363636",
        line1: "#3f535a",
        line2: "#9ea4a9",
        blur: 5,
        offset: 3,
        gridOpacity: .5,
        lineOpacity: 1
      },
      "dark": {
        grid: "#889399",
        text: "#889399",
        line1: "#ff8f00",
        line2: "#bfbfbf",
        blur: 0,
        offset: 0,
        gridOpacity: 1,
        lineOpacity: 1
      }
    }
    const t = themes[theme]
    return {
      data: [ecoCharts, ecoCharts],
      height: 300,
      padding: 'auto',
      xField: 'xx',
      yField: ['actual', 'consensus'],
      xAxis: {
        line: {
          style: {
            stroke: t.grid,
            lineWidth: 1
          }
        },
        label: {
          style: {
            fill: t.text
          }
        }
      },
      yAxis: [{
        grid: {  // y轴网格线
          line: {
            style: {
              lineWidth: 1,
              stroke: t.grid,
              strokeOpacity: t.gridOpacity,
            }
          }
        },
        line: null,  // y轴线
        label: {
          style: {
            fill: t.text
          }
        }
      },{
        line: null,
        label: {
          style: {
            fill: t.text
          }
        }
      }],
      legend: {
        position: 'top-left',
        itemName: {
          formatter: (text, item, index) => seriesForCh[text],
          style: {
            fill: t.text
          }
        },
      },
      geometryOptions: [
        {
          geometry: 'line',
          lineStyle: { 
            lineWidth: 2, 
            shadowColor: t.line1,
            lineDash: [4,5],
            strokeOpacity: t.lineOpacity,
            shadowBlur: t.blur,
            shadowOffsetX: t.offset,
            shadowOffsetY: t.offset,
          },
          tooltip: {
            formatter: (data) => ({ name: seriesForCh['actual'], value: data.actual })
          },
          color: t.line1
        },
        { 
          geometry: 'line',
          lineStyle: {
            lineWidth: 2, 
            shadowColor: t.line2,
            strokeOpacity: t.lineOpacity,
            shadowBlur: t.blur,
            shadowOffsetX: t.offset,
            shadowOffsetY: t.offset,
          },
          tooltip: {
            formatter: (data) => ({ name: seriesForCh['consensus'], value: data.consensus})
          },
          color: t.line2
        }
      ]
    }
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
        {
          ecoCharts &&
          <>
            <Button
              type="default"
              className="ecod-btn-download"
              onClick={onDownload}
            >
              <IconFont type="iconxiazai" className="icon-download" />
              <span>
                <FormattedMessage 
                  id="calendar.ecoDetailModal.savePic"
                  defaultMessage="保存为图片"
                />
              </span>
            </Button>
            <DualAxes {...getChartsConfig(theme)} chartRef={ref} />
          </>
        }
        <div className="ecod-desc-x">
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc1"
                defaultMessage="数据影响"
              />：
            </span>
            <span>{ecoDesc.impact}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc2"
                defaultMessage="数据释义"
              />：
            </span>
            <span>{ecoDesc.paraphrase}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc3"
                defaultMessage="趣味解读"
              />：
            </span>
            <span>{ecoDesc.concern}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc4"
                defaultMessage="下次公布时间"
              />：</span>
            <span>{ecoDesc.public_time}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc5"
                defaultMessage="数据公布机构"
              />：
            </span>
            <span>{ecoDesc.institutions}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc6"
                defaultMessage="发布频率"
              />：
            </span>
            <span>{ecoDesc.frequency}</span>
          </p>
          <p>
            <span>
              <FormattedMessage 
                id="calendar.ecoDetailModal.desc7"
                defaultMessage="统计方法"
              />：
            </span>
            <span>{ecoDesc.method}</span>
          </p>
        </div>
      </Modal>
    </>
  )
}

export default connect(
  state => ({
    theme: state.MainReducer.theme
  })
)(EcoDetailModal)