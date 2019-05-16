<template>
  <div class="grant-container">

    <el-dialog v-dialogDrag :title="'授权用户: ' + username" :visible="visible" :modal="false" center @open="open" @close="close">
      <div class="dialog-body">
        <el-transfer
          v-model="grantRole"
          :props="{
            key: 'id',
            label: 'label'
          }"
          :titles="['未授权角色', '已授权角色']"
          :button-texts="['回收', '授权']"
          :data="allRole"
          style="text-align: left; display: inline-block"
          filterable>
          <el-button slot="right-footer" class="transfer-footer" size="mini" @click="overview">预览</el-button>
        </el-transfer>
      </div>
      <el-dialog
        :visible.sync="innerVisible"
        width="40%"
        title="目录预览"
        append-to-body>
        <el-tree
          v-loading="treeLoading"
          ref="resourceTree"
          :data="treeData"
          :filter-node-method="filterTree"
          :default-checked-keys="resourceOfRoles"
          :props="{
            key: 'id',
            label: 'label'
          }"
          default-expand-all
          node-key="id"
        >
          <span slot-scope="{ node, data }" class="tree-node">
            <span>
              <svg-icon v-if="data.type===0" :icon-class="node.expanded?'folder-open':'folder-close'" />
              <svg-icon v-else-if="data.type===1" :icon-class="'file'"/>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button :loading="grantLoading" type="primary" @click="grant">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { Message } from 'element-ui'
import { getAll, getRolesByUser } from '@/api/role'
import { grant } from '@/api/user'
import { selectTree, selectIdsByRoleIds } from '@/api/resource'

export default {
  name: 'UserGrant',
  props: {
    userId: {
      type: Number,
      default: null
    },
    username: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      grantLoading: false,
      allRole: [],
      grantRole: [],
      innerVisible: false,
      treeLoading: false,
      treeData: [],
      resourceOfRoles: []
    }
  },
  methods: {
    open() {
      getAll().then(res => {
        this.allRole = res.data
      })

      getRolesByUser(this.userId).then(res => {
        this.grantRole = res.data
      })
    },

    close() {
      this.$emit('update:visible', false)
    },

    grant() {
      this.grantLoading = true
      grant({ userId: this.userId, roleIds: this.grantRole }).then(res => {
        this.$emit('update:visible', false)
        Message.success('授权成功')
      }).finally(() => {
        this.grantLoading = false
      })
    },

    overview() {
      this.innerVisible = true

      // 查询所有资源
      selectTree().then(res => {
        this.treeData = res.data || []
      })
      // 查询角色拥有的资源
      selectIdsByRoleIds(this.grantRole).then(res => {
        // filter
        this.$nextTick(() => {
          this.$refs['resourceTree'].setCheckedKeys(res.data || [])
          this.$refs['resourceTree'].filter()
        })
      })
    },

    filterTree(value, data, node) {
      // 只显示勾选或半勾选的节点
      return node.indeterminate || node.checked
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-body {
    text-align: center;

    .transfer-footer {
      margin-left: 150px;
      padding: 6px 5px;
    }
  }
</style>
