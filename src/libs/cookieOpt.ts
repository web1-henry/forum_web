export function setCookie(name: string, value: any) {
  if (typeof window !== 'undefined') {
    document.cookie = name + '=' + JSON.stringify(value);
  }
}

export function getCookie(name: string) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (typeof window !== 'undefined') {
    const res = document.cookie.match(reg) as RegExpMatchArray;
    if (res) {
      return JSON.parse(res[2]);
    }
  }
}
