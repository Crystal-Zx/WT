import { StarFilled } from '@ant-design/icons';

import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getSymbols, setSymbolType } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import QuoteSPane from '../QuoteSPanes/QuoteSPanes.js';

const QuotePanes = (props) => {

  const { getSymbols, changeSymbolType, symbolList } = props
  const { list, types, isFetching} = symbolList

  const init = () => {
    const keyLen = Object.keys(list).length
    if (keyLen <= 1 && !isFetching) {
      getSymbols()
    }
  }
  const getQuoteSPanes = () => {
    const typeArr = Object.keys(list).filter(sType => sType !== 'isFetching')
    
    return typeArr.map((sType) => {
      return {
        title: sType,
        content: <QuoteSPane list={list[sType]} types={types} />,
        key: sType
      }
    })
  }
  // const onChangeSymbolType = () => {

  // }
  
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
                  defaultActiveKey="2" 
                  onChange={changeSymbolType}
                ></LineTabs>
              </div>
            ), 
            key: '1'
          }
        ]}
        isFetching={symbolList.isFetching}
      ></CardTabs>
    </div>
  )  
}

const mapStateToProps = (state) => {
  // console.log("=======QuotePanes state:", state)
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
        console.log(res)
        const list = res.value
        const defaultType = Object.keys(list).filter(sType => sType !== 'isFetching')[0]
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