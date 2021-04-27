<template>
  <main class="container pb-3">
    <div class="page shadow rounded">
      <div class="page-article">
        <h1 class="page-title">
          {{ data.title }}
        </h1>
        <div class="page-info">
          <span class="page-info-time">
            {{ data.date }}
          </span>
          <div class="page-info-wrap">
            <div class="news-info" v-if="!data.noTag">
              <a href="#" v-for="tag in JSON.parse(data.tags)" :class="tag.type == '-' ? 'downs' : 'ups'">
                {{ tag.name }} {{ tag.type }}{{ tag['24h'] }}
              </a>
            </div>
          </div>
        </div>
        <!-- 參考: https://codepen.io/chumini/pen/qdEGrZ -->
        <div class="page-content">
          <div class="page-abstract" v-html="data.msg" v-if="!data.noTag"></div>
          <div class="page-content-article">
            {{ data.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="page-pagation mt-3 mb-5">
      <div class="page-pagation-wrap" v-if="before">
        <a :href="'/news/detail?id=' + before.id" target="_blank">
          <h4 class="page-pagation-info">上一篇</h4>
          <p class="page-pagation-title">{{ before.title }}</p>
        </a>
      </div>
      <div class="page-pagation-wrap page-pagation-back">
        <a href="/news">
          <h4 class="page-pagation-info">回列表</h4>
          <span class="text-secondary">Back</span>
        </a>
      </div>
      <div class="page-pagation-wrap" v-if="next">
        <a :href="'/news/detail?id=' + next.id" target="_blank">
          <h4 class="page-pagation-info">下一篇</h4>
          <p class="page-pagation-title">{{ next.title }}</p>
        </a>
      </div>
    </div>
  </main>
</template>

<script>

export default {
  data() {
    return  {
      id: 1,
      title: process.env.WEB_NAME,
      data: {},
      next: {},
      before: {},
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.finish()
    })
  },
  async fetch() {
    let id = this.$route.query.id

    if (typeof id == 'undefined') {
      id = 1
    }

    this.id = id

    let source = await fetch(
      process.env.BASE_URL + 'api/article/detail?id=' + this.id
    ).then(res => res.json())
    

    this.data = source.data
    this.next = source.next
    this.before = source.before

    this.title = process.env.WEB_NAME + ' | ' + this.data.title
  },
  methods: {
  }
}
</script>