import React, { Component } from "react";
import exchangeViewBase from "../../../../components/ExchangeViewBase";
import { NavLink } from "react-router-dom";

export default class Wallets extends exchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      hideZero: false,
    };

    let { controller } = this.props;
    this.filter = controller.filte.bind(controller);
    this.rank = controller.rank.bind(controller);
  }

  render() {
    let {wallet, controller} = this.props;
    let {hideZero} = this.state;
    let result = this.filter(wallet, "", null, hideZero);

    return <div className="asset-wallet">
        <div className="filter">
          <img src="/static/mobile/icon_zc_yclyezc@2x.png"/>
          <span>{this.intl.get("asset-hideZero")}</span>
          <span className={this.state.hideZero ? "toggle-btn active" : "toggle-btn"}
                 onClick={()=>{
                   this.setState({hideZero:!this.state.hideZero});
                 }}>
              <i/></span>
        </div>
        {result && result.map((item, index) => {
            return item.coinName.toUpperCase() !== 'QBT' ?
            (<div className="wallet-li"  key={index}>
                <div className="d1">
                    <label><img src={item.coinIcon}/>{item.coinName.toUpperCase()}</label>
                    <NavLink to={{pathname: `/mwallet/detail/`, query: { currency: item.coinName }}}>{this.intl.get("asset-detail")} ></NavLink>
                </div>
                <div className="d2">
                    <p>
                        <span>{this.intl.get("asset-avail")}</span><i>{Number(item.availableCount).format({ number: "property" , style:{ decimalLength: 8}})}</i>
                    </p>
                    <p>
                        <span>{this.intl.get("asset-lock")}</span>
                        <i>{Number(item.frozenCount).format({ number: "property" , style:{ decimalLength: 8}})}</i>
                    </p>
                </div>
                </div>) : (<div className="wallet-li" key={index}>
                    <div className="d1">
                        <label>{item.coinName.toUpperCase()}</label>
                    </div>
                    <div className="d2">
                        <p>
                            <span>{this.intl.get("asset-avail")}</span><i>{Number(item.availableCount).format({ number: "property" , style:{ decimalLength: 8}})}</i>
                        </p>
                        <p>
                            <span>{this.intl.get("asset-lock")}</span>
                            <i>—</i>
                        </p>
                    </div>
                </div>)
        })}
      </div>;
  }
}
