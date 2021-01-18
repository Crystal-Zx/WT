import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { _getNewsData } from '../../../../services/index'

const NewsPanes = ({ dispatch }) => {
  const [newsData, setNewsData] = useState([])

  useEffect(() => {
    const t = setInterval(() => {
      _getNewsData({
        t: new Date().getTime()
      }).then(res => {
        console.log("====res:", res)
      }).catch(err => {
        console.log("====err:", err)
      })
    }, 2000);
    return () => {
      clearInterval(t)
    }
  }, [])

  return (
    <>
      <p>新闻信息</p>
    </>
  )
}

export default connect()(NewsPanes)