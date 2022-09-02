<template>
  <div class="Mine">
    <div class="Box">
      <div class="mineInfo">
        <div class="avatarBox">
          <img :src="avatar" alt="" class="avatar" />
        </div>
        <div class="userInfo">
          <div class="userName">{{ userName }}</div>
          <div class="idBox">
            <div class="userTxt">id:</div>
            <div class="userId">{{ id }}</div>
          </div>
        </div>
      </div>
    </div>
    <List class="list" />
  </div>
</template>
<script lang="ts">
import { Toast } from 'vant'
import * as api from '../server/api'
import { UserData } from '../type'
export default {
  async setup() {
    const avatar = ref('')
    const userName = ref('')
    const id = ref('')

    try {
      const { data } = await api.post<UserData, Object>('/users/info', {})

      if (data && data.avatar) {
        avatar.value = `http://localhost:3001/${data.avatar}`
      } else {
        avatar.value = '../assets/logo.png'
      }
      userName.value = data?.nickname || data?.user_name || 'User'
      id.value = data?._id || ''
    } catch (err) {
      Toast.fail('您未登录')
    }
    console.log(avatar.value)

    return {
      avatar,
      userName,
      id,
    }
  },
}
</script>

<style lang="less" scoped>
.Mine {
  display: flex;
  flex-direction: column;
  align-items: center;
  .Box {
    display: flex;
    flex-direction: row;
    width: 100%;
    .mineInfo {
      display: flex;
      flex-direction: row;
      align-items: center;
      align-self: flex-start;
      margin-top: 2rem;
      margin-left: 3rem;
      .avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
      }
      .userInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 1rem;
        font-size: 1.7rem;
        .idBox {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 1.4rem;
          color: rgb(190, 190, 190);
          font-style: italic;
        }
      }
    }
  }
  .list {
    margin-top: 2rem;
    width: 100%;
  }
}
</style>
