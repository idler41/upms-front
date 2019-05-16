<template>
  <div class="right-container">
    <el-form ref="dataForm" :rules="rules" :model="currentData" label-position="right" label-width="80px">
      <el-form-item :label="'父节点'" prop="parentId">
        <el-cascader
          v-model="selectedValue"
          :props="selectProps"
          :options="selectedOptions"
          :disabled="(!addAuth&&!editAuth) || viewFlag"
          :change-on-select="true"
          expand-trigger="hover"
          clearable
          placeholder="无"/>
      </el-form-item>
      <el-form-item :label="'资源标识'" prop="resourceKey">
        <el-input
          v-model="currentData.resourceKey"
          :disabled="(!addAuth&&!editAuth) || !addFlag" />
      </el-form-item>
      <el-form-item :label="'资源名称'" prop="label">
        <el-input
          v-model="currentData.label"
          :disabled="(!addAuth&&!editAuth) || viewFlag" />
      </el-form-item>
      <el-form-item :label="'资源图标'" prop="icon">
        <el-select
          v-model="currentData.icon"
          :disabled="(!addAuth&&!editAuth) || viewFlag"
          clearable >
          <el-option v-for="item in iconsMap" :key="item" :value="item">
            <svg-icon :icon-class="item" style="float: left; margin:10px 0px 0px 0px;" />
            <span style="float: right">{{ item }}</span>
          </el-option>
        </el-select>
        <svg-icon v-if="currentData.icon" :icon-class="currentData.icon" />
      </el-form-item>
      <el-form-item :label="'排序'" prop="levelOrder" >
        <el-input-number
          v-model="currentData.levelOrder"
          :disabled="(!addAuth&&!editAuth) || viewFlag"
          :min="1"
          controls-position="right" />
      </el-form-item>
      <el-form-item :label="'节点类型'" prop="type">
        <el-select
          v-model="currentData.type"
          :disabled="(!addAuth&&!editAuth) || !addFlag">
          <el-option :key="0" :label="'可展开目录'" :value="0" />
          <el-option :key="1" :label="'可打开页面'" :value="1" />
          <el-option :key="2" :label="'其它'" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="grantVisible" :label="'关联权限'" prop="grantVal">
        <el-select v-model="currentData.permissionIds" :disabled="(!addAuth&&!editAuth) || viewFlag" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in permissionOption"
            :key="item.id"
            :label="item.label"
            :value="item.id">
            <span style="float: left">{{ item.permissionKey }}</span>
            <span style="float: right">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="addAuth||editAuth"
          :loading="saveLoading"
          :disabled="viewFlag"
          type="primary"
          @click="addFlag?createData():updateData()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

import { create, updateSelective } from '@/api/resource'
import { selectAll } from '@/api/permission'
import icons from './requireIcons'
import { cloneDeep } from '@/utils'

export default {
  name: 'ResourceDetail',
  props: {
    tree: {
      type: Array,
      required: true,
      default: () => []
    },
    node: {
      type: Object,
      required: true
    },
    status: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data() {
    return {
      saveLoading: false,
      selectProps: {
        children: 'children',
        label: 'label',
        value: 'id'
      },
      rules: {
        resourceKey: [{ required: true, message: '资源标识不能为空', trigger: 'change' }]
      },
      selectedValue: [],
      selectedOptions: [],
      iconsMap: icons,
      currentData: {
        id: null,
        parentId: null,
        resourceKey: null,
        label: null,
        levelOrder: null,
        icon: null,
        type: null,
        permissionIds: []
      },
      grantVisible: false,
      permissionOption: []
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    addAuth: function() {
      return this.permissions.indexOf('resource-add') !== -1
    },
    editAuth: function() {
      return this.permissions.indexOf('resource-edit') !== -1
    },
    viewFlag: function() {
      return this.status === 1
    },
    addFlag: function() {
      return this.status === 0
    },
    editFlag: function() {
      return this.status === 2
    },
    isLeafNode: function() {
      return this.model.data && this.model.data.leafNode === 1
    },
    currentType: function() {
      return this.currentData.type
    }
  },
  watch: {
    node(val) {
      if (this.addFlag) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs['dataForm'].resetFields()
        })
      }
      const result = []
      if (val.parent) {
        this.buildSelectedValue(result, val.parent)
      }
      this.selectedValue = result
      const data = val.data || {
        id: null,
        parentId: null,
        resourceKey: null,
        label: null,
        levelOrder: null,
        icon: null,
        type: null
      }
      this.selectedOptions = this.treeFilter(cloneDeep(this.tree), data.id)
      this.currentData = cloneDeep(data)
    },
    tree(val) {
      if (this.tree && this.tree.length > 0) {
        this.selectedOptions = this.treeFilter(this.tree, null)
      }
    },
    currentType(val) {
      // 如果是非目录类型资源，则显示关联权限select
      this.grantVisible = val === 2
    }
  },
  created() {
    selectAll().then(res => {
      this.permissionOption = res.data || []
    })
  },
  methods: {
    treeFilter(nodes, currentId) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return []
      }

      const newChildren = []
      for (const node of nodes) {
        // 本节点以及子节点不显示
        if (node.id === currentId) {
          continue
        }

        if (node.type !== 2) {
          // 只保留可下拉目录
          newChildren.push(node)
          const filterChildren = this.treeFilter(node.children, currentId)
          node.children = filterChildren.length > 0 ? filterChildren : null
        } else {
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          const filterChildren = this.treeFilter(node.children, currentId)
          if (filterChildren.length > 0) {
            newChildren.push(...filterChildren)
          }
        }
      }
      return newChildren
    },
    buildSelectedValue(array, node) {
      if (node.parent) {
        array.push(node.data.id)
        this.buildSelectedValue(array, node.parent)
      } else {
        array.reverse()
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.selectedValue.length === 0) {
            this.currentData.parentId = 0
          } else {
            this.currentData.parentId = this.selectedValue[this.selectedValue.length - 1]
          }
          create(this.currentData).then(res => {
            this.$emit('refresh')
            Message.success('保存成功')
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
          if (this.selectedValue.length === 0) {
            this.currentData.parentId = 0
          } else {
            this.currentData.parentId = this.selectedValue[this.selectedValue.length - 1]
          }
          const params = cloneDeep(this.currentData)
          delete params.resourceKey
          delete params.type
          updateSelective(params).then(res => {
            this.$emit('refresh')
            Message.success('保存成功')
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

  .right-container {
    margin-top: 10px;
    background-color: #ffffff;
    width: 100%;
    height: 100%;

    .el-form {
      margin: 0px 0px 0px 100px;
      width: 300px;

      .el-cascader {
        width: 200px
      }

      .el-input {
        width: 200px
      }

      .el-select {
        width: 200px
      }
    }
  }
</style>
