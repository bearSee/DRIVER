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
                {{ (userInfo || {}).name || '' }}
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
    <!-- 修改密码弹窗 -->
    <el-dialog
      class="center"
      width="450px"
      title="修改密码"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="passwordVisible"
      :visible.sync="passwordVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        submit-text="保存"
        cancel-text="取消"
        ref="dialogForm"
        :item-info="passwordItemInfo"
        :rules="passwordRules"
        @submit="handlerSubmitPassword"
        @reset="passwordVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { encryptAES, decryptAES } from '@/utils/encryption';

export default {
    name: 'Master',
    data() {
        const pwdValidator = (rule, value, callback) => {
            if (value.length < 9 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/\W/.test(value)) {
                callback(new Error('密码长度大于8位，并包含大小写字母、数字及特殊符号'));
                return;
            }
            callback();
        };
        return {
            loadingBox: text => this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            }),
            userDropData: [
                {
                    key: 'handlerChangePassword',
                    value: '修改密码',
                },
                {
                    key: 'handlerLoginOut',
                    value: '安全退出',
                },
            ],
            passwordVisible: false,
            passwordItemInfo: [
                {
                    label: '旧密码',
                    code: 'oldPassword',
                    type: 'password',
                    maxlength: 20,
                    required: true,
                },
                {
                    label: '新密码',
                    code: 'newPassword',
                    type: 'password',
                    maxlength: 20,
                    required: true,
                },
                {
                    label: '确认密码',
                    code: 'confirmPassword',
                    type: 'password',
                    maxlength: 20,
                    required: true,
                },
            ],
            passwordRules: {
                oldPassword: [
                    // { validator: pwdValidator, trigger: ['blur', 'change'] },
                ],
                newPassword: [
                    { validator: pwdValidator, trigger: ['blur', 'change'] },
                ],
                confirmPassword: [
                    { validator: pwdValidator, trigger: ['blur', 'change'] },
                ],
            },
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
                            name: '标签管理',
                            path: '/label-manage',
                        },
                        {
                            name: '消息管理',
                            path: '/message-manage',
                        },
                    ],
                },
                {
                    name: '积分活动',
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
            userInfo: JSON.parse(window.localStorage.getItem('userInfo') || '{}'),
        };
    },
    methods: {
        ...mapMutations(['clearPermissions']),
        handlerSelect({ key }) {
            if (this[key]) this[key]();
        },
        // 修改密码
        handlerChangePassword() {
            this.passwordVisible = true;
        },
        // 提交密码
        handlerSubmitPassword(form, cb) {
            const params = {
                oldPwd: encryptAES(form.oldPassword),
                newPwd: encryptAES(form.newPassword),
                confirmPwd: encryptAES(form.confirmPassword),
            };

            this.$http.post('user/updatePwd', this.$qs.stringify(params)).then(() => {
                this.$message.success('保存成功');
                this.passwordVisible = false;
            }).finally(cb);
        },
        handlerLoginOut() {
            const loading = this.loadingBox('正在退出登录...');
            this.$http.post('/init/logout').then(() => {
                this.$router.push('/login');
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
