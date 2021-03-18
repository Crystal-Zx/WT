import { Image } from "antd"

const Description = () => {
  return (
    <>
      <Image
        width="320px"
        src="./img/logo_fff.png"
        className="img-logo"
      />
      <h1>We are glad to see you again!</h1>
      <div className="qrcode-ul">
        <div className="qrcode-li">
          <Image 
            className="img-qrcode"
            src="./img/qrcode_android_1.png"
          />
          <span className="qrcode-desc">Android</span>
        </div>
        <div className="qrcode-li">
          <Image 
            className="img-qrcode"
            src="./img/qrcode_ios.png"
          />
          <span className="qrcode-desc">IOS</span>
        </div>
      </div>
      <p className="scan-tip">扫描上方二维码下载火象交易APP</p>
    </>
  )
}

export default Description