import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/config/filters'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 配置图片懒加载
import VueLazyload from 'vue-lazyload'
import loading from './common/img/loading.gif'
Vue.use(VueLazyload, {
  loading
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
