<template>
  <main class="container pb-3" :style="checkChartHeight()">
    <div class="tradingview-widget-container w100">
      <!-- <div class="row mb-3">
        <div class="col">
          <div class="market">
            <div class="market-content">
              <ul class="market-ticker-last">
                <li>
                  <div class="content">
                    <div href="#" class="market-time">
                      <span class="time">16:39:10
                        <i class="dian"></i>
                      </span>
                    </div>
                    <div class="detail">特大單賣出</div>
                    <div class="number text-danger">21500 REN</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
      <div id="tradingview" class="w100"></div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return  {
      base: {
        priceChangePercent: 0,
        lastPrice: 0,
        highPrice: 0,
        lowPrice: 0,
      },
      tradingNotice: [],
      title: process.env.WEB_NAME
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    const _this = this

    this.$list.onopen = function(e) {
      if (_this.$store.state.socket.reconnecting) {
        _this.$store.state.socket.reconnecting = false
        location.reload()
      }

      let params = _this.code.toLowerCase()

      this.send('{"method":"SUBSCRIBE","params":["' + params + '@ticker"],"id":1}')
    }

    this.$list.onmessage = function(msg) {
      /*{
        "e": "24hrTicker",  // 事件类型
        "E": 123456789,     // 事件时间
        "s": "BNBBTC",      // 交易对
        "p": "0.0015",      // 24小时价格变化
        "P": "250.00",      // 24小时价格变化(百分比)
        "w": "0.0018",      // 平均价格
        "x": "0.0009",      // 整整24小时之前，向前数的最后一次成交价格
        "c": "0.0025",      // 最新成交价格
        "Q": "10",          // 最新成交交易的成交量
        "b": "0.0024",      // 目前最高买单价
        "B": "10",          // 目前最高买单价的挂单量
        "a": "0.0026",      // 目前最低卖单价
        "A": "100",         // 目前最低卖单价的挂单量
        "o": "0.0010",      // 整整24小时前，向后数的第一次成交价格
        "h": "0.0025",      // 24小时内最高成交价
        "l": "0.0010",      // 24小时内最低成交价
        "v": "10000",       // 24小时内成交量
        "q": "18",          // 24小时内成交额
        "O": 0,             // 统计开始时间
        "C": 86400000,      // 统计结束时间
        "F": 0,             // 24小时内第一笔成交交易ID
        "L": 18150,         // 24小时内最后一笔成交交易ID
        "n": 18151          // 24小时内成交数
      }*/
      let target = JSON.parse(msg.data)

      if (typeof target.data != 'undefined') {
        _this.base.priceChangePercent = target.data.P.replace(/0+$/, '')
        _this.base.lastPrice = target.data.c.replace(/0+$/, '')

        let lastPriceLength = _this.base.lastPrice.toString().split(".")[1].length
        
        if (lastPriceLength <= 1) {
          _this.base.lastPrice = parseFloat(_this.base.lastPrice).toFixed(2)
        }

        _this.base.highPrice = target.data.h.replace(/0+$/, '')
        _this.base.lowPrice = target.data.l.replace(/0+$/, '')

        _this.title = _this.base.lastPrice + ' | ' + _this.code + ' | ' + process.env.WEB_NAME
      }
    }

    this.$list.onerror = function(e) {
      _this.$store.state.socket.reconnecting = true
      console.log('連線異常, 重新連線中...')
    }

    new TradingView.widget(
      {
        "autosize": true,
        "symbol": "BINANCE:" + this.code,
        "interval": "D",
        "timezone": "Asia/Taipei",
        "theme": "light",
        "style": "1",
        "locale": "zh_TW",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": true,
        "container_id": "tradingview"
      }
    )

    this.$nextTick(() => {
      this.$nuxt.$loading.finish()
    })
  },
  async asyncData({ params }) {
    const code = params.code

    return { code }
  },
  async fetch() {
    const _this = this
    let notice = []

    for (let index = 2; index >= 1; index--) {

      //trading-notice
      notice = await fetch(
        'https://www.binance.com/gateway-api/v1/public/indicator/abnormal-trading-notice/pageList?pageIndex=' + index + '&pageSize=100'
      ).then(res => res.json())

      this.formatTradingNotice(notice.data)
    }
  },
  computed: {
    websocketConnected() {
      return this.$store.state.socket.isConnected
    },
    onMessage() {
      return this.$store.state.socket.message
    }
  },
  watch: {
    onMessage(data) {
      let target = JSON.parse(data.data)
      this.formatTradingNotice([target.data], true)
    }
  },
  methods: {
    checkChartHeight() {
      return 'height: calc(100% - 130px)'
    },
    formatTradingNotice(source, isWebsocket) {
      let _this = this
      let type = ''
      let show = ''
      let result = []
      let newItem = {}
      let countAction

      source.forEach(function(item, i) {
        newItem = {}
        newItem.name = item.baseAsset + '/' + item.quotaAsset

        if (item.eventType == 'UP_BREAKTHROUGH' || item.eventType == 'DOWN_BREAKTHROUGH') {
          type = item.eventType + '_' + item.period
        } else if (item.eventType.indexOf('UP_') > -1 || item.eventType.indexOf('DOWN_') > -1) {
          type = item.period
        } else {
          type = item.eventType
        }

        newItem.color = _this.getColor(item.eventType)

        newItem.type = _this.$t(type)

        if (item.volume != null) {
          newItem.show = item.volume + ' ' + item.baseAsset
          newItem.icon_url = _this.getIconUrl(type, item.volume)
        }

        if (item.priceChange != null) {
          newItem.show = (item.priceChange * 100).toFixed(2)

          if (newItem.show > 0) {
            newItem.show = '+' + newItem.show
          }

          newItem.show = newItem.show + '%'
          newItem.icon_url = _this.getIconUrl(type, item.priceChange)
        }

        if (isWebsocket === true) {
          newItem.time = _this.getTime(item.sendTimestamp)
        } else {
          newItem.time = _this.getTime(item.createTimestamp)
        }
          
        result.push(newItem)

        /*_this.pageList = _this.pageList.map(list => {
          if (list.name + '/USDT' == newItem.name) {
            list.action.unshift(newItem)
          }

          countAction = list.action.length

          if (countAction > 5) {
            list.action.splice(-1, countAction - 1)
          }

          list.action.sort(function (a, b) {
            return new Date('2012-06-08 ' + b.time).getTime() - new Date('2012-06-08 ' + a.time).getTime();
          })

          return list
        })*/
      })
    },
    getTime(timestamp) {
      const date = new Date(timestamp)
      const hours = date.getHours()
      const minutes = "0" + date.getMinutes()
      const seconds = "0" + date.getSeconds()

      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    },
    getColor(type) {
      if (type.indexOf('UP') > -1 || type.indexOf('BUY') > -1 || type.indexOf('RISE') > -1 || type.indexOf('HIGH') > -1) {
        return 'success'
      }

      if (type.indexOf('DOWN') > -1 || type.indexOf('SELL') > -1 || type.indexOf('BACK') > -1 || type.indexOf('LOW') > -1) {
        return 'danger'
      }

      return ''
    },
    getIconUrl(type, num) {
      if (type.indexOf('BLOCK_TRADES') > -1) {
        return 'icon_big.svg'
      }

      if (type.indexOf('MINUTE_') > -1 || type.indexOf('HOUR_') > -1 || type.indexOf('DAY_') > -1) {
        if (num > 0) {
          return 'icon_up.svg'
        } else {
          return 'icon_down.svg'
        }
      }

      if (type.indexOf('DROP_BACK') > -1) {
        return 'icon_dropback.svg'
      }

      if (type.indexOf('RISE_AGAIN') > -1) {
        return 'icon_riseagain.svg'
      }

      return ''
    }
  }
}
</script>