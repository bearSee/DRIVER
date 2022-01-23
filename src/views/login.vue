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
              <el-input
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
// import { encryptAES } from 'sibionics-ui/src/utils/encryption';

export default {
    name: 'Login',
    data() {
        return {
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
            ],
            formData: {},
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    {
                        required: true, message: '请输入密码', trigger: 'blur',
                    },
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
                    const loginStatus = await this.handlerLogin(this.formData);
                    if (loginStatus) this.$router.push('/master').catch(() => {});
                }
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
                    margin-bottom: calc(70 * 80vw / 1490);
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
                        margin-top: calc(40 * 80vw / 1490);
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
                    &.login-center-verification {
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
                }
            }
        }
    }
}
</style>
