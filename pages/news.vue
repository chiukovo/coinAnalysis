<template>
  <div>
    <main class="container mt-3 pb-3">
      <div class="bg-white shadow p-3 mb-5 bg-body rounded">
        <div class="page">
          <div class="page-content">
            <ul class="page-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <li v-for="list in pageList">
                <div class="content">
                  <a href="#" class="news-title">
                    <h3>
                      <span class="newsfocus" v-if="list.hot">精選</span>
                      {{ list.title }}
                    </h3>
                    <span class="newstime">{{ list.date }}
                      <i class="dian"></i>
                    </span>
                  </a>
                  <div class="news-content">
                    <a href="#" class="news-article">
                      {{ list.content }}
                    </a>
                    <div class="news-info">
                      <a href="#" :class="tag.type == '-' ? 'downs' : 'ups'" v-for="tag in JSON.parse(list.tags)">
                        {{ tag.name }} {{ tag.type }}{{ tag['24h'] }}
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <no-ssr>
              <infinite-loading></infinite-loading>
            </no-ssr>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return  {
      pageList: [],
      page: 1,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.finish()
    })
  },
  async fetch() {
    const _this = this
    
    //列表
    this.pageList = await fetch(
      process.env.BASE_URL + 'api/article/list'
    ).then(res => res.json())
  },
  methods: {
    loadMore() {
      let _this = this
      let newPageList = []

      this.page++

      this.$axios.get(process.env.BASE_URL + 'api/article/list?page=' + this.page).then(res => {
        newPageList = res.data

        newPageList.forEach(function(item, i) {
          _this.pageList.push(item)
        })
      })
    }
  }
}
</script>