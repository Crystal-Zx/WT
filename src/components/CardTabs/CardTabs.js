import { Tabs,Spin } from 'antd'
import propTypes from 'prop-types'

const { TabPane } = Tabs

export default function CardTabs ({ 
  initialPanes, 
  onChange, 
  activeKey = initialPanes[0].key,
  defaultActiveKey = initialPanes[0].key,
  isFetching = false, 
  className,
  type = "card", 
  tabPosition = "top",
  tabBarGutter = 0}
) {  
  return (
    <Tabs
      className={className}
      type={type}
      hideAdd={true}
      onChange={onChange}
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
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

CardTabs.propTypes = {
  initialPanes: propTypes.array.isRequired,
  onChange: propTypes.func,
  activeKey: propTypes.string,
  defaultActiveKey: propTypes.string,
  isFetching: propTypes.bool,
  className: propTypes.string,
  type: propTypes.string,
  tabPosition: propTypes.string,
  tabBarGutter: propTypes.number
}