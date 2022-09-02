export default function formatQuillText(val:string){
    const reg = new RegExp('</p>','g');
    const LF = new RegExp('\\n','g')
    return val.replace(/<p>/g, '').replace(reg,'\n').replace(LF,'<br>').replace(/@base@tag=imgScale&amp;w=\d{0,}/g,'@base@tag=imgScale&amp;w=200')
}