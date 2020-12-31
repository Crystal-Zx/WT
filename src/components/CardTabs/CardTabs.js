import { Tabs,Spin } from 'antd'

const { TabPane } = Tabs

export default function CardTabs ({ 
  initialPanes, 
  onChange, 
  activeKey = initialPanes[0].key,
  isFetching = false, 
  className, 
  type = "card", 
  tabPosition = "top", 
  tabBarGutter = 0}
) {
  
  // console.log("====CardTabs render")
  
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