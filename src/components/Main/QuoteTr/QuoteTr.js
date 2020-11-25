import { Button } from 'antd'
import { useState } from 'react'
import './QuoteTr.scss'


export default function QuoteTr (props) {
  const [quote, setQuote] = useState(props.quote)
  return (
    <>
      <div className="qe-row-1">
        <Button type="primary" className="qe-btn qe-btn-sell">
          <span className="qe-price">0.69786</span>
          <span className="qe-type">Sell</span>
        </Button>
        <span className="qe-spread">20</span>
        <Button type="primary" className="qe-btn qe-btn-buy">
          <span className="qe-price">0.69786</span>
          <span className="qe-type">Buy</span>
        </Button>
      </div>
      <div className="qe-row-2">
        <span className="qe-val qe-high">0.64875</span>
        <span>+0.33%</span>
        <span className="qe-val qe-low">0.624586</span>
      </div>
    </>
  )
}