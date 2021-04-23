<template>
  <div>
    <header class="shadow">
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
            LOGO
          </div>
          <ul class="nav">
            <li class="nav-item">
              <a href="/" class="nav-link" :class="path == '/' ? 'active' : ''">市場異動</a>
            </li>
            <li class="nav-item">
              <a href="/news" class="nav-link" :class="path == '/news' ? 'active' : ''">市場快訊</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <Nuxt />
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
  }
}
</script>