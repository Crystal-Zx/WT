import { Button } from 'antd'
import SearchBox from '../../SearchBox/SearchBox.js'
import TableBox from '../../TableBox/TableBox.js'
import IconFont from '../../../utils/iconfont/iconfont.js'

export default function QuoteSPane () {
  return (
    <div className="quote-x">
      <div className="search-container">
        <SearchBox />
        <Button type="primary" className="btn-more">
          <IconFont type="iconSquare" className="iconSquare" />
        </Button>
      </div>
      <TableBox></TableBox>
    </div>
  )
}