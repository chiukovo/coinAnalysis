<template>
  <div class="container">
    <div class="row">
      <div class="col-sm" v-for="list in pageList">
        <div class="card" style="width: 18rem;">
          <img :src="list.logo_path" style="width: 50px;" alt="" title="" v-lazy-load>
          <div class="card-body">
            <h5 class="card-title">{{ list.name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ list.fullName }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return  {
      pageList: [],
      tradingNotice: [],
    }
  },
  mounted() {
    const _this = this

    this.$list.onopen = function(e) {
      if (_this.$store.state.socket.reconnecting) {
        _this.$store.state.socket.reconnecting = false
        location.reload()
      }

      this.send('{"method":"SUBSCRIBE","params":["!miniTicker@arr@3000ms"],"id":1}')
    }

    this.$list.onmessage = function(msg) {
      /*{
        "e": "24hrMiniTicker",  // 事件类型
        "E": 123456789,         // 事件时间
        "s": "BNBBTC",          // 交易对
        "c": "0.0025",          // 最新成交价格
        "o": "0.0010",          // 24小时前开始第一笔成交价格
        "h": "0.0025",          // 24小时内最高成交价
        "l": "0.0010",          // 24小时内最低成交价
        "v": "10000",           // 成交量
        "q": "18"               // 成交额
      }*/
      let target = JSON.parse(msg.data)
      if (typeof target.data != 'undefined') {

      }
    }

    this.$list.onerror = function(e) {
      _this.$store.state.socket.reconnecting = true
      console.log('連線異常, 重新連線中...')
    }
  },
  async fetch() {
    const _this = this

    //列表
    this.pageList = await fetch(
      process.env.BASE_URL + 'api/base/list'
    ).then(res => res.json())

    //trading-notice
    let notice = await fetch(
      'https://www.binance.com/gateway-api/v1/public/indicator/abnormal-trading-notice/pageList?pageIndex=1&pageSize=100'
    ).then(res => res.json())

    this.formatTradingNotice(notice.data)
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
    formatTradingNotice(source, isWebsocket) {
      let _this = this
      let type = ''
      let show = ''
      let result = []
      let newItem = {}

      source.forEach(function(item, i) {
        newItem = {}
        newItem.name = item.baseAsset + '/' + item.quotaAsset

        if (item.eventType == 'UP_BREAKTHROUGH' || item.eventType == 'DOWN_BREAKTHROUGH') {
          type = item.eventType + '_' + item.period
        } else if (item.eventType.indexOf('UP_') > -1 || item.eventType.indexOf('DOWN_') > -1) {
          type = item.period

          if (type == 'DAY_1') {
            console.log(item)
          }
        } else {
          type = item.eventType
        }

        newItem.type = _this.$t(type)

        if (item.volume != null) {
          newItem.show = _this.$options.filters.currency(item.volume) + ' ' + item.baseAsset
        }

        if (item.priceChange != null) {
          newItem.show = (item.priceChange * 100).toFixed(2)

          if (newItem.show > 0) {
            newItem.show = '+' + newItem.show
          }

          newItem.show = newItem.show + '%'
        }

        if (isWebsocket === true) {
          newItem.time = _this.getTime(item.sendTimestamp)
        } else {
          newItem.time = _this.getTime(item.createTimestamp)
        }
          
        result.push(newItem)
      })

      if (isWebsocket === true) {
        this.tradingNotice.unshift(newItem)
      } else {
        this.tradingNotice = result
      }

      let count = this.tradingNotice.length

      if (count > 100) {
        this.tradingNotice.splice(-1, count - 100)
      }
    },
    getTime(timestamp) {
      const date = new Date(timestamp)
      const hours = date.getHours()
      const minutes = "0" + date.getMinutes()
      const seconds = "0" + date.getSeconds()

      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    }
  }
}
</script>