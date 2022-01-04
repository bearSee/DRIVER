/*
 * @Author: 熊望
 * @Date: 2021-12-24 19:26:32
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-04 23:55:12
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVER/src/main.js
 * @Description:
 */
import Vue from 'vue';
// 引入 sibionics-ui
import sibUI from 'sibionics-ui/src';
// 引入样式表
import 'sibionics-ui/lib/sibionics.css';
import App from './App';
import router from './router';
import store from './store';
import 'animate.css';
import 'cropperjs/dist/cropper.css';
import './plugins';


Vue.use(sibUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
