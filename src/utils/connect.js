import reqwest from 'reqwest'

export const URL = 'http://localhost:3000/'
/*
ajax请求函数
@url 请求url
@onComplete 请求结果处理函数
@method 请求方法，默认GET
@params 请求参数对象
*/
// 获取
export function fetch (url, onComplete, method, params = {}) {
  // console.log("调用了fecth =", 'url', url, 'method', method,'params:', params)
  if (typeof onComplete !== 'function') {
    // console.log("成功获取到数据,回调函数不正确", onComplete)
    return
  }
  reqwest({
    url: url,
    method: method,
    crossDomain: true, // 跨域
    withCredentials: true, // 跨域时带Cookie
    data: {
      ...params
    },
    type: 'json'
  })
  .then((data) => {
    if (data.status === 200) {
      // console.log("成功获取到数据 ",JSON.stringify(data, null, 4))
      onComplete(data)
    } else {
      onComplete(null)
      // console.log("服务器错误 ",JSON.stringify(data, null, 4))
    }
  })
  .fail((err, msg) => {
    // console.log("err ", err, "msg ", msg)
    onComplete(err, msg)
  })
}
