export interface Result<T = undefined> {
  stat: string
  data?: T
  msg?: Error
}

export interface Error {
  code: string
  message: string
}

export interface LoginRequest {
  user_name: string
  password: string
}

export interface LoginData {
  message: string
  token: string
}

export interface ListData<R = undefined> {
  count: number
  rows: R[]
}

export interface ListRequest {
  offset?: number
  limit?: number
  sort?: string
  site?: string
}

export interface QuestionData {
  _id: string
  author: string
  content: string
  createdAt: string
  deleted: boolean
  likes: number
  title: string
  views: number
  forum_answers: AnswerData[]
  forum_user: UserData
}

export interface AnswerData {
  _id: string
  userid: string
  content: string
  deleted: boolean
  likes: number
  questionid: string
  createdAt: string
  updatedAt: string
}

export interface UserData {
  _id: string
  user_name: string
  nickname: string
  avatar: string
  admin: number
}
export interface Result<T = undefined> {
  stat: string
  data?: T
  msg?: Error
}

export interface Error {
  code: string
  message: string
}

export interface LoginRequest {
  user_name: string
  password: string
}

export interface LoginData {
  message: string
  token: string
}

export interface ListData<R = undefined> {
  count: number
  rows: R[]
}

export interface ListRequest {
  offset?: number
  limit?: number
  sort?: string
  keyword?:string
}

export interface QuestionData {
  _id: string
  author: string
  content: string
  createdAt: string
  deleted: boolean
  likes: number
  title: string
  views: number
  forum_answers: AnswerData[]
  forum_user: UserData
}

export interface AnswerData {
  _id: string
  userid: string
  content: string
  deleted: boolean
  likes: number
  questionid: string
  createdAt: string
  updatedAt: string
  isLike?: Boolean
  forum_user: UserData
}

export interface AnswerRequest {
  offset: number
  limit: number
  sort: string
  questionid: string
}

export interface UserData {
  _id: string
  user_name: string
  nickname: string
  avatar: string
  admin: number
  createdAt?: string
  updatedAt?: string
}

export interface UploadData {
  ErrorDatas: UploadData[]
  fileDatas: FileData[]
}

export interface FileData {
  fileId: string
  fileName: string
}

export interface UploadErrorData {
  fileName: string
  message: string
}

export interface QuestionDetail {
  _id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  views: number
  answers: number
  likes: number
  forum_user: UserData
}

export interface LikeData {
  message: string
  isLike: boolean
}

export interface AddQuestionData {
  message: string
  questionid: string
}

export interface AddQuestionRequest {
  title: string
  content: string
}

export interface AddAnswerRequest {
  questionid:string
  content:string
}
