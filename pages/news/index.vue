<template>
  <div>
    <main class="container pb-3">
      <div class="page shadow rounded">
        <div class="page-list">.
          <div class="page-date">
            <no-ssr>
              <v-date-picker class="inline-block h-full" v-model="date" @dayclick="onDayClick">
                <template v-slot="{ inputValue, togglePopover }">
                  <div class="flex items-center">
                    <div class="calendar" @click="togglePopover()">
                      <span class="month">{{ m }}月</span>
                      <span class="day">{{ d }}</span>
                    </div>
                  </div>
                </template>
              </v-date-picker>
            </no-ssr>

            <div class="info">
              <span class="current">快訊</span>
              <span class="week">{{ TW_day }}</span>
            </div>
          </div>
          <div class="page-content">
            <ul class="page-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <li v-for="list in pageList">
                <div class="content">
                  <a :href="'/news/detail?id=' + list.id" class="news-title">
                    <h3>
                      <span class="newsfocus" v-if="list.hot">精選</span>
                      {{ list.title }}
                    </h3>
                    <span class="newstime">{{ list.date }}
                      <i class="dian"></i>
                    </span>
                  </a>
                  <div class="news-content">
                    <a :href="'/news/detail?id=' + list.id" class="news-article">
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
              <infinite-loading v-if="!isEmpty"></infinite-loading>
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
      date: '',
      m: '',
      d: '',
      TW_day: '',
      pageList: [],
      isEmpty: false,
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
    let source = []
    let date = this.$route.query.date
    
    if (typeof date == 'undefined') {
      date = new Date().toISOString().slice(0, 10)
    }

    this.date = date
    
    //列表
    source = await fetch(
      process.env.BASE_URL + 'api/article/list?date=' + this.date
    ).then(res => res.json())

    this.pageList = source.data
    this.m = source.m
    this.d = source.d
    this.TW_day = source.TW_day
  },
  methods: {
    loadMore() {
      let _this = this
      let newPageList = []

      this.page++

      this.$axios.get(process.env.BASE_URL + 'api/article/list?page=' + this.page).then(res => {
        newPageList = res.data.data

        if (newPageList.length == 0) {
          _this.isEmpty = true
        }

        newPageList.forEach(function(item, i) {
          _this.pageList.push(item)
        })
      })
    },
    onDayClick(day) {
      location.href = '/news?date=' + day.id
    }
  }
}
</script>