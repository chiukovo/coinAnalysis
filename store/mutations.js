import Vue from 'vue'

export default {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SOCKET_ONOPEN(state, event) {
    Vue.prototype.$socket = event.currentTarget
    state.socket.isConnected = true

    if (state.socket.reconnecting) {
      console.log('重新連線成功!')
      state.socket.reconnecting = false
      location.reload()
    }
  },
  SOCKET_ONCLOSE(state, event) {
    state.socket.isConnected = false
  },
  SOCKET_ONERROR(state, event) {
    state.socket.reconnecting = true
    console.log('連線異常, 重新連線中...')
    console.error('error network')
  },
  SOCKET_ONMESSAGE(state, message) {
    state.socket.message = message
  },
  SOCKET_RECONNECT(state, count) {
    console.info('reconnecting')
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true
  },
}