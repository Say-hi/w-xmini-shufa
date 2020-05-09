let time = []
for (let index = 0; index < 60; index++) {
  time.push(index < 10 ? '0' + index : index.toString())
}
console.log(time)
