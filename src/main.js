import Vue from 'vue';
// 引入 sibionics-ui
import sibUI from 'sibionics-ui/src';
// 引入样式表
import 'sibionics-ui/lib/sibionics.css';
import App from './App';
import router from './router';
import store from './store';
import 'animate.css';
import './plugins';


Vue.use(sibUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
