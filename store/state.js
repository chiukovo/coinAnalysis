export default () => ({
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
    reconnecting: false,
  },
  locales: ['en', 'zh_TW', 'zh_CN'],
  locale: 'zh_TW'
})