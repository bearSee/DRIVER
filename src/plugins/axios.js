import Vue from 'vue';
import axios from 'axios';
import formatDate from 'sibionics-ui/src/filters/formatDate';
import store from '@/store';
import errorCode from '@/utils/error-code';

let loading = null;
let messageBox = null;

const host = 'http://47.107.151.192:28092';
const baseURL = `${host}/dhssys/`;

const axiosConfig = {
    baseURL,
    timeout: 30 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};
const Axios = axios.create(axiosConfig);
// 请求拦截
Axios.interceptors.request.use(
    (config) => {
        const timeStamp = formatDate(new Date(), 'YYYYMMDDhhmmss');
        config.headers = {
            ...config.headers,
            Authorization: window.localStorage.getItem('Authorization'),
        };
        // get请求增加时间戳，避免服务器304
        if (config.method === 'get') {
            config.params = {
                _t: timeStamp,
                ...config.params,
            };
        }

        if (config.loading) {
            loading = Vue.prototype.$loading({
                lock: true,
                text: config.loadingText || '页面加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

const readBlob = response => new Promise((resolve) => {
    const fileRead = new FileReader();
    fileRead.readAsText(response.data);
    fileRead.onload = () => {
        resolve(JSON.parse(fileRead.result));
    };
    fileRead.onerror = () => {
        resolve({});
    };
});

// 响应拦截
Axios.interceptors.response.use(
    async (res) => {
        if (loading) loading.close();

        // blob 请求特殊处理
        if (res.config.responseType === 'blob') {
            const isJson = res.data.type === 'application/json';
            if (!isJson) return res;
            res.data = await readBlob(res);
        }
        const { code, msg } = res.data || {};

        // 错误提示拦截
        const showMessage = () => {
            const messageTip = errorCode[code] || msg || '服务器响应失败，请稍后再试';
            if (messageBox) messageBox.close();
            messageBox = Vue.prototype.$message.error(messageTip);
        };

        // 返回成功响应
        if (String(code) === '0') return res;

        showMessage();

        // 登录失效拦截
        if (['10000'].includes(String(code))) {
            // 清除相关菜单权限
            store.commit('clearPermissions');
            Vue.prototype.$router.push('/login');
            window.location.replace('/#/login');
        }

        return Promise.reject(res);
    },
    (error) => {
        if (loading) loading.close();
        if (messageBox) messageBox.close();
        messageBox = Vue.prototype.$message.error('服务器内部异常');
        return Promise.reject(error);
    },
);

window.axios = Axios;
Vue.prototype.$http = Axios;
Vue.prototype.$host = host;
