import { Input } from 'antd'
import './SearchBox.scss'

const { Search } = Input

export default function SearchBox () {
  const onSearch = (value) => {
    console.log(value)
  }
  return (
    <div className="search-container">
      <Search 
        placeholder="搜索例如EURCHF" 
        allowClear
        onSearch={onSearch}
      />
    </div>
  )
}