<template>
  <div class="login">
    <el-row class="login-row">
      <el-col
        class="login-img"
        :span="12">
        <div class="login-pic">
          <img
            src="@/assets/image/login-pic.png"
            alt="登录页背景图">
        </div>
      </el-col>
      <el-col
        :span="12"
        class="login-col">
        <el-form
          label-position="top"
          class="login-form"
          ref="loginForm"
          :model="formData"
          :rules="rules"
          :hide-required-asterisk="true">
          <div class="login-center">
            <div class="login-center-head">
              <h3 class="text-h3">
                <img
                  src="@/assets/image/logo.jpg"
                  alt="登录页logo">
              </h3>
            </div>
            <el-form-item
              v-for="item in formItems"
              :class="`login-center-${item.code}`"
              :label="item.label"
              :prop="item.code"
              :key="item.code">
              <template v-if="item.code === 'verifyCode'">
                <el-input
                  v-model="formData[item.code]"
                  :placeholder="`请输入${item.label}`"
                  :maxlength="item.maxlength"
                  :type="item.type"
                  @keyup.enter.native="handlerSubmit"
                  clearable
                />
                <div class="verifyCode-image">
                  <img
                    v-if="captchaVisible"
                    :src="captchaUrl"
                    alt="验证码"
                    srcset="">
                </div>
                <!-- <captcha-code
                  ref="captcha"
                  bg-color="#f8f8f8"
                  class="captcha-code"
                  :captcha="verifyCode"
                  :font-size="28"
                  :char-num="4" /> -->
                <el-button
                  type="text"
                  class="captcha-text"
                  @click="handleRefreshCaptcha">
                  点击刷新
                </el-button>
              </template>
              <el-input
                v-else
                clearable
                v-model="formData[item.code]"
                :show-password="item.code === 'password'"
                :placeholder="`请输入${item.label}`"
                :maxlength="item.maxlength"
                :type="item.type"
                @keyup.enter.native="handlerSubmit"
              />
            </el-form-item>
            <!-- <el-button
              type="text"
              @click="handleForgetPwd">
              忘记密码?
            </el-button> -->
            <el-form-item class="form-item-btn">
              <el-button
                class="login-sign-in"
                type="primary"
                @click="handlerSubmit">
                登录
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { encryptAES, decryptAES } from '@/utils/encryption';
// import captchaCode from '@/components/captcha';

export default {
    name: 'Login',
    // components: { captchaCode },
    data() {
        const pwdValidator = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
                return;
            }
            // if (value.length < 9 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/\W/.test(value)) {
            //     callback(new Error('密码长度大于8位，并包含大小写字母、数字及特殊符号'));
            //     return;
            // }
            callback();
        };
        return {
            // verifyCode: '',
            captchaUrl: `${this.$baseURL}init/verifyCode?_t=${new Date().getTime()}`,
            captchaVisible: true,
            loadingBox: (text = '') => this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            }),
            formItems: [
                {
                    label: '账号',
                    code: 'username',
                    type: 'text',
                },
                {
                    label: '密码',
                    code: 'password',
                    type: 'password',
                    maxlength: 30,
                },
                {
                    label: '验证码',
                    code: 'verifyCode',
                    type: 'text',
                    maxlength: 6,
                },
            ],
            formData: {},
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { validator: pwdValidator, trigger: ['blur', 'change'] },
                ],
                verifyCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ],
            },
        };
    },
    methods: {
        ...mapMutations(['clearPermissions']),
        ...mapActions(['handlerLogin']),
        handlerSubmit() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    this.clearPermissions(true);
                    const loginStatus = await this.handlerLogin({
                        ...this.formData,
                        password: encryptAES(this.formData.password),
                        // eslint-disable-next-line no-underscore-dangle
                        _t: this.$qs.parse(this.captchaUrl.split('?')[1])._t,
                    });
                    this.handleRefreshCaptcha();
                    if (loginStatus) this.$router.push('/master').catch(() => {});
                }
            });
        },
        handleRefreshCaptcha() {
            // if (this.$refs.captcha && this.$refs.captcha[0]) this.$refs.captcha[0].refreshCaptcha();
            this.captchaVisible = false;
            this.$nextTick(() => {
                this.captchaUrl = `${this.$baseURL}init/verifyCode?_t=${new Date().getTime()}`;
                this.captchaVisible = true;
            });
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.login {
    height: 100%;
    width: 100%;
    background: #2FA4A1;
    position: relative;
    overflow: auto;
    .login-row {
        width: 70vw;
        min-width: 800px;
        max-width: 1200px;
        height: calc(70vw * (896 / 1490));
        min-height: 500px;
        max-height: 634px;
        background: #FFFFFF;
        box-shadow: 0px 9px 19px 0px rgba(0, 0, 0, 0.24);
        border-radius: 14px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .login-img {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #EBFFFD;
        border-radius: 14px 0 0 14px;
        .logo-box {
            margin: 39px 0 0 42px;
        }
        .login-pic {
            margin: auto;
            max-width: 80%;
            max-height: 80%;
            img {
                width: 100%;
                display: block;
            }
        }
    }
    .login-col {
        height: 100%;
        font-family: PingFangSC-Semibold, PingFang SC;
        .login-form {
            height: 100%;
            .login-center {
                padding: calc(60 * 80vw / 1490) 60px 0 60px;
                width: 100%;
                height: 100%;
                font-weight: 600;
                position: relative;
                .sys-lang {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    width: 100px;
                }
                .login-center-head {
                    margin-bottom: calc(20 * 80vw / 1490);
                    .text-h3 {
                        img {
                            width: 100%;
                        }
                    }
                }
                .el-form-item {
                    margin-top: calc(20 * 80vw / 1490);
                    .el-form-item__label {
                        font-size: 20px;
                        color: #1F1F1F;
                        line-height: 28px;
                    }
                    .el-form-item__content {
                        width: 100%;
                        .el-input {
                            input {
                                height: calc(58 * 80vw / 1490);
                                min-height: 35px;
                                background: #FFFFFF;
                                border-radius: 8px;
                                border: 2px solid #DDDFE6;
                            }
                        }
                        .el-form-item__error {
                            font-size: 15px;
                        }
                    }
                    &.form-item-btn {
                        margin-top: calc(20 * 80vw / 1490);
                        .login-sign-in {
                            width: calc(244 * 80vw / 1490);
                            height: calc(70 * 80vw / 1490);
                            min-width: 145px;
                            min-height: 41px;
                            max-width: 220px;
                            max-height: 60px;
                            background: #1FDBC6;
                            border-radius: 34px;
                            border: 0px;
                            font-size: 25px;
                        }
                    }
                    &.login-center-verifyCode {
                         .el-form-item__content {
                            display: flex;
                            .el-input {
                                width: 50%;
                            }
                            .captcha-code {
                                margin: auto 20px;
                                width: calc(132 * 80vw / 1490);
                                height: calc(50 * 80vw / 1490);
                            }
                        }
                    }
                    .verifyCode-image {
                        min-width: 100px;
                        max-width: 100px;
                        margin: 0 5px;
                        img {
                            height: 100%;
                            width: 100px;
                            display: block;
                        }
                    }
                }
            }
        }
    }
}
@media (max-width: 1600px){
    .login-center-head {
        margin-bottom: calc(70 * 80vw / 1490)!important;
    }
    .form-item-btn {
        margin-top: calc(40 * 80vw / 1490);
    }
}
</style>
