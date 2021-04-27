<template>
  <div>
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