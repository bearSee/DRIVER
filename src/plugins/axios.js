import Vue from 'vue';
import axios from 'axios';
// AES加密
import { encryptAES } from 'sibionics-ui/src/utils/encryption';
import formatDate from 'sibionics-ui/src/filters/formatDate';
import store from '@/store';
import errorCode from '@/utils/error-code';

let loading = null;
let messageBox = null;

const baseURLConfig = {
    development: 'http://edc-api.dev.dc.sibionics.com',
    release: 'http://edc-api.test.dc.sibionics.com',
    production: '',
};

const baseURL = baseURLConfig[process.env.NODE_ENV];

// const baseURL = 'http://192.168.0.84:18100';
// const baseURL = 'http://192.168.0.141:18100';

const axiosConfig = {
    baseURL,
    timeout: 30 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};
const Axios = axios.create(axiosConfig);
// 请求拦截
Axios.interceptors.request.use(
    (config) => {
        // UUID || 生成随机数
        const uuid = Array(8).fill().map(() => (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1)).join('');
        const aun = window.localStorage.getItem(`accessToken-${window.systemId}`) || '';
        const timeStamp = formatDate(new Date(), 'YYYYMMDDhhmmss');
        config.headers = {
            ...config.headers,
            aun,
            mid: encryptAES(uuid),
            ts: encryptAES(timeStamp),
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
        const { code, message } = res.data || {};

        // 错误提示拦截
        const showMessage = () => {
            const messageTip = errorCode[code] || message || '服务器响应失败，请稍后再试';
            if (messageBox) messageBox.close();
            messageBox = Vue.prototype.$message.error(messageTip);
        };

        // 返回成功响应
        if (String(code) === '200') return res;

        showMessage();

        // 登录失效拦截 906: Token错误 907: Token过期 908: RefreshToken错误 909: RefreshToken过期
        if (['401', '906', '907', '908', '909', '999'].includes(String(code))) {
            // 清除相关菜单权限
            store.commit('clearPermissions');
            // window.location.replace('/#/login');
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
