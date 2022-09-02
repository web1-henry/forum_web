<template>
  <div class="List">
    <div class="Search">
      <form action="/">
        <van-search
          v-model="keyWord"
          show-action
          placeholder="请输入搜索关键词"
          background="#f6f6f6"
          @search="onSearch"
          @cancel="onCancel"
          class="search"
        >
          <template #action>
            <div class="actionBox">
              <div @click="onSearch">搜索</div>
              <div @click="onCancel" class="cancelBtn">取消</div>
            </div>
          </template>
        </van-search>
      </form>
    </div>
    <div class="tab">
      <div class="space"></div>
      <div class="sort" v-if="!(route.name === 'Mine')">
        <div
          v-for="tab in tabs"
          :key="tab"
          :class="['tabButton', { active: tabAction === tab }]"
          @click="checkTab(tab)"
        >
          {{ tab }}
        </div>
      </div>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :offset="10"
        :immediate-check="false"
      >
        <component :is="currentList" :list="list"></component>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { Ref, ref, reactive } from 'vue'
import { post } from '../server/api'
import {
  ListRequest,
  QuestionData,
  Result,
  ListData,
  AnswerData,
  AnswerRequest,
} from '../type'
export default {
  props: {
    list: Array,
  },
  async setup(props) {
    const list: Ref<any> = ref(props.list || [])
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)
    const tabs = ['最新', '最热']
    const tabAction = ref('最新')
    const className = ref('menu')
    const route = useRoute()
    const keyWord = ref('')
    const questionid = ref(route.query.questionid)

    const res = ref()
    const request = reactive({
      offset: 0,
      limit: 10,
      sort: 'latest',
    })
    onMounted(async () => {
      list.value = []
      await onLoad()
    })
    const currentList = computed(() => {
      return (
        (() => {
          if (route.name === 'Detail') {
            return 'Answer'
          } else {
            return 'Question'
          }
        })() + 'Cell'
      )
    })
    const onLoad = async () => {
      if (refreshing.value) {
        list.value = []
        refreshing.value = false
      }
      loading.value = true

      try {
        if (route.name === 'Mine') {
          const { data } = (await post<ListData<QuestionData>, ListRequest>(
            '/questions/mine',
            {
              offset: request.offset,
              limit: request.limit,
              sort: request.sort,
            },
          )) as Result<ListData<QuestionData>>
          res.value = data
        } else if (route.name === 'Detail') {
          let answeridList: string[] = []
          let answerList: ListData<AnswerData>
          const { data } = await post<ListData<AnswerData>, AnswerRequest>(
            '/answer/list',
            {
              offset: request.offset,
              limit: request.limit,
              sort: request.sort,
              questionid: questionid.value as string,
            },
          )
          answerList = data as ListData<AnswerData>
          answerList.rows.forEach((item) => {
            answeridList.push(item._id)
          })
          if (typeof window !== undefined) {
            if (sessionStorage.getItem('user') !== 'undefined') {
              const LikeInfo = (
                await post<Boolean[], { list: string; site: string }>(
                  '/like/info',
                  {
                    list: JSON.stringify(answeridList),
                    site: 'answer',
                  },
                )
              ).data as Boolean[]
              LikeInfo.forEach((item, index: number) => {
                answerList.rows[index].isLike = item
              })
            }
          }
          res.value = answerList
        } else {
          if (keyWord.value) {
            console.log(keyWord.value)
            const { data } = (await post<ListData<QuestionData>, ListRequest>(
              '/questions/search',
              {
                offset: request.offset,
                limit: request.limit,
                sort: request.sort,
                keyword: keyWord.value,
              },
            )) as Result<ListData<QuestionData>>
            res.value = data
          } else {
            const { data } = (await post<ListData<QuestionData>, ListRequest>(
              '/questions/list',
              {
                offset: request.offset,
                limit: request.limit,
                sort: request.sort,
              },
            )) as Result<ListData<QuestionData>>
            res.value = data
          }
        }

        if (res.value?.rows.length) {
          res.value.rows.forEach((item: QuestionData) => list.value.push(item))
          if (res.value.rows.length < 10) {
            finished.value = true
          }
        } else {
          finished.value = true
        }
      } catch (err) {
        console.log(err)
      }
      loading.value = false
      request.offset += 10
    }
    const resetData = () => {
      list.value = []
      request.offset = 0
      finished.value = false
    }

    const onRefresh = async () => {
      resetData()
      loading.value = true
      await onLoad()
    }

    const onSearch = async () => {
      resetData()
      loading.value = true
      await onLoad()
    }
    const onCancel = async () => {
      keyWord.value = ''
      loading.value = true
      await onLoad()
    }

    const checkTab = async (tab: string) => {
      tabAction.value = tab
      if (tab === '最新') {
        request.sort = 'latest'
      } else {
        request.sort = 'hottest'
      }
      resetData()
      await onLoad()
    }
    return {
      tabs,
      keyWord,
      onSearch,
      onCancel,
      tabAction,
      className,
      currentList,
      checkTab,
      onLoad,
      onRefresh,
      list,
      route,
      loading,
      finished,
      refreshing,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../public/lib.less');
.List {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  .Search {
    padding: 0 2rem;
    .actionBox {
      display: flex;
      flex-direction: row;
      align-items: center;
      .cancelBtn {
        margin-left: 1rem;
      }
    }
  }
  :deep(.van-search__content) {
    background-color: white;
  }
  .tab {
    display: flex;
    flex-direction: row;

    .space {
      flex: 1;
    }
    .sort {
      .flex-row();
      margin-right: 4rem;
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      .tabButton {
        margin-right: 1rem;
        position: relative;
        .pointer()
      }
      .tabButton.active {
        font-weight: 700;
        &:after {
          content: ' ';
          width: 2rem;
          height: 0.3rem;
          background: blue;
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%); //居中处理
        }
      }
    }
  }
}
</style>
