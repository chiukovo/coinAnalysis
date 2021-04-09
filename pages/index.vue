<template>
  <div class="container">
    <div style="width: 800px;margin: auto;">
      <img src="~/assets/images/d.jpg" style="width: 800px;"/>
    </div>
    <div>
      <ul style="max-height: 500px;overflow-y: scroll;border: 1px solid;margin: 30px;">
        <li v-for="data in tradingNotice">
          <div>{{ data.name }}</div>
          <div>{{ data.type }}</div>
          <div>{{ data.show }}</div>
          <div>{{ data.time }}</div>
          <hr>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return  {
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

    //trading-notice
    let pageList = await fetch(
      'https://www.binance.com/gateway-api/v1/public/indicator/abnormal-trading-notice/pageList?pageIndex=1&pageSize=100'
    ).then(res => res.json())

    this.formatTradingNotice(pageList.data)
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
        } else if (item.eventType == 'UP_1' || item.eventType == 'DOWN_1') {
          type = item.period
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