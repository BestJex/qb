import ExchangeViewBase from '../../ExchangeViewBase'
import React, {Component} from "react";
import '../stylus/tradeMarket.styl'


export default class TradeMarket extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: false,
      searchValue: '',
      sortIndex: -1,
      tradeSortImg: '/static/img/trade_rank.svg',
      collectActive: false, // 控制收藏区的active
      marketTableHead : [
        {name: `${this.intl.get('market-markets')}`, sortValue: ''},
        {name: `${this.intl.get('market-lastPrice')}`, sortValue: ['price'], type: 1, sortDefault: 'rise'},
        {name: `${this.intl.get('market-change')}`, sortValue: ['rise'], type: 1, sortDefault: 'rise'},
      ]
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.marketDataHandle = controller.marketDataHandle.bind(controller);
    this.changeMarket = controller.changeMarket.bind(controller);
    this.pairSort = controller.pairSort.bind(controller);
    this.setDealMsg = controller.setDealMsg.bind(controller);
    this.tradePairChange = controller.tradePairChange.bind(controller)
    this.filte = controller.filte.bind(controller) // 筛选
    // this.tradePairSelect = controller.tradePairSelect.bind(controller);
    this.addCollect = controller.addCollect.bind(controller) // 添加收藏
    this.collectMarket = controller.collectMarket.bind(controller) // 点击收藏
  }

  componentDidMount() {
    this.marketDataHandle();
  }

  componentWillMount() {

  }

  pairChange(v) {
    this.tradePairChange(v)
  }
  onInputValue(e) { // 获取输入框的值
    this.setState({
      searchValue: e.target.value
    })
  }
  onEnter(e) { // 搜索回车选中事件
    if (e.nativeEvent.keyCode !== 13) return;
    this.setState({
      searchInput: false
    })
    let result = this.filte(this.state.homeMarketPairData, this.state.searchValue)
    this.tradePairSelect(result)
  }

  render() {
    const {controller} = this.props;
    return (
      <div className='trade-market'>
        <div className='trade-market-list'>
          <ul>
            {controller.token && (<li onClick={this.collectMarket} className={`${this.state.collectActive ? 'trade-market-item-active' : ''}`}>{this.intl.get('market-favorite')}</li>) || null}
            {this.state.marketDataHandle.map((v, index) => {
              return (
                <li
                  className={`trade-market-item${this.state.market.toUpperCase() === v.toUpperCase() ? '-active' : ''}`}
                  key={index} onClick={this.changeMarket.bind(this, v)}>
                  {v.toUpperCase()}
                </li>
              )
            })}
          </ul>
          <div>
            <img src="/static/img/search_bai.svg" alt="" className={this.state.searchInput ? 'hide' : ''} onClick={() => {this.setState({searchInput: true, searchValue: ''})}}/>
            <p className={this.state.searchInput ? '' : 'hide'}>
              <input type="text"
                     onChange={this.onInputValue.bind(this)}
                     onKeyDown={this.onEnter.bind(this)}
              />
              <img src="/static/img/guanbi_bai.svg" alt="" onClick={() => {this.setState({searchInput: false, searchValue: ''})}}/>
            </p>
          </div>
        </div>

        <table className='trade-market-table'>
          <thead>
            <tr>
              {this.state.marketTableHead.map((v, index) => {
                return (<td onClick={this.pairSort.bind(this, v, index)} key={index} className={`${v.sortValue ? 'sort-img-td' : ''}`}>
                  {v.name}
                  <img src={this.state.sortIndex === index ? this.state.tradeSortImg : "/static/img/trade_rank.svg"} alt=""
                       className={`${v.sortValue ? '' : 'hide'}`}/>
                </td>)
              })}
            </tr>
          </thead>
          <tbody>
          {this.filte(this.state.homeMarketPairData, this.state.searchValue).map((v, index) => {
            return (
              <tr key={index} className={`pair-items${this.state.tradePair === v.tradePairName ? '-active' : ''}`}
                  onClick={this.pairChange.bind(this, v)}>
                <td>{v.tradePairName.toUpperCase()}</td>
                <td>{this.state.unitsType === 'CNY' && Number(v.priceCN).format({number:'legal',style:{name:'cny'}}) || (this.state.unitsType === 'USD' && Number(v.priceEN).format({number:'legal',style:{name:'usd'}}) || Number(v.price).format({number:'digital'})) || 0 }</td>
                <td>{Number(v.rise).toPercent()}</td>
                {controller.token && (<td onClick={value => this.addCollect(v, index)} className="img-td">
                  <img src={v.isFavorite ? "/static/img/trade_star.svg" :  "/static/img/trade_star_select.svg"} alt=""/>
                </td>) || null}
              </tr>
            )
          })}
          </tbody>

        </table>
      </div>
    )
  }
}