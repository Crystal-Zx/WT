import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getSymbols, setSymbolType } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import QuoteSPane from './QuoteSPanes.js';
import './QuotePanes.scss';

const QuotePanes = (props) => {

  const { getSymbols, changeSymbolType, symbolList, filterType } = props
  const { list, types, isFetching} = symbolList
  const init = () => {
    const keyLen = Object.keys(list).length
    if (keyLen <= 1 && !isFetching) {
      getSymbols()
    }
  }
  const getQuoteSPanes = () => {
    const typeArr = Object.keys(list)
    
    return typeArr.map((sType) => {
      return {
        title: sType,
        content: <QuoteSPane list={list[sType]} types={types} />,
        key: sType
      }
    })
  }
  
  useEffect(() => {
    init()
  })

  return (
    <div className="left-x card-container">
      <CardTabs 
        initialPanes={[
          { 
            title: '品种报价', 
            content: (
              <div className="line-container">
                <LineTabs 
                  initialPanes={getQuoteSPanes()} 
                  activeKey={filterType} 
                  onChange={changeSymbolType}
                ></LineTabs>
              </div>
            ), 
            key: '1'
          }
        ]}
        isFetching={isFetching}
      ></CardTabs>
    </div>
  )  
}

const mapStateToProps = (state) => {
  const {
    filterType = '', 
    symbolList = {}
  } = state.QuoteReducer
  return {
    filterType,
    symbolList
  }
}

// 此方法只是用于建立和store.dispatch的联系
// 若没有使用dispatch的方法 直接写在组件内部即可！！！
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getSymbols: () => {
      dispatch(getSymbols()).then((res) => {
        const { list } = res.value
        const defaultType = Object.keys(list)[0]
        dispatch(setSymbolType(defaultType))
      })
    },
    changeSymbolType: (sType) => {
      console.log("======changeSymbolType",sType)
      dispatch(setSymbolType(sType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuotePanes)