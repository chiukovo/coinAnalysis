<template>
  <div>
    <div id="tlkio" data-channel="coincoin543" data-theme="theme--minimal" data-custom-css="https://coincoin543.com/css/chat.css"></div><script async src="http://tlk.io/embed.js" type="text/javascript"></script>
  </div>
</template>

<script>
export default {
  mounted() {
    const _this = this
    this.$nextTick(() => {
      this.$nuxt.$loading.finish()
    })
  },
}
</script>