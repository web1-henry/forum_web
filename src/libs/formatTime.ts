import dayjs from 'dayjs'
// const relativeTime = require('dayjs/plugin/relativeTime')
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'
dayjs.extend(relativeTime)
dayjs.locale('zh')

export default function formatTime(time:number){
    return (dayjs() as any).to(dayjs(time))
}

