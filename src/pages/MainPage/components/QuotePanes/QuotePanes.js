import CardTabs from '../../../../components/CardTabs/CardTabs.js'
import LineTabs from '../../../../components/LineTabs/LineTabs.js'

import { useEffect } from 'react'
import { connect } from 'react-redux'
import { initSocket } from '../../MainAction'
import { getSymbols, setSymbolType } from './QuoteAction'

import { _login } from '../../../../services/index.js';
import QuoteSPane from './QuoteSPanes.js';
import styles from './QuotePanes.module.scss';

const QuotePanes = (props) => {
  console.log("====QuotePanes render") 
  const { 
    dispatch, symbolList, filterType, socket
  } = props
  const { list, types, isFetching } = symbolList
  
  const init = () => {
    dispatch(initSocket())
    const keyLen = Object.keys(list).length
    if (keyLen <= 1 && !isFetching) {
      dispatch(getSymbols()).then((res) => {
        const { list } = res.value
        const defaultType = Object.keys(list)[0]
        dispatch(setSymbolType(defaultType))
      })
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

  useEffect(() => {
    if(Object.keys(socket).length && socket.checkOpen()) {
      socket.send({
        "cmd": "symbols",
        "args": [""]
      })
      const args = types.join(".")
      // 获取报价信息
      socket.send({
        "cmd": "quote",
        "args": [`${args}`]
      })
    }
  }, [JSON.stringify(socket) ,types.length])
  
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
                onChange={sType => dispatch(setSymbolType(sType))}
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

export default connect(
  state => {
    const {
      filterType = '', 
      symbolList = {}
    } = state.QuoteReducer
    
    return {
      filterType,
      symbolList,
      socket: state.MainReducer.initSocket
    }
  }
)(QuotePanes)