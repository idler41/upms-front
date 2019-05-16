<template>
  <el-card class="register-container">
    <div style="text-align: center">
      <h3 class="title">账号注册</h3>
    </div>
    <el-form ref="dataForm" :model="model" :rules="rules" :label-position="'right'" label-width="80px">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="model.username" name="username" type="text" clearable placeholder="登录用户名"/>
      </el-form-item>
      <el-form-item prop="password" label="登录密码">
        <el-input :type="pwdType" v-model="model.password" name="password" clearable placeholder="登录密码"/>
        <span class="show-pwd" @click="switchPwdType">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input :type="pwdType" v-model="confirmPassword" name="confirmPassword" clearable placeholder="确认密码"/>
        <span class="show-pwd" @click="switchPwdType">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <el-radio v-model="model.gender" :label="0">男</el-radio>
        <el-radio v-model="model.gender" :label="1">女</el-radio>
      </el-form-item>
      <el-form-item prop="nickname" label="用户昵称">
        <el-input v-model="model.nickname" name="nickname" type="text" clearable placeholder="用户昵称"/>
      </el-form-item>
      <el-form-item prop="email" label="用户邮箱">
        <el-input v-model="model.email" name="email" type="text" clearable placeholder="用户邮箱" @keyup.enter.native="handleRegister"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:30%;margin-left: 36px" @click="handleReset">重置</el-button>
        <el-button :loading="loading" type="primary" style="width:30%;" @click="handleRegister">注册</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" style="margin-left: 240px" @click="handleActionChange"> 已有账号？马上去登录 </el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>

import { Message } from 'element-ui'

import { register, login } from '@/api/user'
import { removeToken } from '@/utils/auth'

export default {
  name: 'RegisterForm',
  props: {
    action: {
      type: String,
      default: () => 'register'
    }
  },
  data() {
    return {
      model: {
        username: '',
        password: '',
        nickname: '',
        email: '',
        gender: 0
      },
      rules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        email: [{ type: 'email', required: true, trigger: 'blur' }]
      },
      confirmPassword: '',
      loading: false,
      pwdType: 'password',
      redirect: null
    }
  },
  methods: {
    handleActionChange() {
      this.$emit('update:action', 'login')
    },
    switchPwdType() {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    },
    handleReset() {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleRegister() {
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return false
        }

        if (this.confirmPassword !== this.model.password) {
          // todo 弹窗效果不好，最好改为与async-validate组件一样的异常提示
          Message.error('两次密码输入不一致')
          return false
        }

        this.loading = true
        register(this.model).then(res => {
          // 清除cookie，避免以之前用户身份登录
          removeToken()
          // 自动登录
          login({ username: this.model.username.trim(), password: this.model.password.trim() }).then(res => {
            this.$router.push({ path: this.redirect || '/' })
          })
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .register-container {
    width: 500px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(10%);

    .el-input {
      display: inline-block;
      height: 30px;
      width: 85%;
    }
  }
</style>
