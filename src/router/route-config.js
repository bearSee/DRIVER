import notFound from '@/views/404';
import master from '@/views/master';
import vipManage from '@/views/vipManage/vip-manage';
import labelManage from '@/views/vipManage/label-manage';
import messageManage from '@/views/vipManage/message-manage';
import activeManage from '@/views/ridersActivity/active-manage';
import goodsManage from '@/views/pointMall/goods-manage';
import orderManage from '@/views/pointMall/order-manage';

export default {
    routes: [
        {
            path: '/',
            redirect: '/master',
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
        },
        {
            path: '/404',
            name: '404',
            meta: {
                keepAlive: false,
            },
            component: notFound,
        },
        {
            path: '/master',
            name: 'master',
            redirect: '/vip-manage',
            component: master,
            children: [
                {
                    path: '/vip-manage',
                    name: 'vipManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: vipManage,
                },
                {
                    path: '/label-manage',
                    name: 'labelManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: labelManage,
                },
                {
                    path: '/message-manage',
                    name: 'messageManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: messageManage,
                },
                {
                    path: '/active-manage',
                    name: 'activeManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: activeManage,
                },
                {
                    path: '/goods-manage',
                    name: 'goodsManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: goodsManage,
                },
                {
                    path: '/order-manage',
                    name: 'orderManage',
                    meta: {
                        keepAlive: false,
                    },
                    component: orderManage,
                },
            ],
        },
    ],
};
