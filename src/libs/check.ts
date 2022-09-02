export default function check(res: any) {
  console.log(res);
  
  if (res.stat === 'OK') {
    return true
  } else {
    return false
  }
}
