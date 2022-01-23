/*
 * @Author: 熊望
 * @Date: 2021-12-23 21:36:52
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-23 23:25:15
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVER/src/router/index.js
 * @Description:
 */
import Vue from 'vue';
import Router from 'vue-router';
import routeConfig from './route-config';
import store from '@/store';

Vue.use(Router);
const router = new Router(routeConfig);

router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0;
    if (!to.path.includes('login') && !store.state.logined) {
        const loginStatus = await store.dispatch('handlerLogin');
        if (loginStatus) {
            next();
            return;
        }
        next('/login');
        return;
    }
    next();
});

export default router;
