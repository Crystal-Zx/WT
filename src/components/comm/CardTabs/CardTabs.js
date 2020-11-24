import { Tabs } from 'antd'
import { useState } from 'react';
import './CardTabs.scss'

const { TabPane } = Tabs

export default function CardTabs (props) {
  const { initialPanes } = props
  const [activeKey, setActiveKey] = useState(initialPanes[0].key)
  const [panes, setPanes] = useState(initialPanes)

  const onChange = activeKey => {
    setActiveKey(activeKey)
  }
  const remove = targetKey => {
    let newActiveKey,nextIndex
    panes.forEach((pane,i) => {
      nextIndex = pane.key === targetKey ? i : 0
    })
    const newPanes = panes.filter((pane) => pane.key !== targetKey)
    if(newPanes.length && targetKey === activeKey) {
      newActiveKey = panes[nextIndex].key
    }
    setActiveKey(newActiveKey)
    setPanes(newPanes)
  }

  return (
    <Tabs
      type="card"
      hideAdd={true}
      onChange={onChange}
      activeKey={activeKey}
      tabBarGutter="0"
    >
      {panes.map(pane => (
        <TabPane 
          tab={pane.title} 
          key={pane.key} 
          closable={pane.closable}
        >
          {pane.content}
        </TabPane>
      ))}
    </Tabs>
  )
}