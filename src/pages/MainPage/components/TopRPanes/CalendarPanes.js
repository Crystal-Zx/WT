import { Space, DatePicker, Select, Radio, Table } from 'antd'
import IconFont from '../../../../utils/iconfont/iconfont'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
// import http from '../../../../http'

import { getCalendarData } from '../../MainAction'
import styles from './TopRPanes.module.scss'

const CalendarPanes = ({ dispatch }) => {
  const { Option } = Select
  const chWeek = '日一二三四五六'
  const [currStamp, setCurrStamp] = useState(0)

  const getList = (timestamp) => {
    console.log("====timestamp", timestamp)
    dispatch(getCalendarData({
      year: moment(timestamp).year(),
      date: moment(timestamp).format('MMDD'),
      timestamp
    })).then(res => {
      console.log(res)
    }).catch(err => {
      console.log("====err", err)
    })
  }
  const getColumns = [
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '地区',
      dataIndex: 'country',
      key: 'country',
      align: 'center'
    },
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '重要性',
      dataIndex: 'star',
      key: 'star',
      align: 'center'
    },
    {
      title: '今值',
      dataIndex: 'actual',
      key: 'actual',
      align: 'center'
    },
    {
      title: '预期',
      dataIndex: 'consensus',
      key: 'consensus',
      align: 'center'
    },
    {
      title: '前值',
      dataIndex: 'previous',
      key: 'previous',
      align: 'center'
    },
    {
      title: '数据解读',
      dataIndex: 'detail',
      key: 'detail',
      align: 'center'
    }
  ]
  const onChangeDate = (value) => {
    console.log(value)
  }

  useEffect(() => {
    const timestamp = moment().valueOf()
    // console.log("====123",moment(timestamp).day(String))
    setCurrStamp(timestamp)
    getList(timestamp)
  }, [])

  return (
    <div className={styles['calendar-x']}>
      <Space className="cp-filter-x" align="center">
        <Radio.Group>
          <Radio.Button value="0">昨天</Radio.Button>
          <Radio.Button value="1">今天</Radio.Button>
          <Radio.Button value="2">明天</Radio.Button>
        </Radio.Group>
        <DatePicker  
          onChange={onChangeDate} 
          placeholder={moment().format("YYYY-MM-DD")}
        />
        <Select 
          placeholder="地区"
          suffixIcon={<IconFont type="iconDD" className="main-icon-dd mt-0" />}
        >
          <Option value="0">全部</Option>
          <Option value="1">欧元区</Option>
          <Option value="2">美国</Option>
          <Option value="3">英国</Option>
          <Option value="4">日本</Option>
          <Option value="5">加拿大</Option>
          <Option value="6">瑞士</Option>
        </Select>
        <Select 
          placeholder="关键字"
          suffixIcon={<IconFont type="iconDD" className="main-icon-dd mt-0" />}
        >
          <Option value="0">会议纪要</Option>
          <Option value="1">央行</Option>
          <Option value="2">失业率</Option>
          <Option value="3">CPI</Option>
          <Option value="4">GDP</Option>
        </Select>
      </Space>
      <Space 
        className="cp-tables-ul"
        direction="vertical"
      >
        <Table 
          title={() => `${moment(currStamp).format('YYYY-MM-DD')} 周${chWeek.substr(moment(currStamp).day(), 1)} 经济数据一览表`}
          className="cp-table-li"
          columns={getColumns}
          // loading={true}
        />
      </Space>
    </div>
  )
}

export default connect()(CalendarPanes)