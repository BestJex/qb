import React, {Component} from 'react';
import exchangeViewBase from "../../../components/ExchangeViewBase";
import {
  NavLink,
} from "react-router-dom";

export default class Balance extends exchangeViewBase {
  constructor(props) {
    super(props);
    let {controller} = props;
    this.name = "balance";
    this.state = {
      totalAsset: {},
      wallet: [],
      hideLittle: false,
      showAsset: true,
      sort: 0,  // 0-总资产降序,1-总资产升序,2-无序
      coin: controller.configData.coin,
    };
    //绑定view
    controller.setView(this);
    let {totalAsset, wallet} = controller.initState;
    this.state = Object.assign(this.state, {totalAsset, wallet});
    //绑定方法
    this.getAssets = controller.getAssets.bind(controller);
    this.filter = controller.filte.bind(controller);
    this.rank = controller.rank.bind(controller);
    // 获取Qbt
    this.getQbt = controller.getMyQbt.bind(controller);
    //头部
    this.addContent = controller.headerController.addContent.bind(controller.headerController) // 获取头部内容
    // 获取Qb信息
    this.getQb = controller.marketController.getQb.bind(controller.marketController);
  }

  async componentDidMount() {
    let {controller, history} = this.props;
    this.addContent({
      con: this.intl.get("header-assets2"),
      search: true,
      selectFn: () => history.push(`/wallet/search?to=/wallet/detail`)
    });

    await this.getAssets();
    if (this.props.controller.configData.activityState) {
      let qbt = await this.getQbt();
      let info = await this.getQb();
      if (qbt && this.state.wallet) {
        qbt.coinIcon = info.d ? info.d.lu : '';
        this.state.wallet.unshift(qbt);
        this.setState({ wallet: this.state.wallet})
      }
    }

    // 划出屏幕时 固定冲币提币和隐藏资产
    let dom = document.querySelector(".menu-ul");
    let dom2 = document.querySelector(".filter");
    window.onscroll = function () {
      if (document.documentElement.scrollTop >= dom.offsetTop) {
        dom.style.position = "fixed";
        dom.style.width = "100%";
        dom.style.top = ".45rem";

        dom2.style.position = "fixed";
        dom2.style.width = "100%";
        dom2.style.top = ".90rem";
      }
      else {
        dom.style.position = "";
        dom.style.top = ""
        dom2.style.position = "";
        dom2.style.top = "";
      }
    }


  }

  render() {
    let {controller, history} = this.props;
    let lang = controller.configData.language;
    let {totalAsset, wallet, hideLittle, showAsset, sort, coin} = this.state;
    let result = this.filter(wallet, "", hideLittle, null);
    result = this.rank(result, {totalCount: sort}) || [];
    return (
      <div className="balance">
        {/*总资产*/}
        <div className="total-asset">
          {/*总资产约(btc)*/}
          <div className="dv1">
            <label>{this.intl.get("h5-asset-totalAssets")}(BTC):</label>
            <img src={showAsset ? "/static/mobile/asset/icon_show@2x.png" : "/static/mobile/asset/icon_hidden@2x.png"}
                 onClick={() => this.setState({showAsset: !showAsset})}/>
          </div>
          <div className="dv2">
            <b>{showAsset && Number(totalAsset.valuationBTC).format({
              number: "property",
              style: {decimalLength: 8}
            }) || "******"}</b>
            <i>≈{showAsset && (lang === "zh-CN" ?
              `${Number(totalAsset.valuationCN).format({number: "legal"})} ¥` :
              `${Number(totalAsset.valuationEN).format({number: "legal"})} $`) || "******"}</i>
          </div>
          <div className="dv3">
            {/*24h提币额度*/}
            <p className="p1">
              <label>{this.intl.get("h5-asset-24hQuota")}:</label>
              <i>{totalAsset.totalQuota} BTC</i>
            </p>
            {/*可用额度*/}
            <p className="p2">
              <label>{this.intl.get("h5-asset-usedAsset")}:</label>
              <i>{Number(totalAsset.usedQuota)} BTC</i>
            </p>
            {/*提币申请*/}
            {totalAsset.totalQuota === 10 ?
              <a className="disable">{this.intl.get("h5-asset-limitApply")}
                <img src={this.$imagesMap.$h5_asset_next}/>
              </a> :
              <NavLink to="/user/identity">{this.intl.get("h5-asset-limitApply")}<img
                src={this.$imagesMap.$h5_asset_next}/></NavLink>}
          </div>
        </div>
        {/*充提菜单*/}
        <div className="menu-div">
          <ul className="menu-ul">
            <li><NavLink to="/wallet/charge"><img
              src="/static/mobile/asset/icon_zc_cb@2x.png"/>{this.intl.get("asset-charge")}</NavLink></li>
            <li><NavLink to="/wallet/withdraw"><img
              src="/static/mobile/asset/icon_zc_tb@2x.png"/>{this.intl.get("asset-withdraw")}</NavLink></li>
          </ul>
        </div>
        {/*钱包列表*/}
        <div className="asset-wallet">
          {/*隐藏小额资产*/}
          <div className="filter">
            <a className="f1" onClick={() => this.setState({hideLittle: !hideLittle})}>
              <img
                src={hideLittle ? "/static/mobile/asset/icon_zc_yincang@2x.png" : "/static/mobile/asset/icon_zc_xianshi@2x.png"}/>
              <i>{this.intl.get("h5-asset-hideLittle")}</i>
            </a>
            {/*总资产*/}
            <a className="f2" onClick={() => this.setState({sort: ++sort % 2})}>
              <i>{this.intl.get("h5-asset-totalAssets")}</i>

              <img src={[this.$imagesMap.$h5_asset_xia, this.$imagesMap.$h5_asset_shang][sort]}/>
              {/*<span>{sort == 0 ?" ↓ ":" ↑ "}</span>*/}
            </a>
          </div>
          {/*列表数据显示*/}
          {result.map((item, index) => {
            return item.coinName.toUpperCase() !== coin ?
              /*普通币种*/
              <div className="wallet-li" key={index}
                   onClick={() => history.push(`/wallet/detail/?currency=${item.coinName}`)}>
                <label>{item.coinName.toUpperCase()}<i>({item.fullName})</i></label>
                <span>{showAsset && Number(item.totalCount).format({
                  number: "property",
                  style: {decimalLength: 8}
                }) || "****"}</span>
              </div>
              :
              /*QBT*/
              <div className="wallet-li" key={index} onClick={() => history.push(`/activity/myqbt`)}>
                <label>{item.coinName.toUpperCase()}<i>({item.fullName})</i></label>
                <span>{showAsset && Number(item.availableCount).format({
                  number: "property",
                  style: {decimalLength: 8}
                }) || "****"}</span>
              </div>
          })}
          {
            hideLittle && result.length === 0 && <div className="hideLittle-info">
              <span>{this.intl.get("asset-hideLittle-hidden")}</span>
            </div>
          }
        </div>
      </div>)
  }
}