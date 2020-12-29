import { Button, InputNumber } from 'antd'


export default function QuoteTr ({ data }) {
  // console.log("=====QuoteTr",data)
  const onChange = (value) => {
    // console.log('changed', value);
  }
  return (
    <>
      <div className="qtr-row-1">
        <Button type="primary" className="qtr-btn qtr-btn-sell">
          <span className="qtr-price">{data.sell}</span>
          <span className="qtr-type">Sell</span>
        </Button>
        <InputNumber
          className="qtr-volume-x"
          min={0.01}
          step={0.01}
          defaultValue={0.01}
          onChange={onChange}
        />
        <Button type="primary" className="qtr-btn qtr-btn-buy">
          <span className="qtr-price">{data.buy}</span>
          <span className="qtr-type">Buy</span>
        </Button>
      </div>
      <div className="qtr-row-2">
        <span className="qtr-val qtr-high">High: {data.high}</span>
        <span>{data.per}</span>
        <span className="qtr-val qtr-low">Low: {data.low}</span>
      </div>
    </>
  )
}