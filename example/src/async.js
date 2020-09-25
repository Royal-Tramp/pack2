function requestPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(666)
    }, 1000)
  })
}

async function run() {
  const res = await requestPromise()
  console.log(res)
}

run()