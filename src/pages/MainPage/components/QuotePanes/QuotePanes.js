import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'
import QuoteSPanes from '../QuoteSPanes/QuoteSPanes.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'

import { axiosPosts, selectQuoteTYPE } from '../../MainAction.js';
import { _login } from '../../../../services/index.js';

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
  const { onLoad } = props
  useEffect(() => {
    onLoad()
    // _login({
    //   login: 11922,
    //   password: 'w0ywjpx'
    // }).then(res => {
    //   console.log(res)
    // })
  })
  return (
    <div className="left-x card-container">
      <CardTabs initialPanes={quotePanes}></CardTabs>
    </div>
  )
}

const getQuoteList = (quoteList,type) => {
  console.log(quoteList,type)
  return quoteList[type]
}

const mapStateToProps = (state) => {
  state = state.MainReducer
  console.log(state)
  return {
    quoteList: getQuoteList(state.quoteList, state.quoteType)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {
      dispatch(selectQuoteTYPE())
      dispatch(axiosPosts()).then(() => {
        console.log(ownProps)
      })
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(QuotePanes)