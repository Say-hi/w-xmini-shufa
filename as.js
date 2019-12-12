function getCodeUrl (url) {
  let urlA = url.split('')
  let num = ''
  for (let v of urlA) {
    num += v.charCodeAt() * 2 + 10 + ','
  }
  console.log(num)
}
getCodeUrl('/commen/logistic')
