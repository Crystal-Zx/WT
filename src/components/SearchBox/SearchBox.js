import { Input } from 'antd'
import './SearchBox.scss'

const { Search } = Input

export default function SearchBox ({ onSearch }) {  // 暂时无用
  // const onSearch = (value) => {
  //   console.log(value)
  // }
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