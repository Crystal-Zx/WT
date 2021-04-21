import { Tabs, Select } from 'antd'
import propTypes from 'prop-types'

const { TabPane } = Tabs

const LineTabs = ({ onChange, initialPanes, defaultActiveKey }) => {
  // console.log("====LineTabs render", initialPanes)
  // activeKey = activeKey || initialPanes[0].key
  // const getTab = (pane) => {
  //   // console.log(pane)
  //   if(!pane.subGroups || !pane.subGroups.length) {
  //     return pane.title
  //   } else {
  //     return (
  //       <Select default='全部' onChange>

  //       </Select>
  //     )
  //   }
  // }
  return (
    <Tabs 
      type="line"
      className="ant-tabs-line"
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
    >
      { 
        initialPanes.map(pane => (
          <TabPane 
            tab={pane.title}
            key={pane.key}
          >
            {/* {activeKey === pane.key && pane.content} */}
            {pane.content}
          </TabPane>
        ))
      }
    </Tabs>
  )
}

LineTabs.propTypes = {
  onChange: propTypes.func,
  initialPanes: propTypes.array.isRequired,
  defaultActiveKey: propTypes.string
}

export default LineTabs