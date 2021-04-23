require('dotenv').config()

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.WEB_NAME,
    htmlAttrs: {
      lang: 'zh-TW'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      { src: '/js/reconnecting-websocket.min.js', type: 'text/javascript' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/style.css',
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/websocket.js', ssr: false },
    { src: '~plugins/global.js', ssr: false },
    { src: '~/plugins/vue-masonry', ssr: false },
    { src: '~plugins/vue-infinite-scroll.js', ssr: false },
    { src: '~plugins/vue-waterfall2.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-lazy-load',
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      fractionCount: 6,
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
  proxy: [
    process.env.API_URL + 'api',
    process.env.API_URL + 'storage',
  ],
  server: {
    port: process.env.PORT || 3000, // default: 3000
    host: process.env.HOST || '0.0.0.0' // default: localhost
  },
  build: {
  }
}
