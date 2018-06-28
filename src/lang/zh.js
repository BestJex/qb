export default function zh(state) {
  const {
    nameCny,
    nameUsd,
    netUrl,
    applyEmailUrl,
    contactEmailUrl,
    addr
  } = state;
  // 公共、主页及不在其他模块的翻译属于common
  const common = {
    home_v1: "首页",
    exchange_v1: "币币交易",
    assets_v1: "资产管理",
    order_v1: "订单管理",
    security_v1: "安全中心",
    idVerify_v1: "身份认证",
    logOut_v1: "退出",
    total_v1: "成交额",
    favorite_v1: "收藏",
    favorites_v1: "收藏区",
    market_v1: "市场",
    markets_v1: "交易盘",
    lastPrice_v1: "最新成交价",
    volume_v1: "成交量",
    change_v1: "涨跌幅",
    change7D_v1: "7日涨跌幅",
    infoView_v1: "资讯概览",
    seeMore_v1: "查看更多",
    readMore_v1: "阅读详情",
    yes_v1: "是",
    no_v1: "否",
    email_v1: "电子邮件",
    phone_v1: "手机号",
    alter_v1: "修改",
    set_v1: "设置",
    fundPass_v1: "资金密码",
    twoStep_v1: "两步验证",
    save_v1: "保存",
    add_v1: "添加",
    example_v1: "例如",
    or_v1: "或",
    action_v1: "操作",
    buy_v1: "买入",
    sell_v1: "卖出",
    price_v1: "价格",
    amount_v1: "数量",
    deposit_v1: "充币",
    cny_v1: "人民币",
    usd_v1: "美元",
    state_v1: "状态",
    time_v1: "时间",
    cancel_v1: "撤销",
    pending_v1: "审核中",
    passed_v1: "通过",
    failed_v1: "未通过",
    fee_v1: "手续费",
    option_v1: "操作"
  };
  const asset = {
    "asset-totalAssets_v1": "总资产约",
    "asset-balance_v1": "账户余额",
    "asset-24hQuota_v1": "24H提币额度",
    "asset-limitApply_v1": "提额申请",
    "asset-usedAsset_v1": "已用",
    "asset-hideLittle_v1": "隐藏小额资产",
    "asset-hideZero_v1": "隐藏0余额币种",
    "asset-withdraw_v1": "提币",
    "asset-trade_v1": "交易",
    "asset-currency_v1": "币种",
    "asset-fullname_v1": "全称",
    "asset-avail_v1": "可用余额",
    "asset-lock_v1": "冻结中金额",
    "asset-tobtc_v1": "BTC估值",
    "asset-tip1_v1": "小于0.001btc",
    "asset-tip2_v1": "交易未匹配完成,处于挂单环节的金额",
    "asset-tip3_v1": "此项估值为可用余额估值",
    "asset-records_v1": "资产记录",
    "asset-selectCoin_v1": "选择币种",
    "asset-amount_v1": "总额",
    "asset-orderLock_v1": "下单冻结",
    "asset-depositTip_v1":
      "注意：禁止向{currency}地址充值除{currency}之外的资产，任何充入{currency}地址的非{currency}资产将不可找回。",
    "asset-depositAddress_v1": "充值地址",
    "asset-showQrcode_v1": "展示二维码",
    "asset-copy_v1": "复制到剪贴板",
    "asset-reminder_v1": "温馨提示",
    "asset-depositReminder1_v1":
      "使用{currency}地址充值需要{number}个网络确认才能到账",
    "asset-depositReminder2-1_v1": "您可以在充值提现",
    "asset-depositReminder2-2_v1": "页面跟踪进度",
    "asset-toTrade_v1": "去交易",
    "asset-depositHistory_v1": "充币记录",
    "asset-depositTime_v1": "充币时间",
    "asset-depositAmount_v1": "充币数量",
    "asset-sendAddress_v1": "发送地址",
    "asset-receiveAddress_v1": "接受地址",
    "asset-confirm_v1": "确认数",
    "asset-viewAll_v1": "查看全部",
    "asset-minWithdraw_v1":
      "注意：最小提现数量为{number}{currency};请勿直接提现至众筹或ICO地址 ，我们不会处理未来代币的发放。",
    "asset-withdrawAddress_v1": "提现地址",
    "asset-addAddress_v1": "添加地址",
    "asset-withdrawAmount_v1": "提现数量",
    "asset-withdrawAvailable_v1": "可提现余额",
    "asset-gasFee_v1": "矿工费",
    "asset-withdrawActual_v1": "实际到账"
  };
  const market = {};
  const notice = {};
  const order = {};
  const deal = {};
  const user = {};
  const login = {};
  const help = { "help-termsFirst_v1": `${nameUsd}所提供的各项服务的所有权和运作权均归${nameUsd} LTD.所有。${nameUsd}用户使用协议（以下简称“本协议”）由${nameUsd}用户与${nameUsd}就${nameUsd}的各项服务所订立的相关权利义务规范。用户通过访问和/或使用本网站，即表示接受并同意本协议的所有条件和条款。${nameUsd}作为 ${nameUsd}（${netUrl}）的运营者依据本协议为用户提供服务。不愿接受本协议条款的，不得访问或使用本网站。` };
  return Object.assign(
    {},
    common,
    asset,
    market,
    notice,
    order,
    deal,
    user,
    login,
    help
  );
}
