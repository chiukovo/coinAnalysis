export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'coinAnalysis',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/js/reconnecting-websocket.min.js', type: 'text/javascript' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.scss'
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/websocket.js', ssr: false },
    { src: '~plugins/global.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  modules: [
    '@nuxtjs/axios',
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      symbolSpacing: false
    }],
    ['nuxt-i18n', {
      locales: [
        {
          name: 'en',
          code: 'en',
          iso: 'en',
          file: 'en.js'
        },
        {
          name: 'zh_TW',
          code: 'zh_TW',
          iso: 'zh_TW',
          file: 'zh_TW.js'
        },
        {
          name: 'zh_CN',
          code: 'zh_CN',
          iso: 'zh_CN',
          file: 'zh_CN.js'
        },
      ],
      langDir: 'locales/',
      defaultLocale: 'zh_TW',
    }]
  ],
  build: {
  }
}
