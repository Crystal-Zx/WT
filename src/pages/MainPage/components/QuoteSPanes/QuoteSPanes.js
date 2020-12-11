import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'
import QuoteTr from '../QuoteTr/QuoteTr.js'

// import { connect } from 'react-redux'

const QuoteSPane = ({ data }) => {

  // 处理data格式，生成展示行数据
  const getTrData = () => {
    return data.map((item) => {
      return {
        key: item.symbol,
        symbol: item.symbol,
        spread: item.point,
        sell: '---',
        buy: '---',
        desc: '展开内容'
      }
    })
  }

  return (
    <div className="quote-x">
      <div className="search-container">
        <SearchBox />
        <Button type="primary" className="btn-more">
          <IconFont type="iconSquare" className="iconSquare" />
        </Button>
      </div>
      <TableBox 
        data={getTrData()}
        expandedRowRender={<QuoteTr />}
      ></TableBox>
    </div>
  )
}

// const getQuoteByType = (list,qType) => {
//   return list[qType]
// }

// const mapStateToProps = (state) => {
//   const { 
//     filterType = '',
//     list = {}
//   } = state.QuoteReducer
//   return {
//     list: list[filterType]
//   }
// }

export default QuoteSPane