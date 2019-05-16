export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function body2Obj(body) {
  const datas = body.split('&')
  if (!datas) {
    return {}
  }
  const result = {}
  datas.forEach(data => {
    const propValue = data.split('=')
    result[propValue[0]] = propValue[1]
  })

  return result
}
