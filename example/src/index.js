import "regenerator-runtime/runtime.js";
import hello from './hello.js'
import world from './world.js'
import _ from 'underscore/underscore-esm.js';

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

console.log(hello + world())
console.log(_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]))