import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器

import VueQuillEditor from 'vue-quill-editor'
 
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
 //定义一个过滤时间格式的过滤器
 Vue.filter('dateFilter',function(original){
  //这里的original为管道符的左边的传入的参数
  var dt = new Date(original);

  var y = dt.getFullYear() //年
  var m = dt.getMonth()+1 //月
  var d = dt.getDate() //日

  var h = dt.getHours() //时
  var f = dt.getMinutes() //分
  var s = dt.getSeconds() //秒

  //返回日期格式
  return `${y}-${m}-${d} ${h}:${f}:${s}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
