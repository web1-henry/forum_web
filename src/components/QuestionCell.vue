<template>
  <div class="questionCell">
    <div
      class="item"
      v-for="item in list"
      :key="item._id"
      @click="goDetail(item._id)"
    >
      <van-cell-group inset>
        <van-cell :title="item.title">
          <template #title>
            <div class="Question">
              <div class="QuestionTitle van-hairline--bottom">
                {{ item.title }}
              </div>
              <div class="QuestionContent" v-html="item.content"></div>
            </div>
          </template>
          <template #label>
            <div class="QuastionItem">
              <div class="QuastionItemFront">
                <div class="AnswerTime">{{ item.createdAt }}</div>
                <div class="viewBox">
                  <van-icon name="eye-o" />
                  <span class="viewNum">{{ item.views }}</span>
                </div>
                <div class="answerBox">
                  <van-icon name="chat-o" />
                  <span class="answerNum">{{ item.answers }}</span>
                </div>
              </div>
              <div
                class="QuastionItemEnd"
                @click.stop="showAction(item._id)"
                v-if="route.name === 'Mine'"
              >
                <van-icon name="ellipsis" />
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell v-if="item.forum_answers && route.name !== 'Mine'">
          <template #title>
            <div class="QustionAnswerItemUser">
              <img
                :src="`http://localhost:3001/${item?.forum_answers[0]?.forum_user.avatar}`"
                v-if="item?.forum_answers[0]"
                class="answerAvatar"
              />
              <span class="ArticleItemUsername">{{
                item?.forum_answers[0]?.forum_user?.nickname ||
                item?.forum_answers[0]?.forum_user?.user_name
              }}</span>
              <!-- <van-tag type="success">{{ tag(item?.answer?.user?.roles) }}</van-tag> -->
            </div>
            <div
              class="QustionAnswerItemAnswer"
              v-html="item?.forum_answers[0]?.content"
            ></div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
      @select="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { Dialog } from 'vant'
import { Toast } from 'vant'
import * as api from '../server/api'
export default {
  props: {
    list: Array,
  },
  setup() {
    const show = ref(false)
    const router = useRouter()
    const questionId = ref('')
    const route = useRoute()

    const actions = [{ name: '删除' }]
    const goDetail = (questionid: string) => {
      router.push({
        path: '/detail',
        query: {
          questionid,
        },
      })
    }
    const onCancel = () => console.log('取消')
    const onSelect = () => {
      Dialog.confirm({
        title: '删除确认',
        message: '删除后无法恢复，是否确认删除',
        confirmButtonText: '确认删除',
      })
        .then(async () => {
          await api.post('/questions/delete', { questionid: questionId.value })
        })
        .then(() => {
          Toast.success('删除成功')
          router.back()
        })
    }
    const showAction = (id: string) => {
      show.value = true
      questionId.value = id
    }
    return {
      show,
      route,
      questionId,
      goDetail,
      onCancel,
      onSelect,
      showAction,
      actions,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../public/lib.less');
.item {
  margin-bottom: 1rem;
  .Question {
    display: flex;
    flex-direction: column;
    .QuestionTitle {
      font-size: 2rem;
      font-weight: 700;
      .textEllipsis(2);
      .enWrap();
    }
    .QuestionContent {
      margin-top: 1rem;
      .textEllipsis(3);
      .enWrap();
    }
  }
  .QuastionItem {
    .flex-row();
    padding: 1rem 0;
    .QuastionItemFront {
      .flex-row();
      flex: 1;
      .AnswerTime,
      .viewBox {
        margin-right: 1.5rem;
      }
    }
  }
  .QustionAnswerItemUser {
    .flex-row();
    align-items: center;
    .ArticleItemUsername {
      margin: 0 1rem;
    }
  }
  .QustionAnswerItemAnswer {
    font-size: 1.4rem;
    .enWrap;
    .textEllipsis(4);
  }
  .answerAvatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
}
</style>
