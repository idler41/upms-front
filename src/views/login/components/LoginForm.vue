<template>
  <el-card class="login-container">
    <div style="text-align: center">
      <h3 class="title">权限管理系统</h3>
    </div>
    <el-form ref="dataForm" :model="model" :rules="rules" :label-position="'right'" label-width="80px">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="model.username" name="username" type="text" auto-complete="on" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input :type="pwdType" v-model="model.password" name="password" clearable placeholder="请输入密码" @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="switchPwdType">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item v-if="needCode" prop="checkCode" label="验证码">
        <div style="float: left; padding-top: 8px;">
          <el-input v-model="model.checkCode" name="checkCode" type="text" @keyup.enter.native="handleLogin"/>
        </div>
        <div style="float: left">
          <img :src="imgSrc" @click="refreshCheckCode">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:85%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <!--<el-button type="text"> 忘记密码 </el-button>-->
        <el-button type="text" style="margin-left: 220px" @click="handleActionChange"> 还没有账号？马上去注册 </el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>

import { Message } from 'element-ui'

import { login } from '@/api/user'

export default {
  name: 'Login',
  props: {
    action: {
      type: String,
      default: () => 'login'
    }
  },
  data() {
    return {
      model: {
        username: 'user' + this.$_.random(11, 199),
        password: '123456',
        checkCode: null
      },
      imgSrc: null,
      needCode: false,

      rules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },

      loading: false,
      pwdType: 'password',
      redirect: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleActionChange() {
      this.$emit('update:action', 'register')
    },
    switchPwdType() {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    },
    refreshCheckCode() {
      this.imgSrc = '/api/v1/captcha/get?d=' + new Date()
    },
    handleLogin() {
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        login(this.model).then(res => {
          if (res.code && res.code === 20002) {
            // todo 弹窗效果不好，容易与用户名和密码错误的弹窗混淆，最好改为与async-validate组件一样的异常提示
            Message.error(res.message)
            // 登录错误次数过多，需要校验码
            this.refreshCheckCode()
            this.needCode = true
            return false
          }

          if (res.status === 200) {
            // 登录成功
            this.$router.push({ path: this.redirect || '/' })
          }
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 500px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(35%);

  .el-input {
    display: inline-block;
    height: 30px;
    width: 85%;
  }
}
</style>
