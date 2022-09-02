import request from '../libs/request'
import { Result } from '@/type'

export async function post<R, T = null>(url: string, req?: T) {
  const { data } = await request.post<Result<R>>(url, req)
  return data
}

export async function put(url: string, file: File, headers: object) {
  const { status } = await request.put(url, file, headers)
  return status
}

export async function get<R>(url:string) {
  const {data} = await request.get(url)
  return data
}
