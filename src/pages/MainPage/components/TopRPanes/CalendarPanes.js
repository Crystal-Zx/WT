import { Space, DatePicker, Select, Radio, Table, Rate, Button } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { getCalendarData, getEcoDetail } from '../../MainAction'
import styles from './TopRPanes.module.scss'
import EcoDetailModal from './EcoDetailModal'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'

const CalendarPanes = ({ dispatch }) => {
  const { Option } = Select
  
  const [currStamp, setCurrStamp] = useState(moment().valueOf())
  const [ecoData, setEcoData] = useState({ list: [], isFetching: false})
  const [ecoEvent, setEcoEvent] = useState({ list: [], isFetching: false})
  const [region, setRegion] = useState()  // 1 -> 全部
  const [keyword, setKeyword] = useState()
  const [visible, setVisible] = useState(false)
  const [ecoDetail, setEcoDetail] = useState({})
  const intl = useIntl()

  const getEcoList = (timestamp) => {
    if(!timestamp && ecoData.isFetching) return
    setEcoData({...ecoData, isFetching: true})
    setEcoEvent({...ecoEvent, isFetching: true})
    dispatch(getCalendarData({
      year: moment(timestamp).year(),
      date: moment(timestamp).format('MMDD'),
      timestamp: timestamp
    })).then(res => {
      const data = res.value
      setEcoData({
        list: data[0].map(item => {
          return ({
            ...item,
            key: item.id,
            date: moment(item.pub_time).format("HH:mm"),
            title: `${item.country}${item.time_period}${item.name}`
          })
        }).concat([]), 
        isFetching: false
      })
      setEcoEvent({
        list: data[1].map(item => {
          return ({
            ...item,
            key: item.id,
            date: moment(item.event_time).format("HH:mm"),
            title: item.event_content
          })
        }).concat([]), 
        isFetching: false
      })
    }).catch(err => {
      // console.log("====err", err)
      setEcoData({
        list: [], 
        isFetching: false
      })
      setEcoEvent({
        list: [], 
        isFetching: false
      })
    })
  }
  /**
   * 
   * @param {string} index 指标值
   * @param {string | null} unit 数值单位（%、亿美元...）
   */ 
  const handleIndex = (index, unit) => {
    return index ? (unit === "%" ? index + "%" : index) : '---'
  }
  const showEcoDetail = (id) => {
    dispatch(getEcoDetail({id})).then(res => {
      setVisible(true)
      setEcoDetail(res.value)
    })
  }
  const getDataCol = [
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.date"
          defaultMessage="时间"
        />
      ),
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.country"
          defaultMessage="国家"
        />
      ),
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      render: (country) => {
        return <img 
          className="cp-img-flag"
          src={`https://cdn.jin10.com/assets/img/commons/flag/${country}.png`} 
          alt={country}
        />
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.title"
          defaultMessage="指标名称"
        />
      ),
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (title, item) => {
        if(item.unit && item.unit !== "%") {
          return `${title}（${item.unit}）`
        } else {
          return title
        }
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.impact"
          defaultMessage="重要性"
        />
      ),
      dataIndex: 'star',
      key: 'star',
      width: '13%',
      align: 'center',
      render: star => <Rate disabled defaultValue={star} />
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.actual"
          defaultMessage="今值"
        />
      ),
      dataIndex: 'actual',
      key: 'actual',
      align: 'center',
      render: (actual, item) => {
        return handleIndex(actual, item.unit)
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.consensus"
          defaultMessage="预期"
        />
      ),
      dataIndex: 'consensus',
      key: 'consensus',
      align: 'center',
      render: (consensus, item) => {
        return handleIndex(consensus, item.unit)
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.previous"
          defaultMessage="前值"
        />
      ),
      dataIndex: 'previous',
      key: 'previous',
      align: 'center',
      render: (previous, item) => {
        return item.revised || handleIndex(previous, item.unit)
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.detail"
          defaultMessage="数据解读"
        />
      ),
      dataIndex: 'detail',
      key: 'detail',
      align: 'center',
      width: '8%',
      render: (detail,item) => {
        return <Button
          className="cp-btn-ecoDetail"
          onClick={() => showEcoDetail(item.id)}
        >
          <FormattedMessage 
            id="calendar.ecoDataTable.detailBtn"
            defaultMessage="详情"
          />
        </Button>
      }
    }
  ]
  const getEventCol = [
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.date"
          defaultMessage="时间"
        />
      ),
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.country"
          defaultMessage="地区"
        />
      ),
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      render: (country) => {
        return <img 
          className="cp-img-flag"
          src={`https://cdn.jin10.com/assets/img/commons/flag/${country}.png`} 
          alt={country}
        />
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoEventTable.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'region',
      key: 'region',
      align: 'center',
      width: '10%',
      render: region => region || '---'
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.title"
          defaultMessage="指标名称"
        />
      ),
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (title, item) => {
        return (
          <>
            {
              item.people &&
              <img 
                alt=""
                className="cp-img-people"
                src={`https://cdn.jin10.com/images/flag/tx/${item.people}.png`} 
              />
            }
            {title}
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage 
          id="calendar.ecoDataTable.impact"
          defaultMessage="重要性"
        />
      ),
      dataIndex: 'star',
      key: 'star',
      width: '13%',
      align: 'center',
      render: star => <Rate disabled defaultValue={star} />
    }
  ]
  const onChangeDate = (_moment) => {
    setCurrStamp(_moment.valueOf())
    getEcoList(_moment.valueOf())
  }
  
  const getFilterList = (list) => {
    let filterList = list
    if(region && region !== "1") {
      filterList = filterList.filter(item => item.country.indexOf(region) !== -1)
    }
    if(keyword && keyword !== "1") {
      filterList = filterList.filter(item => item.title.indexOf(keyword) !== -1)
    }
    return filterList
  }

  useEffect(() => {
    currStamp && getEcoList(currStamp)
  }, [])

  return (
    <div className={styles['calendar-x']}>
      <Space className="cp-filter-x" align="center">
        <Radio.Group 
          defaultValue={moment().format("YYYY-MM-DD")}
          value={moment(currStamp).format("YYYY-MM-DD")}
          onChange={(e) => onChangeDate(moment(e.target.value))}
        >
          <Radio.Button value={moment().subtract(1, 'd').format("YYYY-MM-DD")}>
            <FormattedMessage
              id="moment.yesterday"
              defaultMessage="昨天"
            />
          </Radio.Button>
          <Radio.Button value={moment().format("YYYY-MM-DD")}>
            <FormattedMessage
              id="moment.today"
              defaultMessage="今天"
            />
          </Radio.Button>
          <Radio.Button value={moment().add(1, 'd').format("YYYY-MM-DD")}>
            <FormattedMessage
              id="moment.tomorrow"
              defaultMessage="昨天"
            />
          </Radio.Button>
        </Radio.Group>
        <DatePicker
          allowClear={false}
          defaultValue={moment()}
          defaultPickerValue={moment()}
          value={moment(currStamp)}
          onChange={onChangeDate} 
          placeholder={moment().format("YYYY-MM-DD")}
        />
        <Select 
          dropdownMatchSelectWidth={false}
          placeholder={
            intl.formatMessage({
              id: "calendar.country.placeholder",
              defaultMessage: "国家"
            })
          }
          suffixIcon={<IconFont type="iconDD" className="main-icon-dd mt-0" />}
          defaultValue="1"
          onChange={value => setRegion(value)}
        >
          <Option value="1">
            <FormattedMessage
              id="calendar.country.all"
              defaultMessage="全部"
            />
          </Option>
          <Option value="欧元区">
            <FormattedMessage
              id="calendar.country.euro"
              defaultMessage="欧元区"
            />
          </Option>
          <Option value="美国">
            <FormattedMessage
              id="calendar.country.us"
              defaultMessage="美国"
            />
          </Option>
          <Option value="英国">
            <FormattedMessage
              id="calendar.country.uk"
              defaultMessage="英国"
            />
          </Option>
          <Option value="日本">
            <FormattedMessage
              id="calendar.country.jp"
              defaultMessage="日本"
            />
          </Option>
          <Option value="加拿大">
            <FormattedMessage
              id="calendar.country.canada"
              defaultMessage="加拿大"
            />
          </Option>
          <Option value="澳大利亚">
            <FormattedMessage
              id="calendar.country.australia"
              defaultMessage="澳大利亚"
            />
          </Option>
        </Select>
        <Select 
          dropdownMatchSelectWidth={false}
          placeholder={
            intl.formatMessage({
              id: "calendar.keyword.placeholder",
              defaultMessage: "关键字"
            })
          }
          suffixIcon={<IconFont type="iconDD" className="main-icon-dd mt-0" />}
          defaultValue="1"
          onChange={value => setKeyword(value)}
        >
          <Option value="1">
            <FormattedMessage
              id="calendar.keyword.all"
              defaultMessage="全部关键字"
            />
          </Option>
          <Option value="会议纪要">
            <FormattedMessage
              id="calendar.keyword.meetingSummary"
              defaultMessage="会议纪要"
            />
          </Option>
          <Option value="央行">
            <FormattedMessage
              id="calendar.keyword.centralBank"
              defaultMessage="央行"
            />
          </Option>
          <Option value="失业率">
            <FormattedMessage
              id="calendar.keyword.unemploymentRate"
              defaultMessage="失业率"
            />
          </Option>
          <Option value="CPI">CPI</Option>
          <Option value="GDP">GDP</Option>
        </Select>
      </Space>
      <Space 
        className="cp-tables-ul"
        direction="vertical"
        size="large"
      >
        <Table 
          title={() =>
            <FormattedMessage
              id="calendar.ecoDataTable.tableName"
              defaultMessage="{date} {weekday} 经济数据一览表"
              values={{
                date: intl.formatDate(currStamp, {
                  year: 'numeric', month: 'long', day: '2-digit',
                }),
                weekday: intl.formatDate(currStamp, {
                  weekday: 'short'
                })
              }}
            />
          }
          className="cp-table-li"
          dataSource={getFilterList(ecoData.list)}
          columns={getDataCol}
          loading={ecoData.isFetching}
          pagination={false}
        />
        <Table 
          title={() =>
            <FormattedMessage
              id="calendar.ecoEventTable.tableName"
              defaultMessage="{date} {weekday} 财经大事一览表"
              values={{
                date: intl.formatDate(currStamp, {
                  year: 'numeric', month: 'long', day: '2-digit',
                }),
                weekday: intl.formatDate(currStamp, {
                  weekday: 'short'
                })
              }}
            />
          }
          // title={() => `${moment(currStamp).format('YYYY-MM-DD')} 周${chWeek.substr(moment(currStamp).day(), 1)} 财经大事一览表`}
          className="cp-table-li"
          dataSource={getFilterList(ecoEvent.list)}
          columns={getEventCol}
          loading={ecoEvent.isFetching}
          pagination={false}
        />
      </Space>
      {
        Object.keys(ecoDetail).length > 0 &&
        <EcoDetailModal 
          data={ecoDetail}
          visible={visible}
          onCancel={() => setVisible(false)}
        />
      }
      {/* {
        Object.keys(ecoDetail).length &&
        <Modal 
          title={ecoDetail.title}
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        />
      } */}
    </div>
  )
}

export default connect()(CalendarPanes)