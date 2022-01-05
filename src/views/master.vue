<template>
  <div class="master">
    <el-container class="master-container">
      <el-header class="container-head">
        <div class="logo-box">
          <img
            src="@/assets/image/logo.jpg"
            alt="">
        </div>
        <div class="drop-box">
          <sib-dropdown
            :data="userDropData"
            @select="handlerSelect">
            <div class="drop-content-box">
              <el-avatar icon="el-icon-user-solid" />
              <p class="userName">
                {{ username || '' }}
              </p>
              <i class="el-icon-caret-bottom" />
            </div>
          </sib-dropdown>
        </div>
      </el-header>
      <el-main class="container-body vertical-scroll">
        <sib-index-page :custom-menus="menus" />
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
    name: 'Master',
    data() {
        return {
            loadingBox: text => this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            }),
            userDropData: [
                {
                    key: 'handlerLoginOut',
                    value: '安全退出',
                },
            ],
            menus: [
                {
                    name: '会员管理',
                    icon: 'el-icon-menu',
                    children: [
                        {
                            name: '会员管理',
                            path: '/vip-manage',
                        },
                        {
                            name: '消息管理',
                            path: '/message-manage',
                        },
                    ],
                },
                {
                    name: '车友活动',
                    icon: 'el-icon-menu',
                    children: [
                        {
                            name: '活动管理',
                            path: '/active-manage',
                        },
                    ],
                },
                {
                    name: '积分商城',
                    icon: 'el-icon-menu',
                    children: [
                        {
                            name: '商品管理',
                            path: '/goods-manage',
                        },
                        {
                            name: '订单管理',
                            path: '/order-manage',
                        },
                    ],
                },
            ],
            username: window.localStorage.getItem('username'),
        };
    },
    methods: {
        handlerSelect({ key }) {
            if (this[key]) this[key]();
        },
        handlerLoginOut() {
            const loading = this.loadingBox('正在退出登录...');
            this.$http.get('/edc-auth/logout').then(() => {
                window.location.replace('/#/login');
                window.location.reload();
                // 清除相关菜单权限及用户信息
                this.clearPermissions();
            }).finally(() => {
                setTimeout(loading.close.bind(loading), 1500);
            });
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.master {
    height: 100%;
    width: 100%;
    transition: 2s;
    background: #f8f8f8;
    .master-container {
        height: 100%;
        .container-head {
            width: 100%;
            height: 86px!important;
            padding: 0;
            background: #FFFFFF;
            box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
            margin-bottom: 2px;
            .logo-box {
              display: flex;
              margin: 0 10px;
              img {
                height: 50px;
                margin: auto 0;
              }
            }
            .drop-box {
              padding: 0 20px;
              margin: auto 0;
              display: flex;
              flex: 1 1 auto;
              justify-content: flex-end;
              .sib-dropdown {
                margin-left: 30px;
                display: flex;
                align-items: center;
                .drop-content-box {
                  display: flex;
                  align-items: center;
                  .userName {
                    margin: 0 10px;
                  }
                  .el-icon-s-custom {
                    font-size: 20px;
                  }
                }
              }
            }
        }
        .container-body {
            height: calc(100% - 88px);
            padding: 0;
            .main-content {
                .el-empty {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
