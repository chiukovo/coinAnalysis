<template>
  <div class="container">
    <div>
      <h1 class="title">
        （ ´Д`）ﾉ弌弌弌弌弌弌弌弌弌弌⊃
      </h1>
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

  },
  async fetch() {
    const $this = this
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
      let $this = this
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

        newItem.type = $this.$t(type)

        if (item.volume != null) {
          newItem.show = $this.$options.filters.currency(item.volume) + ' ' + item.baseAsset
        }

        if (item.priceChange != null) {
          newItem.show = (item.priceChange * 100).toFixed(2)

          if (newItem.show > 0) {
            newItem.show = '+' + newItem.show
          }

          newItem.show = newItem.show + '%'
        }

        if (isWebsocket === true) {
          newItem.time = $this.getTime(item.sendTimestamp)
        } else {
          newItem.time = $this.getTime(item.createTimestamp)
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