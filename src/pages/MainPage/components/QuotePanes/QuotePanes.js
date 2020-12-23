import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getSymbols, setSymbolType } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import QuoteSPane from './QuoteSPanes.js';
import styles from './QuotePanes.module.scss';

const QuotePanes = (props) => {
  // console.log("===QP props:", props)
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
  },[])
  
  return (
    <div className={styles['quote-panes-x']}> 
      <CardTabs
        initialPanes={[
          {
            title: '品种报价', 
            content: (
              <LineTabs
                initialPanes={getQuoteSPanes()}
                activeKey={filterType} 
                onChange={changeSymbolType}
              ></LineTabs>
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
  console.log("===QP mapState:", state)
  const {
    filterType = '', 
    symbolList = {}
  } = state.QuoteReducer
  return {
    filterType,
    symbolList,
    // socket: state.MainReducer.initSocket
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
      dispatch(setSymbolType(sType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuotePanes)