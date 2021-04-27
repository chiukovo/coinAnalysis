<template>
  <div class="w100">
    <div class="gotop" @click="goTop()">
      <div class="gotop-wrap shadow">
        <div class="gotop-arrow"></div>
      </div>
    </div>
    <header class="shadow fixed-top">
      <div class="bar">
        <div class="container px-4">
          <span>GMT+8</span>
          <span class="bar__date">{{ nowDay }}</span>
          <span class="bar__time">{{ nowTime }}</span>
        </div>
      </div>
      <nav class="navbar">
        <div class="container px-4">
          <div cldivss="navbar-brand">
            <a href="/">
              <img src="~assets/images/logo.svg" alt="幣幣動態" style="width: 100px">
            </a>
          </div>
          <ul class="nav">
            <li class="nav-item">
              <a href="/" class="nav-link" :class="path.indexOf('news') == '-1' ? 'active' : ''">市場異動</a>
            </li>
            <li class="nav-item">
              <a href="/news" class="nav-link" :class="path.indexOf('news') > 0 ? 'active' : ''">市場快訊</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <Nuxt />
    <footer>
      <p class="copyright">Copyright © 2021 幣幣 保留一切權利。</p>
      <p>免責聲明：幣幣動態作為開放的資訊分享平台，與幣幣動態平台立場無關，且不構成任何投資理財建議。</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return  {
      nowDay: '',
      nowTime: '',
      path: '',
    }
  },
  mounted() {
    this.path = this.$nuxt.$route.path
    this.nowTimes()
  },
  methods: {
    timeFormate(timeStamp) {
      let newdate = new Date(timeStamp)
      let week = ['日', '一', '二', '三', '四', '五', '六']
      
      let year  = newdate.getFullYear()
      let month = newdate.getMonth() + 1 < 10? "0" + (newdate.getMonth() + 1): newdate.getMonth() + 1
      let date  = newdate.getDate() < 10? "0" + newdate.getDate(): newdate.getDate()
      let hh    = newdate.getHours() < 10? "0" + newdate.getHours(): newdate.getHours()
      let mm    = newdate.getMinutes() < 10? "0" + newdate.getMinutes(): newdate.getMinutes()
      let ss    = newdate.getSeconds() < 10? "0" + newdate.getSeconds(): newdate.getSeconds()

      this.nowTime = hh+":"+mm + ":" + ss
      this.nowDay = year + "年" + month + "月" + date +"日"
    },
    // 定時器函數
    nowTimes() {      
      let self = this
      self.timeFormate(new Date())
      setInterval(function(){
        self.timeFormate(new Date())
      }, 1000)
    },
    goTop() {
      window.scrollTo({top: 0})
    }
  }
}
</script>
<style>
html, body, #__nuxt, #__layout, .w100 {
  width: 100%;
  height: 100%;
}
</style>