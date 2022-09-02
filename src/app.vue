<template>
  <NuxtPage />
</template>
<script lang="ts">
import * as api from '../src/server/api'
import { UserData } from './type'
export default {
  setup() {
    const user = ref()
    onMounted(async () => {
      const { data } = await api.post<UserData, Object>('/users/info', {})
      user.value = data
      if (typeof window !== undefined) {
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }
    })
  },
}
</script>
<style lang="less">
#__nuxt {
  height: 100%;
}
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  background-color: rgb(248, 248, 248);
}
html {
  font-size: 10px;
}
em {
  color: rgb(0, 191, 94);
}
.none {
  display: none;
}
</style>
