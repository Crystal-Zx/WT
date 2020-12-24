import { Button } from 'antd'


export default function QuoteTr ({ data }) {
  // console.log("=====QuoteTr",data)
  return (
    <>
      <div className="qe-row-1">
        <Button type="primary" className="qe-btn qe-btn-sell">
          <span className="qe-price">{data.sell}</span>
          <span className="qe-type">Sell</span>
        </Button>
        <span className="qe-spread">0.01</span>
        <Button type="primary" className="qe-btn qe-btn-buy">
          <span className="qe-price">{data.buy}</span>
          <span className="qe-type">Buy</span>
        </Button>
      </div>
      <div className="qe-row-2">
        <span className="qe-val qe-high">High: {data.high}</span>
        <span>{data.per}</span>
        <span className="qe-val qe-low">Low: {data.low}</span>
      </div>
    </>
  )
}