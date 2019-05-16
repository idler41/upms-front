<template>
  <div class="edit-container">

    <el-dialog v-dialogDrag :title="'编辑用户'" :visible="visible" :modal="false" center width="30%" @close="close">
      <el-form ref="dataForm" :rules="rules" :model="model" label-position="right" label-width="80px" size="mini">
        <el-form-item :label="'用户名'" prop="username">
          <el-input v-model="model.username" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'用户昵称'" prop="nickname">
          <el-input v-model="model.nickname"/>
        </el-form-item>
        <el-form-item :label="'性别'" prop="gender">
          <el-radio v-model="model.gender" :label="0">男</el-radio>
          <el-radio v-model="model.gender" :label="1">女</el-radio>
        </el-form-item>
        <el-form-item :label="'出生日期'" prop="birthday">
          <el-date-picker v-model="model.birthday" :picker-options="pickerOptionsEnd" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp"/>
        </el-form-item>
        <el-form-item :label="'手机号码'" prop="mobile">
          <el-input v-model="model.mobile"/>
        </el-form-item>
        <el-form-item :label="'邮箱'" prop="email">
          <el-input v-model="model.email"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { Message } from 'element-ui'

import { updateSelective } from '@/api/user'
import { validMobile } from '@/utils/validate'

export default {
  name: 'UserDetail',
  props: {
    model: {
      type: Object,
      default: function() {
        return {
          id: null,
          username: null,
          nickname: null,
          mobile: null,
          gender: null,
          birthday: null,
          email: null
        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saveLoading: false,
      pickerOptionsEnd: {
        disabledDate(time) {
          return time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
        }
      },
      rules: {
        mobile: [{ require: false, message: '手机号码格式不正确', trigger: 'blur' }, { validator: validMobile, trigger: 'blur' }],
        email: [{ require: false, type: 'email', message: '邮件格式不正确', trigger: 'blur' }]
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = {
            id: this.model.id,
            nickname: this.model.nickname,
            mobile: this.model.mobile,
            gender: this.model.gender,
            birthday: this.model.birthday,
            email: this.model.email
          }
          updateSelective(params).then(() => {
            this.$emit('update:visible', false)
            this.$emit('refreshList')
            Message.success('更新成功')
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-container {

    .el-input {
      width: 200px;
    }

    .el-date-picker {
      width: 200px;
    }

  }
</style>
