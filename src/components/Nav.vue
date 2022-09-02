<template>
  <div class="Nav">
    <div class="navBox">
      <div class="logo">
        <img class="mineImg" src="../assets/logo.png" />
        <div class="logoTxt">forum</div>
      </div>
      <div class="space"></div>
      <div class="End">
        <div class="toMain none">首页</div>
        <van-button
          icon="plus"
          type="primary"
          round
          class="questionPc none"
          @click="toPost"
          >提问</van-button
        >
        <van-button
          type="primary"
          round
          class="questionPc"
          @click="toLogin"
          v-if="show"
          >登录</van-button
        >
        <van-button
          icon="plus"
          type="primary"
          round
          class="questionMob"
          @click="toPost"
        ></van-button>
        <div class="mine">
          <img class="mineImg" :src="avatar" />
          <ul class="menu">
            <li
              class="item"
              v-for="item in list"
              :key="item.value"
              @click="check(item.text)"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Image as VanImage } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '../server/api'
import { UserData } from '../type'
export default {
  components: {
    [VanImage.name]: VanImage,
  },
  async setup() {
    const value = ref(0)
    const router = useRouter()
    const user = ref<UserData>()
    const avatar = ref('')
    const list = [
      { text: '我的主页', value: 0 },
      { text: '退出登录', value: 1 },
    ]
    const show = ref<Boolean>()

    onMounted(async () => {
      const res = await api.post<UserData, Object>('/users/info', {})
      user.value = res.data as UserData
      if (user.value && user.value.avatar) {
        avatar.value = `http://localhost:3001/${user.value.avatar}`
      } else {
        avatar.value = '../assets/logo.png'
      }
      show.value = user.value ? false : true
    })
    const check = async (txt: string) => {
      if (txt === '我的主页') {
        router.push('/mine')
      } else {
        await api.post('/users/logout', {})
        window.history.go(0)
      }
    }
    const toPost = () => {
      router.push('/postQuestion')
    }
    const toLogin = () => {
      router.push('/login')
    }
    return {
      show,
      avatar,
      user,
      toLogin,
      value,
      list,
      check,
      toPost,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../public/lib.less');
.Nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 5rem;
  width: 100%;
  background-color: white;
  .mineImg {
    .roundImg(3rem);
    .pointer();
  }
  .navBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 80%;
  }
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    .logoTxt {
      font-size: 2rem;
      margin-left: 1rem;
      font-style: italic;
    }
  }
  .space {
    flex: 1;
  }
  .End {
    display: flex;
    flex-direction: row;
    align-items: center;
    .toMain {
      font-size: 1.5rem;
    }
    .questionPc {
      padding: 1rem;
      height: 3rem;
      margin-left: 1rem;
    }
    .questionMob {
      margin-left: 1rem;
      height: 2rem;
      padding: 0;
    }
    .mine {
      margin-left: 1rem;
      position: relative;
      &:hover .menu {
        display: block;
      }
      .menu {
        display: none;
        position: absolute;
        list-style: none;
        border: 1px solid #eee;
        min-width: 10rem;
        z-index: 999;
        > li {
          padding: 5px 10px;
          cursor: pointer;
          &:hover {
            display: block;
          }
        }
        .nickName {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
