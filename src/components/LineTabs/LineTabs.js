import { Tabs } from 'antd'
import { useState } from 'react';
import './LineTabs.scss'

const { TabPane } = Tabs


export default function LineTabs (props) {
  const { initialPanes } = props
  const [activeKey, setActiveKey] = useState(initialPanes[0].key)
  const [panes, setPanes] = useState(initialPanes)
  // func
  const onChange = (key) => {
    setActiveKey(key)
  }
  return (
    <Tabs 
      type="line"
      className="line-tabs"
      defaultActiveKey={activeKey} 
      onChange={onChange}
    >
      { 
        panes.map(pane => (
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