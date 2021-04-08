import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

export default ({ store }, inject) => {
  const url = 'wss://bstream.binance.com:9443/stream?streams=abnormaltradingnotices'

  Vue.use(VueNativeSock, url, {
    store: store,
    reconnection: true,
    reconnectionDelay: 1000
  })
}