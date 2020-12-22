import { Tabs,Spin } from 'antd'
import { useState } from 'react'

const { TabPane } = Tabs

export default function CardTabs ({ initialPanes,onChange, isFetching, activeKey = initialPanes[0].key, className, type = "card", tabPosition = "top", tabBarGutter = 0}) {
  // const [activeKey, setActiveKey] = useState(initialPanes[0].key)

  // const onChange = activeKey => {
  //   setActiveKey(activeKey)
  // }

  // console.log("=====CardTabs",initialPanes, initialPanes[0].key)

  
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
            {
              ( !isFetching && activeKey === pane.key )
              &&
              pane.content
            }
          </TabPane>
        ))
      }
    </Tabs>
  )
}