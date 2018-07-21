import ExchangeControllerBase from '../ExchangeControllerBase'
import UserStore from './UserStore'
import Browser from "../lib/Browser";
import DetectOS from "../lib/Os";

export default class UserController extends ExchangeControllerBase {
  constructor(props) {
    super(props)
    this.store = new UserStore()
    this.store.setController(this)
  }

  // setView(view){
  //   super.setView(view);
  //   // view.setState({count: this.store.count})
  //   // return this.store.data
  // }
  get configData() {
    return this.configController.initState;
  }

  //清除用户信息
  clearUserInfo(){
    this.store.clearUserInfo()
  }


  async getVerify(account, mode, type) { // 获取短信验证码
    if (this.view.state.verifyNum !== this.view.intl.get("sendCode") && this.view.state.verifyNum !== 0) return
    this.view.setState({verifyNum: 60})
    this.countDown('verifyCountDown', 'verifyNum', this.view)
    this.getCode(account, mode, type)
  }

  clearVerify() { // 清除短信验证码
    this.countDownStop('verifyCountDown')
    this.view.setState({verifyNum: this.view.intl.get("sendCode")})
  }
  // 从登录接口获取信息
  getUserId(data) {
    // console.log('ccc3', data)
    this.store.userLogin(data)
    // console.log('this.view',this.view)
    // this.view.history.goBack()
  }

  // 接口调用部分
  async initData() { // 获取用户信息
    let userInfo = await this.store.userInfo();
    // let obj = this.checkNum(userInfo.credits)
    this.view && this.view.setState({ userInfo });
    return userInfo;
  }

  async getUserAuthData() { // 获取用户认证信息
    let userAuth = await this.store.userAuth();
    this.view.setState({userAuth})
  }

  async getCurrentLogin() { // 获取当前登录设备
    let currentLogin = await this.store.currentLogin();
    this.view.setState({currentLogin})
  }

  async getLoginList() { // 获取登录记录
    let loginList = await this.store.loginList();
    this.view.setState({loginList})
  }

  async getIpList() { // 获取ip白名单
    let ipList = await this.store.ipList();
    console.log('ip白名单', ipList)
    this.view.setState({ipList})
  }

  async getUserCreditsNum() { // 获取用户积分信息
    let userCreditsNum = await this.store.userCreditsNum();
    this.view.setState({userCreditsNum})
  }

  async getUserCredits() { // 获取用户积分信息列表
    let userCredits = await this.store.userCredits();
    this.view.setState({userCredits})
  }

  async getGoogle() { // 获取谷歌密钥
     let googleSecret = await this.store.googleSecret();
     this.view.setState({googleSecret})
  }

  async uploadImg(file) { // 上传图片
    let res = await this.store.uploadImg(file),
      result = await res.text()
    // console.log(res, result)
    let imgUrl = `image${this.view.state.imgUrlIndex + 1}`, obj={}
    obj[imgUrl] = result
    this.view.setState(obj)
  }

  async uploadInfo() { // 身份认证确认提交
    let typeIndexArr = [1, 3], userAuth = this.view.state.userAuth, succObj = {}
    let result = await this.store.Proxy.uploadUserAuth({
      "uid": this.store.uid,
      "token": this.store.token,
      "firstName": this.view.state.firstNameValue, // 姓氏
      "lastName": this.view.state.lastNameValue, // 名字
      "name": `${this.view.state.firstNameValue}${this.view.state.lastNameValue}`, // 名字
      "type": typeIndexArr[this.view.state.selectIndex],  // 0：无 1：身份证 2：军官证 3：护照
      "number": this.view.state.numberValue, // 证件号
      "image1": this.view.state.image1, // 正面照
      "image2": this.view.state.image2, // 背面照
      "image3": this.view.state.image3  // 手持照
    })
    console.log('上传信息', result)
    succObj = {
      state: 1,
      firstName: this.view.state.firstNameValue,
      lastName: this.view.state.lastNameValue,
      number: this.view.state.numberValue
    }
    if (result === null) {
      userAuth = Object.assign(userAuth, succObj)
    }

    this.view.setState({
      remindPopup: true,
      // popType: result && result.ret === 101 ? 'tip1': 'tip3',
      // popMsg: result && result.ret === 101 ? this.view.intl.get("user-photoSucc") : result.msg // 上传成功
      popType: result ? 'tip3' : 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-photoSucc"), // 上传成功
      userAuth,
      checkVerifyArr: result ? true : false
    })

    // result.ret === 101 && this.view.setState({userAuth: Object.assign(this.view.state.userAuth, succObj), checkVerifyArr: false})
  }

