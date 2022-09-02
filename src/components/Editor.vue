<template>
  <div class="upload">
    <van-cell-group inset class="title">
      <van-field
        v-model="title"
        placeholder="请输入标题"
        v-if="route.name === 'PostQuestion'"
      >
        <template #button>
          <form action="submit" enctype="multipart/form-data">
            <input
              type="file"
              @change="afterRead"
              name="file"
              id="file"
              class="none"
            />
            <label for="file">
              <van-icon name="photo-o" size="2rem" class="uploadIcon" />
            </label>
          </form>
        </template>
      </van-field>
    </van-cell-group>
    <div
      contentEditable="true"
      class="textArea"
      v-html="html"
      @input="onChange"
    ></div>
    <van-button round type="primary" size="large" class="submit" @click="submit"
      >发布</van-button
    >
  </div>
</template>

<script lang="ts">
import * as api from '../server/api'
import { ref } from 'vue'
import {
  AddAnswerRequest,
  AddQuestionData,
  AddQuestionRequest,
  Result,
  UploadData,
} from '../type'
export default {
  setup() {
    const fileName = ref('')
    const title = ref('')
    const route = useRoute()
    const html = ref('')
    const text = ref('')
    const router = useRouter()
    const questionid = route.query.questionid as string

    const afterRead = async (e: any) => {
      const file = e.target.files[0]
      let param = new FormData()
      param.append('file', file)

      const res = (await api.post<UploadData, FormData>(
        '/upload',
        param,
      )) as Result<UploadData>
      fileName.value = res.data?.fileDatas[0].fileName as string
      html.value = html.value.concat(
        `<p>${text.value}</p><br>`,
        `<p><img src="http://localhost:3001/${fileName.value}" v-if="fileName" style="width:5rem;height:5rem""/></p>`,
      )
      console.log(html.value)
    }
    const onChange = (e: any) => {
      text.value = e.target.innerText
      console.log(e.target.innerText)
    }

    const submit = async () => {
      let res
      let txt
      if(html.value){
        txt = html.value
      }else{
        txt = text.value
      }
      if (route.name === 'PostQuestion') {
        res = await api.post<AddQuestionData, AddQuestionRequest>(
          '/questions/add',
          {
            title: title.value,
            content: txt,
          },
        )
      } else {
        res = await api.post<AddQuestionData, AddAnswerRequest>('/answer/add', {
          questionid,
          content: txt,
        })
      }

      router.push({
        path: '/detail',
        query: {
          questionid: res?.data?.questionid || questionid,
        },
      })
      console.log(res)
    }

    return {
      text,
      title,
      route,
      submit,
      onChange,
      afterRead,
      fileName,
      html,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../public/lib.less');
.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  height: 100%;
  .title {
    width: 90%;
  }
  .textArea {
    .enWrap();
    display: flex;
    width: 90%;
    min-height: 50rem;
    border: 1px solid black;
    border-radius: 1rem;
    margin-top: 2rem;
    padding: 1rem;
    font-size: 1.6rem;
    > img {
      width: 3rem;
      height: 3rem;
    }
  }
  .submit {
    margin-top: 2rem;
    width: 80%;
  }
}
</style>
