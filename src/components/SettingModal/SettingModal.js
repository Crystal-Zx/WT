import { Modal, Form, Switch } from 'antd'
import styles from './SettingModal.module.scss'

const SettingModal = ({ visible = false, onCancel }) => {
  
  const local_settings = JSON.parse(localStorage.getItem("wt_settings")) || {}
  const onValuesChange = (changeValues, allValues) => {
    console.log("===onValuesChange", changeValues, allValues)
    localStorage.setItem("wt_settings", JSON.stringify({
      ...local_settings,
      ...changeValues
    }))
  }

  return (
    <>
      <Modal
        title="设置"
        width={360}
        visible={visible}
        destroyOnClose={true}
        footer={null}
        onCancel={onCancel}
        className={styles['wt-settings-x']}  // sim: symbolInfo Modal
        wrapClassName="wt-settings-x"
      >
        <p className="st-title">平台确认</p>
        <p className="st-desc">如打开选项，关闭未平仓仓位之前需要用户确认。</p>
        <Form
          name="settings"
          initialValues={{
            closeOrderComfirm: typeof local_settings['closeOrderComfirm'] === 'boolean' ? local_settings['closeOrderComfirm'] : true,
          }}
          onValuesChange={onValuesChange}
        >
          <Form.Item name="closeOrderComfirm" label="平仓" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SettingModal