<template>
  <div class="grant-container">

    <el-dialog v-dialogDrag :title="'授权: ' + label" :visible="visible" :modal="false" center width="58%" @open="open" @close="close">
      <div class="dialog-body">

        <div class="main-left">
          <el-steps :active="active" direction="vertical" finish-status="success">
            <el-step :title="'前端授权'" />
            <el-step :title="'后端授权'" />
            <el-step :title="'提交授权'" />
          </el-steps>
        </div>

        <div v-show="active===0" class="main-right-tree">
          <el-tree
            v-loading="treeLoading"
            ref="resourceTree"
            :data="treeData"
            :default-checked-keys="resourceOfRole"
            :props="{
              key: 'id',
              label: 'label'
            }"
            show-checkbox
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

        </div>

        <div v-show="active===1" class="main-right">
          <!-- todo footer底部会覆盖元素，没看出和官网示例代码有啥差别 -->
          <el-transfer
            v-model="permissionOfRole"
            :props="{
              key: 'id',
              label: 'label'
            }"
            :titles="['可授权列表', '已授权列表']"
            :button-texts="['回收', '授权']"
            :data="permissions"
            style="text-align: left; display: inline-block"
            filterable>
            <el-tooltip slot-scope="{ option }" :content="option.label" effect="light" placement="right">
              <span>{{ option.permissionKey }}</span>
            </el-tooltip>
            <el-button slot="right-footer" class="transfer-footer" size="small" @click="autoGrant">自动授权</el-button>
          </el-transfer>
        </div>

        <div v-show="active===2" class="main-right-tree">
          <el-tree
            v-loading="treeLoading"
            ref="resourceViewTree"
            :data="treeData"
            :filter-node-method="filterTree"
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
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="12">
            <el-button @click="close">取消</el-button>
          </el-col>
          <el-col :span="12">
            <el-button v-show="active!==0" @click="next(-1)">上一步</el-button>
            <el-button v-show="active===2" :loading="grantLoading" @click="grant()">保存</el-button>
            <el-button v-show="active!==2" @click="next(1)">下一步</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { selectTree, selectIdsByRoleId as selectCheckedResource } from '@/api/resource'
import { selectAll as selectAllPermission, selectIdsByRoleId } from '@/api/permission'
import { grant } from '@/api/role'

import { Message } from 'element-ui'

export default {
  name: 'RoleGrant',
  props: {
    roleId: {
      type: Number,
      default: null
    },
    label: {
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
      active: 0,
      treeLoading: false,
      treeData: [],
      resourceOfRole: [],
      permissions: [],
      permissionOfRole: [],
      grantLoading: false
    }
  },
  methods: {
    open() {
      // 查询所有资源树
      this.treeLoading = true
      selectTree().then(res => {
        this.treeData = res.data || []
      }).finally(() => {
        this.treeLoading = false
      })

      // 查询该角色拥有的叶子节点资源
      selectCheckedResource(this.roleId).then(res => {
        this.resourceOfRole = res.data || []
      })

      // 查询所有权限
      if (!this.permissions || this.permissions.length === 0) {
        selectAllPermission().then(res => {
          this.permissions = res.data
        })
      }

      // 查询该角色拥有的权限
      selectIdsByRoleId(this.roleId).then(res => {
        this.permissionOfRole = res.data || []
      })
    },
    close() {
      this.active = 0
      this.treeLoading = false
      this.resourceOfRole = []
      this.permissionOfRole = []
      this.grantLoading = false
      this.$emit('update:visible', false)
    },
    autoGrant() {
      this.permissionOfRole = []
      const checkedNodes = this.$refs['resourceTree'].getCheckedNodes(true, false)
      for (const node of checkedNodes) {
        const permissionIds = node.permissionIds || []
        if (permissionIds.length > 0) {
          for (const id of permissionIds) {
            if (this.permissionOfRole.indexOf(id) === -1) {
              this.permissionOfRole.push(id)
            }
          }
        }
      }
    },
    grant() {
      const resources = this.$refs['resourceTree'].getHalfCheckedKeys().concat(this.$refs['resourceTree'].getCheckedKeys())
      const params = { roleId: this.roleId, resourceIds: resources, permissionIds: this.permissionOfRole }
      // 授权 目录 + 资源 + 权限
      grant(params).then(res => {
        Message.success('授权成功')
        this.close()
      })
    },

    filterTree(value, data, node) {
      // 只显示勾选或半勾选的节点
      return node.indeterminate || node.checked
    },
    next(i) {
      // 超出0~2到范围，则说明都不做
      if ((this.active === 2 && i === 1) || (this.active === 0 && i === -1)) {
        return
      }
      this.active = this.active + i
      if (this.active === 2) {
        this.$refs['resourceViewTree'].setCheckedKeys(this.$refs['resourceTree'].getCheckedKeys(true))
        this.$refs['resourceViewTree'].filter()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-body {
    width: 100%;
    height: 100%;

    .main-left {
      width: 100px;
      height: 300px;
      margin: 0px 0px 0px 20px;
      float: left;
    }

    .main-right {
      margin-left: 20px;
      float: left;
    }

    .main-right-tree {
      margin-left: 100px;
      float: left;
    }

    .transfer-footer {
      margin-left: 20px;
      padding: 6px 5px;
    }
  }
</style>
