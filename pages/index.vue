<template>
  <div>
    <no-ssr>
      <main class="container mt-3 pb-3">
        <div class="bg-white shadow p-3 mb-5 bg-body rounded">
          <div v-masonry="containerId" transition-duration="0.3s" item-selector=".item" class="masonry-container row" style="position: relative; height: 1044px;">
            <div v-masonry-tile class="col-sm-6 col-lg-4 mb-4 item" v-for="list in pageList">
              <div class="card market-ticker">
                <div class="card-body">
                  <div class="card-title">
                    <div class="title-left">
                      <div class="title-icon"><img :src="list.logo_path"></div>
                      <div class="title-name">{{ list.name }}</div>
                    </div>
                    <small class="card-title-right">
                      <div class="text-success" v-if="list.priceChangePercent > 0">+{{ list.priceChangePercent }}%</div>
                      <div class="text-danger" v-else>{{ list.priceChangePercent }}%</div>
                    </small>
                  </div>
                  <h4>${{ list.lastPrice }}</h4>
                  <ul class="market-ticker-24info">
                    <li><label>24小時最高</label><span>${{ list.highPrice }}</span></li>
                    <li><label>24小時最低</label><span>${{ list.lowPrice }}</span></li>
                  </ul>
                  <ul class="market-ticker-last">
                    <li v-for="action in list.action">
                      <div class="time">{{ action.time }}</div>
                      <div class="detail">{{ action.type }}</div>
                      <div class="number" :class="'text-' + action.color">
                        <span>{{ action.show }}</span>
                        <i :class="'bg-' + action.color" v-if="action.icon_url != ''">
                          <img :src="require(`~/assets/images/${action.icon_url}`)">
                        </i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </no-ssr>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return  {
      nowDay: '',
      nowTime: '',
      containerId: 'main',
      pageList: [],
      tradingNotice: [],
    }
  },
  mounted() {
    const _this = this
            
    this.$nextTick(() => {
      //this.$nuxt.$loading.finish()
    })

    this.$list.onopen = function(e) {
      if (_this.$store.state.socket.reconnecting) {
        _this.$store.state.socket.reconnecting = false
        location.reload()
      }

      this.send('{"method":"SUBSCRIBE","params":["!ticker@arr@3000ms"],"id":1}')
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
        target.data.forEach(function(item, i) {
          _this.pageList.forEach(function(list, key) {
            if (item.s == list.name + 'USDT') {
              list.priceChangePercent = item.P.replace(/0+$/, '')
              list.lastPrice = item.c.replace(/0+$/, '')
              list.highPrice = item.h.replace(/0+$/, '')
              list.lowPrice = item.l.replace(/0+$/, '')
            }
          })
        })
      }
    }

    this.$list.onerror = function(e) {
      _this.$store.state.socket.reconnecting = true
      console.log('連線異常, 重新連線中...')
    }
  },
  updated() {
    this.goResize()
  },
  async fetch() {
    const _this = this
    let notice = []

    //列表
    this.pageList = await fetch(
      process.env.BASE_URL + 'api/base/list'
    ).then(res => res.json())

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
    goResize() {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry('main')
      }
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

        _this.pageList = _this.pageList.map(list => {
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
        })
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