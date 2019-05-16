<template>

  <div class="list-container">
    <el-row>
      <el-col :span="5">
        <span>用户昵称:</span>
        <el-input v-model="listQuery.nickname" size="mini" placeholder="用户昵称" clearable/>
      </el-col>

      <el-col :span="5">
        <span>手机号码:</span>
        <el-input v-model="listQuery.mobile" size="mini" placeholder="手机号码" clearable/>
      </el-col>

      <el-col :span="12" :offset="2">
        <div class="right-container">
          <el-button type="text" @click="advancedSearch=!advancedSearch">更多搜索</el-button>

          <el-button-group>
            <el-button plain icon="el-icon-search" @click="refreshList">查询</el-button>
          </el-button-group>

          <el-button-group>
            <el-button v-if="grantAuth" plain icon="el-icon-setting" @click="handleGrant">授权</el-button>
            <!--<el-button v-if="importAuth" plain icon="el-icon-upload2">导入</el-button>-->
            <el-button v-if="exportAuth" plain icon="el-icon-download" @click="handleExport">
              导出
              <a v-show="false" ref="exportDom" href="/api/v1/user/export" />
            </el-button>

            <el-button v-if="editAuth" plain icon="el-icon-edit-outline" @click="handleEdit()">编辑</el-button>
          </el-button-group>
        </div>

      </el-col>
    </el-row>

    <el-row v-if="advancedSearch" :span="12">
      <el-col :span="5">
        <span>手机号码:</span>
        <el-input v-model="listQuery.mobile" size="mini" placeholder="手机号码" clearable/>
      </el-col>

      <el-col :span="5">
        <span style="font-size: 12px;">性别:</span>
        <el-select v-model="listQuery.gender" size="mini" clearable placeholder="请选择">
          <el-option :key="0" :value="0" :label="'男'" />
          <el-option :key="1" :value="1" :label="'女'" />
        </el-select>
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
          @filter-change="handleFilter"
          @row-dblclick="handleEdit">
          <el-table-column type="selection" width="40"/>
          <el-table-column align="center" label="用户名" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户昵称" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column :filters="[{ text: '男', value: 0 }, { text: '女', value: 1 }]" column-key="gender" prop="gender" align="center" label="性别" min-width="10%">
            <template slot-scope="scope">
              <span>{{ scope.row.gender == 0 ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="年龄" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.birthday | birthDayToAge }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号码" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="邮箱" min-width="15%">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
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

    <user-detail :visible.sync="dialogEditVisible" :model="selectModel" @refreshList="refreshList" />

    <user-grant :visible.sync="dialogGrantVisible" :user-id="selectModel.id" :username="selectModel.username" />
  </div>
</template>

<script>

import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { mapGetters } from 'vuex'

import UserDetail from './components/UserDetail'
import UserGrant from './components/UserGrant'
import { getPage } from '@/api/user'
import { cloneDeep } from '@/utils'

export default {
  name: 'UserList',
  components: { Pagination, UserDetail, UserGrant },
  data() {
    return {
      listLoading: false,
      list: null,
      total: 0,
      advancedSearch: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        nickname: null,
        gender: null,
        mobile: null
      },

      dialogEditVisible: false,
      multipleSelection: [],
      selectModel: {
        id: null,
        username: null,
        nickname: null,
        mobile: null,
        gender: null,
        birthday: null,
        email: null
      },
      dialogGrantVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    viewAuth: function() {
      return this.permissions.indexOf('user-list') !== -1
    },
    editAuth: function() {
      return this.permissions.indexOf('user-edit') !== -1
    },
    importAuth: function() {
      return this.permissions.indexOf('user-import') !== -1
    },
    exportAuth: function() {
      return this.permissions.indexOf('user-export') !== -1
    },
    grantAuth: function() {
      return this.permissions.indexOf('user-grant') !== -1
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
    handleFilter(filters) {
      this.listQuery.gender = filters.gender[0]
      this.refreshList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      this.dialogEditVisible = true
    },
    handleGrant() {
      if (this.multipleSelection.length !== 1) {
        Message.warning('请选择一位用户授权')
        return
      }
      this.selectModel = this.multipleSelection[0]
      this.dialogGrantVisible = true
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
