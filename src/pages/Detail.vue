<template>
  <div class="detail">
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <div class="question">
      <van-cell-group>
        <van-cell :border="false">
          <template #title>
            <div class="title">
              {{ question?.title }}
            </div>
          </template>
          <template #label>
            <div class="quastionDetailUser">
              <div class="UserInfo">
                <img
                  :src="showImg(question?.forum_user?.avatar)"
                  class="userAvatar"
                />
                <span class="userName">{{
                  question?.forum_user?.nickname ||
                  question?.forum_user?.user_name
                }}</span>
              </div>
              <div class="questionInfo">
                <div class="questionInfoFront">
                  <span class="quastionCtime">{{
                    question?.updatedAt || question?.createdAt
                  }}</span>
                  <span class="quastionViewNumBox">
                    <van-icon name="eye-o" />
                    <span class="quastionViewNum">{{ question?.views }}</span>
                  </span>
                  <span class="quastionAnswerNumBox">
                    <van-icon name="chat-o" />
                    <span class="quastionAnswerNum">{{
                      question?.answers
                    }}</span>
                  </span>
                  <div class="space"></div>
                  <div class="space"></div>
                </div>
                <van-icon name="ellipsis" @click="showActionSheet"></van-icon>
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <div class="questionTitle" v-html="question?.content"></div>
          </template>
        </van-cell>
      </van-cell-group>
      <List class="list" />
    </div>
  </div>
</template>

<script lang="ts">
import * as api from '../server/api'
import { QuestionDetail, UserData } from '../type'
import showImg from '../libs/showImg'
export default {
  setup() {
    const question = ref<QuestionDetail>()
    const answerList = ref()
    const route = useRoute()
    const router = useRouter()
    const questionid = route.query.questionid
    const show = ref(false)
    const user = ref()
    const actions = ref<Array<Record<string, string>>>([])
    onMounted(async () => {
      user.value = (await api.post<UserData, Object>('/users/info', {})) || {}
      const { data } = await api.post<QuestionDetail, { questionid: string }>(
        '/questions/detail',
        {
          questionid: questionid as string,
        },
      )
      question.value = data
      if ((data?.answers as number) > 0) {
        const { data } = await api.post('/answer/list', {
          questionid: questionid,
        })
        answerList.value = data
      }
    })
    const showActionSheet = () => {
      show.value = true 
      if (user.value && user.value._id === question.value?.forum_user._id) {
        actions.value = [{ name: '回复' }, { name: '举报' }, { name: '删除' }]
      } else {
        actions.value = [{ name: '回复' }, { name: '举报' }]
      }
    }
    const onSelect = async (item: { name: string }) => {
      if (item.name === '回复') {
        router.push({
          path: '/postAnswer',
          query: {
            questionid,
          },
        })
      } else if (item.name === '删除') {
        console.log('删除')
      } else {
        console.log('举报')
      }
      console.log(question.value)
      console.log()
    }
    return {
      show,
      actions,
      showActionSheet,
      onSelect,
      showImg,
      question,
      answerList,
    }
  },
  //   @click="myPreviewImg($event)"
}
</script>

<style lang="less" scoped>
@import url('../public/lib.less');
.detail {
  height: 100%;
  .flex-column();
  .question {
    flex: 1;
    overflow: auto;
    .title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
    .quastionDetailUser {
      .flex-column();
      .UserInfo {
        .flex-row();
        align-items: center;
        .userAvatar {
          .roundImg(3rem);
        }
        .userName {
          margin-left: 0.5rem;
        }
      }
      .questionInfo {
        .flex-row();
        align-items: center;
        flex: 1;
        align-self: flex-start;
        width: 100%;
        margin: 1rem;
        margin-left: 0;
        .questionInfoFront {
          .flex-row();
          align-items: center;
          flex: 1;
          .quastionViewNumBox {
            margin-left: 1rem;
          }
          .quastionAnswerNumBox {
            margin-left: 1rem;
          }
        }
      }
    }
    .questionTitle {
      margin-bottom: 3rem;
    }
  }
  .icon {
    text-align: center;
  }
  .list {
    margin-top: 2rem;
  }
}
</style>
