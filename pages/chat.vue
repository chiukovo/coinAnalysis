<template>
  <div>
    <div id="tlkio" data-channel="coincoin543" data-theme="theme--minimal" data-custom-css="https://coincoin543.com/css/chat.css" style="height: 350px;"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const _this = this

    this.$nextTick(() => {
      this.$nuxt.$loading.finish()
    })
  }
}
</script>

<style>
  #tlkio {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 10px;
    border: 1px solid;
  }
</style>