  async bindUser(account, mode, code, captchaId, captchaCode) { // 绑定邮箱／手机号
    let noticeArr = [1, 0], noticeList = this.view.state.noticeList, verifyList = this.view.state.verifyList
    let result = await this.store.Proxy.bindUser({
      "userId": this.store.uid,
      "token": this.store.token,
      account,// 手机号或邮箱
      mode,// 0:phone 1:email
      code,
      captchaId, // 图形验证码id，没有就传空
      captchaCode, // 图形验证码，没有就传空
      "os": 3, // 1:android 2:iOS 3:borwser
    })
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-bindSucc"),
      showSet: result ? true : false
    })

    if (result === null && mode === 0) {
      noticeList[noticeArr[mode]].name = this.view.intl.get("user-noticePhone")
      verifyList.forEach(v => { v.contentList[2].name = this.view.intl.get("user-noticePhone") })
      this.view.setState({
        userInfo: Object.assign(this.view.state.userInfo, {phone: account}),
        noticeList,
        verifyList
      })
      // console.log('绑定成功', this.view.state)
      this.getCaptchaVerify()
      this.getUserCreditsNum()
      return
    }

    if (result === null && mode === 1) {
      noticeList[noticeArr[mode]].name = this.view.intl.get("user-noticeEmail")
      verifyList.forEach(v => { v.contentList[1].name = this.view.intl.get("user-noticeEmail") })
      this.view.setState({
        userInfo: Object.assign(this.view.state.userInfo, {email: account}),
        noticeList,
        verifyList
      })
      this.getCaptchaVerify()
      this.getUserCreditsNum()
      // console.log('绑定成功', this.view.state)
    }

    if (result !== null) {
      this.getCaptchaVerify()
    }
    // console.log('绑定手机号／邮箱', result)
  }

  async setLoginPass(oldPwd, newPwd, type) { // 设置登录密码
    let result = await this.store.Proxy.getLoginPwd({
      "userId": this.store.uid,
      "token": this.store.token,
      oldPwd,
      newPwd,
      type,// 0:设置密码 （不用传old_pass） 1:修改密码
    })
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-setSucc"),
      showSet: result ? true : false,
    })
    if (result === null) {
      this.view.setState({userInfo: Object.assign(this.view.state.userInfo, {loginPwd: 0})})
      this.store.state.userInfo.loginPwd = 0
    }
    console.log('设置密码', result)
  }

  async modifyFundPwd(account, mode, opType, newPass, captchaCode, captchaId, code) { // 修改资金密码
    let result = await this.store.Proxy.modifyFundPwd({
      "userId": this.store.uid,
      "token": this.store.token,
      account,
      mode, // 0:phone 1:email 2:google
      opType, // 0:设置资金密码 1:修改资金密码
      newPass,
      captchaCode, // 图形验证码，没有就传空
      captchaId, // 图形验证码id，没有就传空
      code,
      "os": 3, // 1:android 2:iOS 3:browser
    })
    console.log('设置密码', result)
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-setSucc"),
      showSet: result ? true : false
    })
    if (result === null && opType === 0) {
      this.view.setState({userInfo: Object.assign(this.view.state.userInfo, {fundPwd: 0})})
      this.store.state.userInfo.fundPwd = 0
      this.getCaptchaVerify()
    }
    if (result === null && opType === 1) {
      this.getCaptchaVerify()
    }
    if (result !== null) {
      this.getCaptchaVerify()
    }
  }

  async setTwoVerify(account, mode, code, picCode, picId, position, verifyType) { // 修改两步认证
    let twoVerifyArr = ['loginVerify', 'withdrawVerify', 'fundPassVerify'], changeVerifyArr = [3, 1, 0, 2];
    let twoVerifyState = twoVerifyArr[position-1]
    let twoVerifyUser = {}
    twoVerifyUser[twoVerifyState] = verifyType
    let userInfo = Object.assign(this.view.state.userInfo, twoVerifyUser)
    let verifyList = this.view.state.verifyList
    let result = await this.store.Proxy.setTwoVerify({
      "userId": this.store.uid,
      "token": this.store.token,
      account,
      mode, //0手机 1邮箱 2Google
      code, //验证码
      "os": 3, // 1:android 2:iOS 3:borwser
      picCode,//图形验证码
      picId,//验证码图片的id
      position,//修改的位置 1登陆   2提现   3资金密码
      verifyType//2谷歌验证 1邮件  3短信  0无
    })
    if (result === null) {
      verifyList[position-1].contentList.forEach(v=>v.flag=false)
      verifyList[position-1].contentList[changeVerifyArr[verifyType]].flag = true
      this.getCaptchaVerify()
    } else {
      this.getCaptchaVerify()
    }
    if (mode || account){
      this.view.setState({
        remindPopup: true,
        popType: result ? 'tip3': 'tip1',
        popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
        userInfo,
        showChange: result ? true : false,
        verifyList
      })
    }
    console.log('修改两步认证', result)
  }

  async addIp(ipAdd) { // 添加ip白名单
    let ipList = this.view.state.ipList, time = new Date().getTime() / 1000
    if (this.view.state.ipValue === '') return
    let result = await this.store.Proxy.addIp({
      "userId": this.store.uid,
      "token": this.store.token,
      "IPAddress":ipAdd
    })
    if (result && result.IPId) {
      ipList.push({IPAddress: ipAdd, createAt: time, IPId: result.IPId})
    }
    this.view.setState({
      remindPopup: true,
      popType: result && result.IPId ?  'tip1' : 'tip3',
      popMsg: result && result.IPId ?  this.view.intl.get("user-addSucc") : result.msg,
      ipList
    })
  }

  async delIp(ipId, iPAdd, index) { // 删除ip白名单
    let ipList = this.view.state.ipList
    let result = await this.store.Proxy.deletIp({
      "userId": this.store.uid,
      "token": this.store.token,
      "IPId": ipId,
      "IPAddress": iPAdd
    })
    if (result === null) {
      ipList.splice(index, 1)
    }
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-delSucc"),
      ipList
    })

  }

  async getCaptchaVerify() { // 获取图形验证码
    let captcha = await this.getCaptcha()
    this.view.setState({captcha: captcha.data, captchaId: captcha.id})
  }

  async setGoogleVerify(code) { // 验证谷歌验证码
    let result = await this.store.Proxy.setGoogleVerify({
      "userId": this.store.uid,
      "token": this.store.token,
      code
    })
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-googleSucc"),
      showGoogle: result ? true : false,
      userInfo: Object.assign(this.view.state.userInfo, {googleAuth: 0})
    })
    if (result === null) {
      this.getUserCreditsNum()
    }
    // if (result === null) {this.view.setState({showGoogle: false})}
    console.log('验证谷歌', result)
  }
  async setUserNotify(index) { // 修改通知方式
    this.view.setState({
      type: index + 1,
    })
    this.view.state.userInfo.notifyMethod === 0 && this.view.setState({ // 默认手机
      noticeIndex: !this.view.state.userInfo.email && index === 0 ? 1 : index,
      showSet: !this.view.state.userInfo.email && index === 0 ? true : false
    })
    this.view.state.userInfo.notifyMethod === 1 &&  this.view.setState({ // 默认邮箱
      noticeIndex: !this.view.state.userInfo.phone && index === 1 ? 0 : index,
      showSet: !this.view.state.userInfo.phone && index === 1 ? true : false
    })
    if (this.view.state.userInfo.email && index === 0 || this.view.state.userInfo.phone && index === 1) { // 两步认证修改
      let result = await this.store.Proxy.setUserNotify({
        "userId": this.store.uid,
        "token": this.store.token,
        "type": index === 0 ? 1 : 0 // 0:phone 1:email
      })
      this.view.setState({
        remindPopup: true,
        popType: result ? 'tip3': 'tip1',
        popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc")
      })
      console.log('改变通知', result, index)
    }
  }

  async outOther(flag1, flag2) { // 退出其他设备
    let result = await this.store.Proxy.outOther({
      "userId": this.store.uid,
      "token": this.store.token,
      "imei": `${flag1}/${flag2}`
    })
    this.view.setState({
      remindPopup: true,
      popType: result && result.errCode ? 'tip3': 'tip1',
      popMsg: result && result.errCode ? result.msg : this.view.intl.get("user-outSucc"),
    })
    console.log('退出其他设备', result)
  }

  async getIPAddr() {
    let result = await this.store.Proxy.getIPAddr()
    console.log('获取ip', result, this.view)
    this.view.setState({
      ipAddr: result.ip,
      showIp: true
    })
  }


  // 移动端用
  async setFundPwdSpace(type, pwd) { // 设置资金密码间隔
    let result = await this.setFundPwdInterval(type, pwd)
    this.view.setState({
      remindPopup: true,
      popType: result && result.errCode ? 'tip3': 'tip1',
      popMsg: result && result.errCode ? result.msg : this.view.intl.get("user-setSucc"),
      verifyFund:  result && result.errCode ? true : false
    })
    console.log('设置资金密码间隔', result)

  }


  // 为其他模块提供接口
  // 密码间隔  设置间隔  两步验证  设置用户初始信息  userId  是否设置资金密码
  get userVerify() { // 提供两步认证信息, 是否设置资金密码
    let {  //0: 已设置资金密码 1: 未设置资金密码; d
      fundPassVerify, loginVerify, withdrawVerify, fundPwd
    } = this.store.state.userInfo
    // console.log(this.store.state)
    return {fundPassVerify, loginVerify, withdrawVerify, fundPwd}
  }

  get userInfo() { // 提供用户手机号或者邮箱
    console.log('userInfo', this.store.state.userInfo)
    let {
      email, phone
    } = this.store.state.userInfo
    return { email, phone }
  }

  async getUserInfo() { // 请求用户信息
    if (!Object.keys(this.store.state.userInfo).length){
       await this.initData()
    }
    return this.store.state.userInfo;
  }

  get userAuthVerify() { // 提供用户是否实名
    let {  // 0未认证;1审核中;2已审核;3未通过;4恶意上传失败封锁3天;5永久禁止
      state
    } = this.store.state.userAuth
    return {state}
  }

  async getUserAuthVerify() { // 请求用户认证信息
    if (!Object.keys(this.store.state.userAuth).length){
      await this.getUserAuthData()
    }
    return this.store.state.userAuth;
  }

  get userToken() { // 提供用户token
    // this.Storage.userToken.set(this.store.state.token)
    // let storage = this.Storage.userToken.get().length === 0 ? '' : this.Storage.userToken.get()
    // let userToken = storage ? this.Storage.userToken.get() : this.store.state.token
    // return userToken
    return this.store.token
  }

  get userId() { // 提供用户id
    return this.store.uid
  }

  get userName() { // 提供用户姓名
    // this.Storage.userName.set(this.store.state.userName)
    // let storage = this.Storage.userName.get().length === 0 ? '' : this.Storage.userName.get()
    // let userName = storage ? storage : this.store.state.userName
    return this.store.name
  }

  async setFundPwdInterval(type, pwd) { // 设置资金密码输入间隔
    let result = await this.store.Proxy.setFundPwdSuspend({
      "userId": this.store.uid,
      "token": this.store.token,
      "interval": type, // 0:每次都需要密码 1:2小时内不需要 2:每次都不需要
      "fundPass": pwd
    })
    return result
  }

  async getFundPwdInterval() { // 查看资金密码输入间隔
    let result = await this.store.Proxy.getFundPwdSuspend({
      "userId": this.store.uid,
      "token": this.store.token,
    })
    // console.log('查看资金密码', result)
    return result
  }

  async getCode(account, mode, type) { // 获取短信验证码
    let result = await this.store.Proxy.getVerifyCode({
      account, // 手机号或者邮箱
      mode,//0 phone 1 email
      type,//0 登录; 1 修改密码; 2 支付; 3 绑定手机／邮箱; 5 设置资金密码 6 修改资金密码 7登陆第二次验证 8提币 9二次验证
      "os": 3// 1 android 2 iOS 3 browser
    })
    console.log('发送验证码', result, account, mode, type )
    return result
  }

  async getCaptcha() { // 获取图形验证码
    let result = await this.store.Proxy.getCaptcha()
    return result
  }

  //h5新增活动图片
  async getQbtTrade(){
    let result = await this.store.getQbtTrade()
    result && result.list && this.view.setState({ qbtTrade: result.list });
  }
}