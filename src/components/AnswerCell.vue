<template>
  <div class="answerCell">
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <van-cell-group>
      <div
        class="Item van-hairline--bottom"
        v-for="item in list"
        :key="item._id"
      >
        <van-cell>
          <template #title>
            <div class="AnswerTitle">
              <div class="AnswerFront">
                <img
                  :src="showImg(item.forum_user.avatar)"
                  class="AnswerAvatar"
                />
                <div class="userNickname">
                  <span class="Nickname">{{
                    item.forum_user.nickname || item.forum_user.user_name
                  }}</span>
                  <span class="ctime">{{ item.createdAt }}</span>
                </div>
              </div>
              <div :class="['AnswerEnd', { active: item?.isLike || false }]">
                <div class="goodJobBox" @click="goodJob(item)">
                  <span class="goodJobNum">{{ item.likes }}</span>
                  <van-icon name="good-job-o" />
                  <span class="goodJobText">有用</span>
                </div>
                <img src="/more.svg" class="Answermore" @click="Click(item)" />
              </div>
            </div>
          </template>
          <template #label>
            <div class="AnswerContent" v-html="item.content"></div>
          </template>
        </van-cell>
      </div>
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import * as api from '../server/api'
import { AnswerData, LikeData, UserData } from '../type'
import showImg from '../libs/showImg'
import { Dialog, Toast } from 'vant'
export default {
  props: {
    list: Array,
  },
  async setup(props) {
    const show = ref(false)
    const user = ref()
    const actions = ref()
    const answerId = ref('')
    const answerItem = ref()
    const router = useRouter()
    const route = useRoute()
    const questionid = route.query.questionid
    console.log(questionid);
    
    const goodJob = async (item: AnswerData) => {
      const { data } = await api.post<LikeData, { answerid: string }>(
        '/like/answer',
        {
          answerid: item._id,
        },
      )
      item.likes = data?.isLike ? item.likes + 1 : item.likes - 1
      item.isLike = data?.isLike
      console.log(data)
    }
    onMounted(async () => {
      const { data } = await api.post<UserData, Object>('/users/info', {})
      user.value = data
      console.log(props.list)
    })
    const Click = (item: AnswerData) => {
      show.value = true
      if (item.forum_user._id === user.value._id) {
        actions.value = [{ name: '举报' }, { name: '删除' }]
      } else {
        actions.value = [{ name: '举报' }]
      }
      answerId.value = item._id
      answerItem.value = item
    }
    const onSelect = async (item: { name: string}) => {
      if (item.name === '删除') {
        Dialog.confirm({
          title: '删除确认',
          message: '删除后无法恢复，是否确认删除',
          confirmButtonText: '确认删除',
        })
          .then(async () => {
            await api.post('/answer/delete', { answerid: answerId.value })
          })
          .then(() => {
            Toast.success('删除成功')
            router.push('/')
          })
      } else {
        console.log('举报')
      }
    }
    return { goodJob, show, actions, Click, onSelect, showImg }
  },
}
</script>
<style lang="less" scoped>
@import url('../public/lib.less');
.answerCell {
  height: 100%;
  .Item {
    margin-bottom: 1rem;
    .AnswerTitle {
      .flex-row();
      align-items: center;
      .AnswerFront {
        .flex-row();
        align-items: center;
        margin-left: 1rem;
        flex: 1;
        .AnswerAvatar {
          .roundImg(3rem);
        }
        .userNickname {
          .flex-column;
          line-height: 1.6rem;
          margin-left: 1rem;
          .Nickname {
            color: rgb(165, 121, 209);
          }
          .ctime {
            color: rgb(190, 190, 190);
            font-size: 0.5rem;
          }
        }
      }
      .AnswerEnd {
        .flex-row();
        align-items: center;
        color: rgb(127, 127, 127);
        .goodJobBox {
          margin: 0 0.5rem;
        }
        .Answermore {
          width: 2rem;
        }
      }
      .active {
        color: rgb(231, 159, 25);
      }
    }
    .AnswerContent {
      margin: 1rem;
      .enWrap();
      .textEllipsis(3);
    }
  }
}
</style>
