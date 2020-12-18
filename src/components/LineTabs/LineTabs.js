import { Tabs } from 'antd'
import propTypes from 'prop-types'

const { TabPane } = Tabs

const LineTabs = ({ onChange, initialPanes, activeKey }) => {
  return (
    <Tabs 
      type="line"
      className="ant-tabs-line"
      defaultActiveKey={activeKey}
      onChange={onChange}
    >
      { 
        initialPanes.map(pane => (
          <TabPane 
            tab={pane.title}
            key={pane.key}
          >
            {activeKey === pane.key && pane.content}
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