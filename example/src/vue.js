import Vue from 'vue/dist/vue.esm.browser.js';

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  render (h) {
    return <div>{this.message}</div>
  }
})