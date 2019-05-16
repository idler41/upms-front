<template>
  <div class="edit-container">
    <el-dialog v-dialogDrag :title="title" :visible="visible" :modal="false" width="30%" center @open="open" @close="close">
      <el-form ref="dataForm" :rules="rules" :model="model" label-position="right" label-width="80px" size="mini">
        <el-form-item :label="'权限标识'" prop="permissionKey">
          <el-input v-model="model.permissionKey" :disabled="isEdit"/>
        </el-form-item>
        <el-form-item :label="'权限名称'" prop="label">
          <el-input v-model="model.label" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="isEdit?updateData():createData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { create, updateSelective } from '@/api/permission'
import { Message } from 'element-ui'

export default {
  name: 'PermissionEdit',
  props: {
    model: {
      type: Object,
      default: function() {
        return {
          id: null,
          permissionKey: null,
          label: null
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saveLoading: false,
      rules: {
        permissionKey: [{ required: true, message: '权限标识不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title: function() {
      return this.isEdit ? '编辑权限' : '添加权限'
    }
  },
  methods: {
    open() {
      if (!this.isEdit) {
        this.$refs['dataForm'].resetFields()
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          create(this.model).then(res => {
            this.$emit('update:visible', false)
            this.$emit('refreshList')
            Message.success('添加成功')
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          updateSelective({ id: this.model.id, label: this.model.label }).then(() => {
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
