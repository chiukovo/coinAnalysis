<template>
  <div class="container">
    <div>
      <h1 class="title">
        coinAnalysis
      </h1>
      <div class="links">

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted() {
  },
  computed: {
    websocketConnected() {
      return this.$store.state.socket.isConnected
    },
    onMessage() {
      return this.$store.state.socket.message
    }
  },
  watch: {
    onMessage(data) {
      let target = JSON.parse(data.data)
      console.log(target)
    }
  }
}
</script>