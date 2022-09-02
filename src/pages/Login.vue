<template>
  <div class="box">
    <div class="login">
      <div class="loginBox">
        <div class="loginTitle">{{ txt }}</div>
        <div class="form">
          <van-form @submit="onSubmit">
            <van-cell-group inset>
              <van-field
                v-model="username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
                maxlength='10'
              />
              <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
                maxlength='10'
              />
            </van-cell-group>
            <div class="submit">
              <van-button round block type="primary" native-type="submit">
                {{ txt }}
              </van-button>
            </div>
          </van-form>
        </div>
        <div class="registerBox" v-if="show">
          <div class="space"></div>
          <div class="register" @click="toRegister">还没有账号？前去注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import * as api from '../server/api'
import { LoginData, LoginRequest, Result, UserData } from '../type'
export default {
  async setup() {
    const username = ref('')
    const password = ref('')
    const route = useRoute()
    const router = useRouter()
    const show = ref(true)
    const user = ref()
    let txt = ref('')
    let url = ref('')
    switch (route.name) {
      case 'Login':
        txt.value = '登录'
        url.value = '/users/login'
        break
      case 'Register':
        txt.value = '注册并登录'
        url.value = '/users/register'
        break
    }
    if ((route.name === 'Register')) {
      show.value = false
    } else{
      show.value = true
    }
    const onSubmit = async () => {
      if (route.name === 'Register') {
        ;(await api.post<LoginData, LoginRequest>('/users/register', {
          user_name: username.value,
          password: password.value,
        })) as Result<LoginData>
        ;(await api.post<LoginData, LoginRequest>('/users/login', {
          user_name: username.value,
          password: password.value,
        })) as Result<LoginData>
      } else {
        ;(await api.post<LoginData, LoginRequest>('/users/login', {
          user_name: username.value,
          password: password.value,
        })) as Result<LoginData>
      }
      const { data } = await api.post<UserData, Object>('/users/info', {})
      user.value = data
      if (typeof window !== undefined) {
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }
      router.push('/')
    }
    const toRegister = () => {
      router.push('/register')
    }
    return {
      show,
      toRegister,
      txt,
      username,
      password,
      onSubmit,
    }
  },
}
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  .loginBox {
    border: 0.1rem solid blue;
    border-radius: 2rem;
    width: 40rem;
    height: 40rem;
    display: flex;
    flex-direction: column;
  }
  .loginTitle {
    font-size: 3rem;
    margin-top: 2rem;
    margin-left: 2rem;
  }
  .form {
    margin-top: 4rem;
  }
  .registerBox {
    display: flex;
    flex-direction: row;
    width: 100%;
    .space {
      flex: 1;
    }
    .register {
      margin: 0 2rem;
      margin-top: 1rem;
      align-items: flex-end;
      color: blue;
      font-size: 1.4rem;
      border-bottom: 1px solid blue;
      font-style: italic;
    }
  }
  .submit {
    margin: 1.6rem;
    margin-top: 3rem;
  }
}
</style>
