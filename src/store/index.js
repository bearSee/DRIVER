/*
 * @Author: 熊望
 * @Date: 2022-01-07 23:07:13
 * @LastEditors: 熊望
 * @LastEditTime: 2022-01-23 23:31:58
 * @FilePath: /nginx/Users/bear/projects/project-bear/DRIVER/src/store/index.js
 * @Description:
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // 需要缓存的数据
        keepAliveKeys: [],
        logined: false,
    },
    mutations: {
        setLoginStatus(state, payload) {
            state.logined = payload;
        },
        clearPermissions(state, saveStorage) {
            state.logined = false;
            Vue.prototype.$cookies.remove('scheduling-i-token');
            if (!saveStorage) window.localStorage.clear();
        },
    },
    actions: {
        handlerLogin({ commit }, payload) {
            return new Promise((resolve) => {
                Vue.prototype.$http.post('/init/login', payload || {}, { loading: true }).then((res) => {
                    window.localStorage.setItem('Authorization', (res && res.data || {}).Authorization);
                    window.localStorage.setItem('userInfo', (res && res.data || {}).user);
                    commit('setLoginStatus', true);
                    resolve(true);
                }).catch(() => {
                    resolve(false);
                    commit('clearPermissions');
                });
            });
        },
    },
    strict: debug,
});


// 在页面刷新/关闭/失焦后，缓存指定数据
const listener = () => {
    const state = store.state;
    const keys = state.keepAliveKeys || [];
    const keepAliveData = {};
    Object.keys(state).forEach((key) => {
        if (keys.includes(key)) {
            const aliveData = window.localStorage.getItem(key);
            try {
                keepAliveData[key] = JSON.parse(aliveData) || state[key];
            } catch (error) {
                keepAliveData[key] = state[key];
            }
        }
    });
    window.localStorage.setItem('storeStates', JSON.stringify(keepAliveData));
};

window.addEventListener('blur', listener);
window.addEventListener('beforeunload', listener);
window.addEventListener('close', listener);

// 在页面加载时读取缓存数据
try {
    const storeStates = window.localStorage.getItem('storeStates');
    store.replaceState(Object.assign({}, store.state, JSON.parse(storeStates)));
} catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
}

export default store;
