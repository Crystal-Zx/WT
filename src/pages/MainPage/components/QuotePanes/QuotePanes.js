import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'
import QuoteSPanes from '../QuoteSPanes/QuoteSPanes.js'

import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setFilterType, axiosPostsIfNeeded } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import { initial } from 'lodash';

// const quoteSPanes = [
//   { 
//     title: <StarFilled />, 
//     content: <QuoteSPanes />,
//     key: '1' 
//   },
//   { title: 'FX', content: <QuoteSPanes />, key: '2' },
//   { title: 'IND', content: <QuoteSPanes />, key: '3' },
//   { title: 'STO', content: <QuoteSPanes />, key: '4' },
//   { title: '全部', content: <QuoteSPanes />, key: '5' }
// ]

// const quotePanes = [
//   { title: '品种报价', 
//     content: (
//       <div className="line-container">
//         <LineTabs initialPanes={quoteSPanes} defaultActiveKey="2"></LineTabs>
//       </div>
//     ), 
//     key: '1'
//   }
// ]


const QuotePanes = (props) => {
  console.log("QuotePanes 被调用了，props: ",props.list.isFetching)

  const { dispatch, list } = props
  console.log(list)
  const getList = () => {
    // dispatch(setFilterType())
    dispatch(axiosPostsIfNeeded())
    // .then(() => {
    //   console.log("ownProps",ownProps)
    // })
  }

  const onChange = () => {
    console.log("onChange")
  }

  let quoteSPanes = []

  const typeArr = Object.keys(list).filter(name => name !== 'isFetching')
  quoteSPanes = typeArr.map((typeName, index) => {
    return {
      title: typeName,
      content: <QuoteSPanes />,
      key: index
    }
  })

  useEffect(() => {
    getList()
  })

  const initialPanes = [
    { title: '品种报价', 
      content: (
        <div className="line-container">
          <LineTabs 
            initialPanes={quoteSPanes} 
            defaultActiveKey="2" 
            onChange={onChange}
          ></LineTabs>
        </div>
      ), 
      key: '1'
    }
  ]

  return (
    <div className="left-x card-container">
      <CardTabs 
        initialPanes={initialPanes}
        isFetching={list.isFetching}
      ></CardTabs>
    </div>
  )
  
}

const mapStateToProps = (state) => {
  const { 
    filterType = '', 
    list = {}
  } = state.QuoteReducer
  return {
    filterType, 
    list
  }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onChange: () => {
//       console.log("activeKey change!")
//     }
//   }

// }

export default connect(mapStateToProps)(QuotePanes)