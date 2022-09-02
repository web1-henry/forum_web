import axios, { AxiosRequestHeaders } from 'axios'
import { useRouter } from 'vue-router'
import { getCookie } from './cookieOpt'

const instance = axios.create({
  baseURL: '/api',
  validateStatus: (status) => {
    return status < 500
  },
})

instance.interceptors.request.use((config) => {
  let token: string = getCookie('userpid') || ''
  
  if (token) {
    (config.headers as AxiosRequestHeaders)['authorization'] = token
  }
  return config
},(err)=>{
  console.log(err);
})

instance.interceptors.response.use((resp) => {
  // 定义响应拦截器
  const router = useRouter()
  if (resp.status === 401) {
    router.push('/login')
  }
  return resp
})

export default instance
