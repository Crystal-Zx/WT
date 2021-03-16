import { Button, Input } from 'antd'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addToKLine } from '../../MainAction'
import { FormattedMessage, useIntl } from 'react-intl'

const { Search } = Input



const QuoteSPane = (props) => {
  // console.log("====QSP RENDER")
  const { list, addToKLine } = props
  const [searchVal, setSearchVal] = useState("")
  const [isExpandAll, setIsExpandAll] = useState(false)
  const intl = useIntl()

  // const addToFavorite = (e) => {
  //   console.log("addToFavorite",e)
  //   e.stopPropagation()
  // }
  const onChangeExpand = () => {
    setIsExpandAll(!isExpandAll)
  }

  return (
    <>
      <div className="qsp-search-x">
        <Search
          placeholder={intl.formatMessage({
            id: "quote.search.placeHolder",
            defaultMessage: "搜索例如EURCHF",
          })} 
          allowClear
          onSearch={(val) => setSearchVal(val.trim())}
        />
        <Button 
          type="default"
          className="qsp-btn-fold"
          onClick={onChangeExpand}
        >
          <IconFont type="iconFold" className="wt-icon icon-fold" />
        </Button>
      </div>
      <TableBox
        data={
          searchVal ? list.filter(item => item.key.toUpperCase().indexOf(searchVal.toUpperCase()) !== -1) : list
        }
        // addToFavorite={addToFavorite}
        addToKLine={addToKLine}
        isExpandAll={isExpandAll}
      ></TableBox>
    </>
  )
}
// const areEqual = (prevProps, nextProps) => {
//   console.log(prevProps.list, nextProps.list, JSON.stringify(prevProps.list) === JSON.stringify(nextProps.list))
//   if(JSON.stringify(prevProps.list) === JSON.stringify(nextProps.list)) {
//     return true
//   } else {
//     return false
//   }
// }

export default connect(
  state => {
    const { 
      symbolList,
      filterGroup
      // kLineList
    } = state.MainReducer
    let list
    if(filterGroup === '自选') {
      list = JSON.parse(localStorage.getItem('wt_symbolList')) || []
    } else {
      list = symbolList.list.filter(item => item.group === filterGroup)
    }
    return {
      list
    }
  },
  dispatch => {
    return {
      addToKLine: (e, symbol, digits) => {
        e.stopPropagation()
        dispatch(addToKLine({ symbol, digits, isActive: true }))
      }
    }
  }
)(QuoteSPane)