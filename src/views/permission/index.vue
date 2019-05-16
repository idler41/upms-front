<template>
  <div class="list-container">

    <el-row>
      <el-col :span="5">
        <span>权限标识:</span>
        <el-input v-model="listQuery.permissionKey" size="mini" placeholder="权限标识" clearable/>
      </el-col>

      <el-col :span="5">
        <span>权限名称:</span>
        <el-input v-model="listQuery.label" size="mini" placeholder="权限名称" clearable/>
      </el-col>

      <el-col :span="14">
        <div class="right-container">

          <el-button-group>
            <el-button plain icon="el-icon-search" @click="refreshList">查询</el-button>
          </el-button-group>

          <el-button-group>
            <!--<el-button v-if="importAuth" plain icon="el-icon-upload2">导入</el-button>-->
            <el-button v-if="exportAuth" plain icon="el-icon-download" @click="handleExport">
              导出
              <a v-show="false" ref="exportDom" href="/api/v1/permission/export" />
            </el-button>

            <el-button v-if="deleteAuth" plain icon="el-icon-delete" @click="handleRemove">删除</el-button>
            <el-button v-if="editAuth" plain icon="el-icon-edit-outline" @click="handleEdit()">编辑</el-button>
            <el-button v-if="addAuth" plain icon="el-icon-edit-outline" @click="handleAdd">添加</el-button>

          </el-button-group>
        </div>

      </el-col>
    </el-row>

    <el-row v-if="viewAuth">
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list"
          :header-cell-style="{background:'#f3f6fb',color:'#292b2f'}"
          max-height="475"
          stripe
          border
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @row-dblclick="handleEdit">
          <el-table-column type="selection" width="40"/>
          <el-table-column align="center" label="权限标识" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.permissionKey }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="权限名称" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" sortable="custom" label="创建时间" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | dateTimeFormat }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row v-if="viewAuth">
      <el-col :span="12" :offset="12">
        <div class="right-container footer-page">
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="refreshList" />
        </div>
      </el-col>
    </el-row>

    <permission-detail :visible.sync="dialogEditVisible" :is-edit="clickEdit" :model="selectModel" @refreshList="refreshList" />

  </div>
</template>

<script>

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

import { getPage, remove, batchRemove } from '@/api/permission'
import PermissionDetail from './components/PermissionDetail'
import { cloneDeep } from '@/utils'

export default {
  name: 'PermissionList',
  components: { Pagination, PermissionDetail },
  data() {
    return {
      listLoading: false,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        permissionKey: null,
        label: null,
        orderDesc: null
      },
      multipleSelection: [],
      dialogEditVisible: false,
      clickEdit: false,
      selectModel: {
        id: null,
        permissionKey: null,
        label: null
      },
      rules: {
        permissionKey: [{ required: true, message: '权限标识不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    viewAuth: function() {
      return this.permissions.indexOf('permission-list') !== -1
    },
    addAuth: function() {
      return this.permissions.indexOf('permission-add') !== -1
    },
    editAuth: function() {
      return this.permissions.indexOf('permission-edit') !== -1
    },
    deleteAuth: function() {
      return this.permissions.indexOf('permission-remove') !== -1
    },
    importAuth: function() {
      return this.permissions.indexOf('permission-import') !== -1
    },
    exportAuth: function() {
      return this.permissions.indexOf('permission-export') !== -1
    }
  },
  created() {
    this.refreshList()
  },
  methods: {
    refreshList() {
      this.listLoading = true
      getPage(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.total
      }).finally(() => {
        this.listLoading = false
      })
    },
    sortChange(column) {
      this.listQuery.orderDesc = column.order ? column.order === 'descending' : null
      this.refreshList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.selectModel = {
        id: null,
        permissionKey: null,
        label: null
      }
      this.clickEdit = false
      this.dialogEditVisible = true
    },
    handleEdit(row) {
      if (row) {
        // 双击编辑
        this.selectModel = cloneDeep(row)
      } else {
        if (this.multipleSelection.length === 1) {
          this.selectModel = cloneDeep(this.multipleSelection[0])
        } else {
          Message.warning('请选择一条数据进行编辑')
          return
        }
      }
      this.clickEdit = true
      this.dialogEditVisible = true
    },
    handleRemove() {
      if (this.multipleSelection.length < 1) {
        Message.warning('请选择一条数据进行删除')
      }
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length === 1) {
          remove(this.multipleSelection[0].id).then(res => {
            Message.success('删除成功')
            this.refreshList()
          })
        } else {
          const ids = []
          for (const selection of this.multipleSelection) {
            ids.push(selection.id)
          }
          batchRemove(ids).then(res => {
            Message.success('删除成功')
            this.refreshList()
          })
        }
      }).catch(() => {
        // cancel
      })
    },
    handleExport() {
      // 模拟点击a标签
      this.$refs['exportDom'].click()
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-container {
    font-size: 12px;
    .el-row {
      margin: 10px 18px 5px 18px;
      &:last-child {
        margin-bottom: 90px;
      }
    }

    .el-col {
      padding: 0px 0px 0px 0px;
    }

    .el-table {
      width: 100%;
    }

    .el-input {
      width: 128px;
    }

    .el-select {
      width: 128px;
    }

    .right-container{
      float:right
    }

    .pagination-container{
      margin-top: 0px;
      padding: 0px 0px;
    }

    .footer-page {
      height: 50px;
    }
  }
</style>
