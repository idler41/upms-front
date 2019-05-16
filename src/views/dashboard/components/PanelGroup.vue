<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">在线人数</div>
          <count-to :start-val="0" :end-val="onlineUser" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people-new">
          <svg-icon icon-class="user-new" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">昨日新增</div>
          <count-to :start-val="0" :end-val="registerUser" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people-new">
          <svg-icon icon-class="user-count" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户总数</div>
          <count-to :start-val="0" :end-val="userAmount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>

    <el-col v-show="false" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people-new">
          <svg-icon icon-class="user-active" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">周活跃数</div>
          <count-to :start-val="0" :end-val="userActive" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

import { count } from '@/api/user'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      registerUser: 0,
      onlineUser: 0,
      userActive: 0,
      userAmount: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      count().then(res => {
        this.registerUser = res.data.registerUser || 0
        this.onlineUser = res.data.onlineUser || 0
        this.userActive = res.data.userActive || 0
        this.userAmount = res.data.userAmount || 0
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 0px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-people-new {
          background: #36a3f7;
        }
        .icon-count {
          background: #cceff7;
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-people-new {
        color: #36a3f7;
      }
      .icon-count {
        background: #cceff7;
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
