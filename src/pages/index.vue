<template>
  <div class="Home">
    <Nav />
    <Suspense>
      <List :list="list"/>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { ListData, QuestionData, Result } from '../type'
export default {
  async setup() {
    const list = ref<QuestionData[]>()
    const [{ data: questionList }] = await Promise.all([
      useAsyncData<Result<ListData<QuestionData>>>('questionList', () =>
        $fetch('http://localhost:3001/api/questions/list', {
          method: 'POST',
          body: { offset: 0, limit: 10 },
        }),
      ),
    ])
    list.value = questionList.value.data?.rows
    return {
      list
    }
  },
}
</script>

<style lang="less" scoped></style>

