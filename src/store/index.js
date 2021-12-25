import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // 需要缓存的数据
        keepAliveKeys: ['userInfo'],
        // 用户信息
        userInfo: {},
    },
    mutations: {
        setUserInfo(state, payload) {
            state.userInfo = { ...state.userInfo, ...payload };
        },
        replaceUserInfo(state, payload) {
            state.userInfo = payload || {};
        },
        clearPermissions(state, saveStorage) {
            state.userInfo = {};
            if (!saveStorage) window.localStorage.clear();
        },
    },
    actions: {
        getUserInfo({ commit }) {
            return new Promise((resolve) => {
                Vue.prototype.$http.get('/edc-user-service/user/currentUser').then((res) => {
                    commit('replaceUserInfo', (res && res.data || {}).data || {});
                }).finally(resolve);
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
