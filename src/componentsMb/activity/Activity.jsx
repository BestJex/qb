import React from 'react';
import QRCode from 'qrcode.react';
import exchangeViewBase from '../../components/ExchangeViewBase.jsx';
import downloadIMG from '../../class/lib/DownloadCanvasImage.js'

import './stylus/index.styl'

export default class Activity extends exchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      showSection: 'index' // index、invite、board
    };
    const {controller} = this.props;
    controller.setView(this);
    this.state = Object.assign(this.state, controller.initState);

    this.getInvited = controller.getInvited.bind(controller);
    this.getRankingList = controller.getRankingList.bind(controller);
    this.getQRCode = this.getQRCode.bind(this);
  }

  componentWillMount() {

  }
  componentDidMount() {
    this.getInvited();
    this.getRankingList();
  }

  getQRCode() {
    let canvas = document.querySelector('canvas');
    downloadIMG(canvas, 'png', 'QR Code.png');
  }

  render() {
    let shareAddress = window.location.host + '/home'
    return(
      <div className='activity-wrap'>
        <div className='activity-header'></div>
        <div className='activity-switch'>
          <ul className='clearfix'>
            <li className={this.state.showSection === 'index' ? 'active' : ''} onClick={() => {this.setState({showSection: 'index'})}}>邀请奖励</li>
            <li className={this.state.showSection === 'invite' ? 'active' : ''} onClick={() => {this.setState({showSection: 'invite'})}}>已邀请</li>
            <li className={this.state.showSection === 'board' ? 'active' : ''} onClick={() => {this.setState({showSection: 'board'})}}>排行榜</li>
          </ul>
        </div>
        <div className='activity-content'>
          {this.state.showSection === 'index' && 
          <div className='activity-index'>
            <div className='rule'>
              <p>每邀请一位好友注册QB.com完成：</p>
              <dl>
                <dt>1、注册送币</dt>
                <dd>即日起，新用户注册完成后，可领取{this.state.aw}枚QB。</dd>
                <dt>2、邀请送币</dt>
                <dd>好友注册，您获得{this.state.pr} QB作为奖励，上不封顶~</dd>
              </dl>
              <ul>
                <li>同时，您的好友也将获得<span>{this.state.aw}QB</span>福利</li>
                <li>本次活动共发放<span>{this.state.tv.format()}</span>枚QB，送完即止</li>
                <li>有福同享真哥们，赶紧转发海报邀请吧~</li>
              </ul>
            </div>
            <div className='code'>
              <h1>{Math.floor(this.state.tv / 10000)}万QB欢迎你来拿！</h1>
              <img className='poster' src='../../../static/mobile/activity/img_qb_gywm_erweima@3x.png'/>
              <QRCode value={shareAddress} level="M" size={180} className="qrcode" onClick={this.getQRCode}/>
            </div>
            <div className='introduce'>
              <h2>QB介绍</h2>
              <p>QB是QB.com发行的代币，QB网通过QB与全体支持者共享平台成长利益。</p>
              <p className='note'>QB总量{Math.floor(this.state.tv / 10000)}万枚，定期回购销毁，永不增发。</p>
            </div>
            <div className='value'>
              <h2>QB的价值与用途</h2>
              <p>QB网将通过与全球支持者实现利益共享，方式包括但不限于：</p>
              <div className='feature'>
                <img className='odd' src='../../../static/mobile/activity/img_qb_gywm_one@1x.png'/>
                <img className='even' src='../../../static/mobile/activity/img_qb_gywm_two@1x.png'/>
                <img className='odd' src='../../../static/mobile/activity/img_qb_gywm_three@1x.png'/>
                <img className='even' src='../../../static/mobile/activity/img_qb_gywm_four@1x.png'/>
                <img className='odd' src='../../../static/mobile/activity/img_qb_gywm_five@1x.png'/>
                <img className='even' src='../../../static/mobile/activity/img_qb_gywm_six@1x.png'/>
              </div>
              <p>更多价值将进一步挖掘，敬请期待！</p>
            </div>
            <button className='invite' onClick={() => {alert('邀请跳转还没有做！')}}>一键邀请</button>
          </div>}
          {this.state.showSection === 'invite' && 
          <div className='activity-invite'>
            <div className='ranking'>
              <p>恭喜你获得{this.state.ranking}QB，排名{this.state.award}</p>
            </div>
            <ul>
              {this.state.recordList.map((item, index) => (<li key={index} className='clearfix'>
                <span className='user'>136****1234</span>
                <span className='mount'>+5 QB</span>
              </li>))}
            </ul>
          </div>}
          {this.state.showSection === 'board' && 
          <div className='activity-board'>
            <div className='ranking'>
              <p>恭喜你获得{this.state.ranking}QB，排名{this.state.award}</p>
            </div>
            <ul>
              {this.state.rankingList.map((item, index) => (<li key={index} className='clearfix'>
                {index === 0 && <img src='../../../static/mobile/activity/icon_zc_qb_paiming_one@3x.png'/>}
                {index === 1 && <img src='../../../static/mobile/activity/icon_zc_qb_paiming_two@3x.png'/>}
                {index === 2 && <img src='../../../static/mobile/activity/icon_zc_qb_paiming_three@3x.png'/>}
                {index > 3 && <span className='rank'>4</span>}
                <span className='user'>136****1234</span>
                <span className='mount'>+5 QB</span>
              </li>))}
              {/* <li className='clearfix'>
                <img src='../../../static/mobile/activity/icon_zc_qb_paiming_one@3x.png'/>
                <span className='user'>136****1234</span>
                <span className='mount'>+5 QB</span>
              </li>
              <li className='clearfix'>
                <span className='rank'>5</span>
                <span className='user'>136****1234</span>
                <span className='mount'>+5 QB</span>
              </li> */}
            </ul>
          </div>}
        </div>
      </div>
    );
  }
}