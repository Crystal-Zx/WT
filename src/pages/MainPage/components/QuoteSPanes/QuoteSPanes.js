import { Button } from 'antd'
import SearchBox from '../../../../components/SearchBox/SearchBox.js'
import TableBox from '../../../../components/TableBox/TableBox.js'
import IconFont from '../../../../utils/iconfont/iconfont'
import QuoteTr from '../QuoteTr/QuoteTr.js'

export default function QuoteSPane () {
  
  return (
    <div className="quote-x">
      <div className="search-container">
        <SearchBox />
        <Button type="primary" className="btn-more">
          <IconFont type="iconSquare" className="iconSquare" />
        </Button>
      </div>
      <TableBox expandedRowRender={<QuoteTr />}></TableBox>
    </div>
  )
}