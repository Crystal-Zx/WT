import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'
import QuoteSPanes from '../QuoteSPanes/QuoteSPanes.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'

import mock from '../../../../services/mock'

const quoteSPanes = [
  { 
    title: <StarFilled />, 
    content: <QuoteSPanes />,
    key: '1' 
  },
  { title: 'FX', content: <QuoteSPanes />, key: '2' },
  { title: 'IND', content: <QuoteSPanes />, key: '3' },
  { title: 'STO', content: <QuoteSPanes />, key: '4' },
  { title: '全部', content: <QuoteSPanes />, key: '5' }
]
const quotePanes = [
  { title: '品种报价', 
    content: (
      <div className="line-container">
        <LineTabs initialPanes={quoteSPanes} defaultActiveKey="2"></LineTabs>
      </div>
    ), 
    key: '1'
  }
]

function QuotePanes (props) {
  console.log("QuotePanes props: ",props)

  useEffect(() => {
    console.log(mock)
    
  })
  return (
    <div className="left-x card-container">
      <CardTabs initialPanes={quotePanes}></CardTabs>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedQuoteCategory: 'Indexes',
    postByQuoteCategory: {
      Indexes: {
        isFetching: false,
        items: [
          {
            contract_size: 1,
            currency: "HKD",
            digits: 1,
            margin_currency: "HKD",
            margin_mode: 1,
            point: 0.1,
            swap_long: -52.61,
            swap_short: -46.68,
            symbol: "HK50"
          },
          {
            contract_size: 10,
            currency: "JPY",
            digits: 0,
            margin_currency: "JPY",
            margin_mode: 1,
            point: 1,
            swap_long: -53.4,
            swap_short: -54.7,
            symbol: "JP225"
          }
        ]
      },
      CFD: {
        isFetching: false,
        items: []
      }
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }

}

export default connect(mapStateToProps)(QuotePanes)