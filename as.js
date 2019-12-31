function getCodeUrl (url) {
  let urlA = url.split('')
  let num = ''
  for (let v of urlA) {
    num += v.charCodeAt() * 2 + 10 + ','
  }
  console.log(num)
}
getCodeUrl('/lqsy/baseImageInfo.json')
// ' + Select id,pid,username,state,comment from book_community_discuss
// '+%df/ and 1 = 1
