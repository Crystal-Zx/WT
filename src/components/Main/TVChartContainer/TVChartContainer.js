import * as React from 'react';
import './TVChartContainer.css';
import {
  widget
} from '../../../charting_library/charting_library.min'
import datafeed from './datafees'
import socket from '../../../socket'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends React.PureComponent {
  static defaultProps = {
    debug: true,
    symbol: 'BTCUSD',
    // datafeed: new datafeed(this),
    interval: localStorage.getItem('tradingview.resolution') || '15',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    datafeedUrl: "ws://47.113.231.12:5885/",
    // chartsStorageUrl: 'https://saveload.tradingview.com',
    disabled_features: [
      "header_symbol_search",
      "header_saveload",
      "header_screenshot",
      "header_chart_type",
      "header_compare",
      "header_undo_redo",
      "timeframes_toolbar",
      "volume_force_overlay",
      "header_resolutions",
    ],
    enabled_features: [],  
    clientId: 'test',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true
  };

  tvWidget = null;
  
  init = () => {
    var resolution = localStorage.getItem('tradingview.resolution') || '5';
    var chartType = (localStorage.getItem('tradingview.chartType') || '1')*1;
    if (!this.tvWidget) {
      this.tvWidget = new widget({
        autosize: true,
        symbol: this.props.symbol,  // 图表的初始商品
        interval: resolution,  // 图表的初始周期
        container_id: 'tv_chart_container',
        datafeed: new datafeed(this),
        library_path: '/charting_library/',  // static文件夹的路径              
        enabled_features: [],  // 在默认情况下启用/禁用（disabled_features）名称的数组
        timezone: 'Asia/Shanghai',
        // custom_css_url: './css/tradingview_'+skin+'.css',  // 本地css样式，放在public下
        locale: getLanguageFromURL() || 'en',  // 图表的本地化处理
        debug: false,
        disabled_features: [
            "header_symbol_search",
            "header_saveload",
            "header_screenshot",
            "header_chart_type",
            "header_compare",
            "header_undo_redo",
            "timeframes_toolbar",
            "volume_force_overlay",
            "header_resolutions",
        ]
      })
    }
    const thats = this.tvWidget;
    console.log(thats)

    thats.onChartReady(function () {
      console.log("=============> onChartReady")
      createStudy();
      createButton(buttons);
      thats.chart().setChartType(chartType);
      toggleStudy(chartType);
    })

    var buttons = [{
        title: 'Time',
        resolution: '1',
        chartType: 3
      },
      {
        title: '1min',
        resolution: '1',
        chartType: 1
      },
      {
        title: '5min',
        resolution: '5',
        chartType: 1
      },
      {
        title: '15min',
        resolution: '15',
        chartType: 1
      },
      {
        title: '30min',
        resolution: '30',
        chartType: 1
      },
      {
        title: '1hour',
        resolution: '60',
        chartType: 1
      },
      {
        title: '1day',
        resolution: '1D',
        chartType: 1
      },
      {
        title: '1week',
        resolution: '1W',
        chartType: 1
      },
      {
        title: '1month',
        resolution: '1M',
        chartType: 1
      },
    ];
    var studies = [];

    function createButton(buttons) {
      for (var i = 0; i < buttons.length; i++) {
        (function (button) {
          thats.createButton()
            .attr('title', button.title).addClass("mydate")
            .text(button.title)
            .on('click', function (e) {
              if (this.parentNode.className.search('active') > -1) {
                return false;
              }
              localStorage.setItem('tradingview.resolution', button.resolution);
              localStorage.setItem('tradingview.chartType', button.chartType);
              var $active = this.parentNode.parentNode.querySelector('.active');
              $active.className = $active.className.replace(/(\sactive|active\s)/, '');
              this.parentNode.className += ' active';
              thats.chart().setResolution(button.resolution, function onReadyCallback() {});
              if (button.chartType != thats.chart().chartType()) {
                thats.chart().setChartType(button.chartType);
                toggleStudy(button.chartType);
              }
            }).parent().addClass('my-group' + (button.resolution == resolution && button.chartType == chartType ? ' active' : ''));
        })(buttons[i]);
      }
    }

    function createStudy() {
      var id = thats.chart().createStudy('Moving Average', false, false, [5], null, {
        'Plot.color': 'rgb(150, 95, 196)'
      });
      studies.push(id);
      id = thats.chart().createStudy('Moving Average', false, false, [10], null, {
        'Plot.color': 'rgb(116,149,187)'
      });
      studies.push(id);
      id = thats.chart().createStudy('Moving Average', false, false, [20], null, {
        "plot.color": "rgb(58,113,74)"
      });
      studies.push(id);
      id = thats.chart().createStudy('Moving Average', false, false, [30], null, {
        "plot.color": "rgb(118,32,99)"
      });
      studies.push(id);
    }

    function toggleStudy(chartType) {
      var state = chartType == 3 ? 0 : 1;
      for (var i = 0; i < studies.length; i++) {
        thats.chart().getStudyById(studies[i]).setVisible(state);
      }
    }
  }


  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}