import { Tabs } from 'antd'
import { useState } from 'react';
import './CardTabs.scss'

const { TabPane } = Tabs

export default function CardTabs (props) {
  const { className,type = "card", initialPanes,tabPosition = "top", tabBarGutter = 0 } = props
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
      className={className}
      type={type}
      hideAdd={true}
      onChange={onChange}
      activeKey={activeKey}
      tabBarGutter={tabBarGutter}
      tabPosition={tabPosition}
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