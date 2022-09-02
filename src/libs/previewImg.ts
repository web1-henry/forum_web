import { ImagePreview } from 'vant';
import { ref, Ref } from 'vue'
const ImgUrlList:Ref<string[]> = ref([])
const clickIndex = ref(0)
const previewImg = (content:string,e:Event) => {
  ImgUrlList.value = getImgUrl(content)
  if((e.target as Node).nodeName === 'IMG'){
    ImgUrlList.value.forEach((item,index) => {
      if((e.target as HTMLImageElement).src.includes(item)){
        clickIndex.value = index
      }
    })
    ImagePreview({
      images: ImgUrlList.value,
      startPosition: clickIndex.value,
      showIndicators: true,
    })
  }
}
function getImgUrl(val: string) {
  const srcReg = /src=['"]?([^'"&]*)&?/i;
  const imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
  const arr = val.match(imgReg) as RegExpMatchArray || [];
  const srcArr:string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg) as RegExpMatchArray;
    // 获取图片地址
    srcArr.push(src[1]);
  }
  return srcArr;
}

export default previewImg