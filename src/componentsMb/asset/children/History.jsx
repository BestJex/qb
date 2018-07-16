import React, { Component } from "react";
import exchangeViewBase from "../../ExchangeViewBase";
import Pagination from "../../../common/component/Pagination";
import { NavLink } from "react-router-dom";

import "../style/history.styl";

export default class History extends exchangeViewBase {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    controller.setView(this);
    // 生成充提币类型及进度的状态码映射表；
    this.staticData = {
      orderType: {
        1: this.intl.get("deposit"),
        15000: this.intl.get("asset-withdraw")
      },
      status: {
        0: this.intl.get("pending"),
        1: this.intl.get("passed"),
        2: this.intl.get("failed"),
        3: this.intl.get("cancel")
      }
    };

    this.name = "history";
    this.state = {
      page: 1,
      orderType: 1,    // 充1 2
    };

    let { wallList, assetHistory } = controller.initState;
    this.state = Object.assign(this.state, {
      wallList,
      assetHistory
    });
    //绑定方法
    this.getHistory = controller.getHistory.bind(controller);
  }

  async componentWillMount() {
    //路由参数
    let type = this.props.location.query && this.props.location.query.type;
    if(type===1 || type===2){
        this.setState({orderType: type});
    }
    //
    await this.getHistory({
      page: 0,
      pageSize: 20,
      coinId: -1,
      coinName: -1,
      orderType: 1,
      orderStatus: -1,
      startTime: parseInt((new Date() - 604800000) / 1000),
      endTime: parseInt((new Date() - 0) / 1000)
    });
  }

  search(){
    let {orderType} = this.state;
    this.getHistory({
      page: 0,
      pageSize: 20,
      coinId: -1,
      coinName: -1,
      orderType: orderType,
      orderStatus: -1,
      startTime: parseInt((new Date() - 604800000) / 1000),
      endTime: parseInt((new Date() - 0) / 1000)
    });
  }

  render() {
    let {total, orderList} = this.state.assetHistory;
    return (
      <div className="hist">
          <div className="nav">
              <NavLink to="/mwallet" className="left">&lt; 返回</NavLink>
              <h3>资产记录</h3>
          </div>
          <ul className="tab-ul">
            <li className={this.state.orderType===1 ? "active" : ""}
                onClick={()=>{
                  this.setState({orderType:1},()=>{
                      this.search();
                  });
                }}>
                充币记录</li>
            <li className={this.state.orderType===2 ? "active": ""}
                onClick={()=>{
                  this.setState({orderType:2},()=>{
                      this.search();
                  });
                }}>
                提币记录</li>
          </ul>
          {orderList && orderList.map(
                  ({
                      orderTime,
                      coinName,
                      coinIcon,
                      count,
                      verifyCount, //确认数
                      doneCount, //已确认数
                      orderStatus,
                      orderType,
                  }, index) => (
                    <div className="hist-li">
                      <div className="d1">
                          <label><img src={coinIcon} alt="" />{coinName.toUpperCase()}</label>
                          <span className={orderStatus===1 ? "success" : "fail"}>{this.staticData.status[orderStatus]}</span>
                      </div>
                      <div className="d2">
                          <p><span>数量</span><i>{count}</i></p>
                          <p><span>确认数</span>
                              {orderType===1 && <i>{doneCount}/{verifyCount}</i>}
                              {orderType===2 && <i>-</i>}
                          </p>
                          <p><span>时间</span><i>{orderTime.toDate("yyyy-MM-dd")} {orderTime.toDate("hh:mm:ss")}</i></p>
                      </div>
                  </div>))}
          {(!orderList || orderList.length<=0) && <div className="kong">{this.intl.get("noRecords")}</div>}
          <Pagination
              total={total}
              pageSize={20}
              showTotal={true}
              onChange={page => {
                  this.setState({page:page},()=>{
                      this.search();
                  });
              }}
              showQuickJumper={true}
              currentPage={this.state.page}
          />
      </div>
    );
  }
}
