import Vue from 'vue';
import Router from 'vue-router';
import routeConfig from './route-config';

Vue.use(Router);
const router = new Router(routeConfig);

router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0;
    next();
});

export default router;
