import { Input } from 'antd'
import IconFont from '../../utils/iconfont/iconfont'
import './SearchBox.scss'

const { Search } = Input

export default function SearchBox () {
  const onSearch = (value) => {
    console.log(value)
  }
  return (
    <>
      <Search 
        placeholder="搜索例如EURCHF" 
        allowClear
        onSearch={onSearch}
      />
    </>
  )
}