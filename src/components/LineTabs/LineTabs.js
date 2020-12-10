import { Tabs } from 'antd'
import './LineTabs.scss'
import propTypes from 'prop-types'

const { TabPane } = Tabs

const LineTabs = ({ onChange,initialPanes,activeKey }) => {
  // const [activeKey, setActiveKey] = useState(defaultActiveKey || initialPanes[0].key)
  // const [panes, setPanes] = useState(initialPanes)
  // // func
  // const onChange = (key) => {
  //   setActiveKey(key)
  // }
  // console.log(initialPanes)
  return (
    <Tabs 
      type="line"
      className="line-tabs"
      defaultActiveKey={activeKey} 
      onChange={onChange}
    >
      { 
        initialPanes.map(pane => (
          <TabPane 
            tab={pane.title} 
            key={pane.key}
            className="line-tabpane"
          >
            {pane.content}
          </TabPane>
        ))
      }
    </Tabs>
  )
}

LineTabs.propTypes = {
  onChange: propTypes.func.isRequired,
  initialPanes: propTypes.array.isRequired,
  activeKey: propTypes.string.isRequired
}

export default LineTabs