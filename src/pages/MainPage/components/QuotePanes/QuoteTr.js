import { Button, InputNumber } from 'antd'
import { toDecimal } from '../../../../utils/utilFunc'

export default function QuoteTr ({ data }) {
  const onChange = (value) => {
    // console.log('changed', value);
  }
  return (
    <>
      <div className="qtr-row-1">
        <Button type="primary" className="qtr-btn qtr-btn-sell">
          <span className="qtr-price">{data.bid || '---'}</span>
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
          <span className="qtr-price">{data.ask || '---'}</span>
          <span className="qtr-type">Buy</span>
        </Button>
      </div>
      <div className="qtr-row-2">
        <span className="qtr-val qtr-high">High: &nbsp;
          {data.high ? toDecimal(data.high, data.digits) : '---'}
        </span>
        <span>{data.per}</span>
        <span className="qtr-val qtr-low">Low: &nbsp;
          {data.low ? toDecimal(data.low, data.digits) : '---'}
        </span>
      </div>
    </>
  )
}