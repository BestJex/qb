import React, { Component } from "react";
import ExchangeViewBase from "../../../components/ExchangeViewBase";



export default class Terms extends ExchangeViewBase {

  constructor(props) {
    super(props);
    this.addContent = props.headerController.addContent.bind(props.headerController) // 获取头部内容

  }
  async componentDidMount() {
    this.addContent({con: this.intl.get("help-terms")});

  }

  render() {
    const {controller} = this.props;
    const content = this.getContent();
    return <div className={`help-terms ${controller.getQuery("os") === "0" ? "nohead" : ''}`}>
        <p>{this.intl.get("help-termsFirst")}</p>
        <p>{this.intl.get("help-termsSecond")}</p>
        {content.map((v, index) => <div key={index}>
            <h3>{v.title}</h3>
            <ul>
              {v.content.map((v, index) => <li key={index}>
                  {v.title}
                  {v.detail && <ol>
                      {v.detail.map((v, index) => <li key={index}>{v}</li>)}
                    </ol>}
                </li>)}
            </ul>
          </div>)}
      </div>;
  }
  getContent() {
    return [
      {
        title: this.intl.get('help-terms-1'),
        content: [
          {
            title: this.intl.get('help-terms-1-1'),
          },
          {
            title: this.intl.get('help-terms-1-2'),
          }
        ]
      },
      {
        title: this.intl.get('help-terms-2'),
        content: [
          {
            title: this.intl.get('help-terms-2-1')
          },
          {
            title: this.intl.get('help-terms-2-2')
          },
          {
            title: this.intl.get('help-terms-2-3')
          },
          {
            title: this.intl.get('help-terms-2-4')
          },
          {
            title: this.intl.get('help-terms-2-5')
          },
          {
            title: this.intl.get('help-terms-2-6'),
            detail: [
              this.intl.get('help-terms-2-6-1'),
              this.intl.get('help-terms-2-6-2')
            ]
          }
        ]
      },
      {
        title: this.intl.get('help-terms-3'),
        content: [
          {
            title: this.intl.get('help-terms-3-1'),
            detail: [
              this.intl.get('help-terms-3-1-1'),
              this.intl.get('help-terms-3-1-2'),
              this.intl.get('help-terms-3-1-3'),
              this.intl.get('help-terms-3-1-4'),
            ]
          },
          {
            title: this.intl.get('help-terms-3-2'),
          },
          {
            title: this.intl.get('help-terms-3-3'),
            detail: [
              this.intl.get('help-terms-3-3-1'),
              this.intl.get('help-terms-3-3-2'),
              this.intl.get('help-terms-3-3-3'),
            ]
          }
        ]
      },
      {
        title: this.intl.get('help-terms-4'),
        content: [
          {
            title: this.intl.get('help-terms-4-1'),
            detail: [
              this.intl.get('help-terms-4-1-1'),
              this.intl.get('help-terms-4-1-2'),
              this.intl.get('help-terms-4-1-3'),
              this.intl.get('help-terms-4-1-4'),
            ]
          },
          {
            title: this.intl.get('help-terms-4-2'),
          },
          {
            title: this.intl.get('help-terms-4-3'),
          },
          {
            title: this.intl.get('help-terms-4-4'),
          },
          {
            title: this.intl.get('help-terms-4-5'),
          },
          {
            title: this.intl.get('help-terms-4-6'),
          }
        ]
      },
      {
        title: this.intl.get('help-terms-5'),
        content: [
          {
            title: this.intl.get('help-terms-5-1'),
          },
          {
            title: this.intl.get('help-terms-5-2'),
          },
          {
            title: this.intl.get('help-terms-5-3')
          },
        ]
      },
      {
        title: this.intl.get('help-terms-6'),
        content: [
          {
            title: this.intl.get('help-terms-6-1'),
          },
          {
            title: this.intl.get('help-terms-6-2'),
          },
          {
            title: this.intl.get('help-terms-6-3'),
          },
          {
            title: this.intl.get('help-terms-6-4'),
          },
          {
            title: this.intl.get('help-terms-6-5'),
          },
          {
            title: this.intl.get('help-terms-6-6'),
          },
          {
            title: this.intl.get('help-terms-6-7'),
          },
        ]
      },
      {
        title: this.intl.get('help-terms-7'),
        content: [
          {
            title: this.intl.get('help-terms-7-1'),
          },
          {
            title: this.intl.get('help-terms-7-2'),
          },
        ]
      },
      {
        title: this.intl.get('help-terms-8'),
        content: [
          {
            title: this.intl.get('help-terms-8-1'),
          },
        ]
      },
      {
        title: this.intl.get('help-terms-9'),
        content: [
          {
            title: this.intl.get('help-terms-9-1'),
          },
        ]
      },
    ]
  }
}
