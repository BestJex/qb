import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../../common/component/Button";
import exchangeViewBase from "../../ExchangeViewBase";

export default class ToTrade extends exchangeViewBase {
  constructor(props) {
    super();
  }
  render() {
    let { pairArr } = this.props;
    return (<div className="to-trade clearfix">
      <span className="title">{this.intl.get("asset-toTrade")}</span>
      {pairArr.map((v, index) => (
        <NavLink
          to={{
            pathname: `/trade`,
            query: { id: v.id }
          }}
          key={index}
        >
          <Button
            title={v.name}
            type="base"
            key={index}
          />
        </NavLink>
      ))}
    </div>)
  }
}
