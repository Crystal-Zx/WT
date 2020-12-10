import { Tabs,Spin } from 'antd'
import { useState } from 'react';
import './CardTabs.scss'

const { TabPane } = Tabs

export default function CardTabs ({ initialPanes, isFetching, className, type = "card", tabPosition = "top", tabBarGutter = 0}) {
  // console.log("=======CardTabs", props.initialPanes)
  // const { className,type = "card", initialPanes,tabPosition = "top", tabBarGutter = 0 } = props
  const [activeKey, setActiveKey] = useState(initialPanes[0].key)
  // const [panes, setPanes] = useState(initialPanes)

  const onChange = activeKey => {
    setActiveKey(activeKey)
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
      {
        initialPanes.map(pane => (
        <TabPane 
          tab={pane.title} 
          key={pane.key} 
          closable={pane.closable}
        >
          { isFetching && <Spin /> }
          { !isFetching && pane.content}
        </TabPane>
      ))
      }
    </Tabs>
  )
}