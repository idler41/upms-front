<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">

      <el-button type="text" @click="clearCache">清除缓存</el-button>

      <template v-if="device!=='mobile'">
        <el-tooltip :content="'全屏'" effect="dark" placement="bottom">
          <screenfull class="right-menu-item hover-effect"/>
        </el-tooltip>

        <el-tooltip :content="'布局大小'" effect="dark" placement="bottom">
          <size-select class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>

      <span class="right-menu-item">{{ name }}</span>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar&&avatar!==''?avatar:defaultAvatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  components: {
    Breadcrumb,
    SizeSelect,
    Screenfull,
    Hamburger
  },
  data() {
    return { defaultAvatar: defaultAvatar }
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    // 定位：顶部：7 左边：870
    const oScript = document.createElement('script')
    oScript.text = "WIDGET = {FID: 'aMnlGaTcUb'}"
    document.body.appendChild(oScript)
    const oScript2 = document.createElement('script')
    oScript2.type = 'text/javascript'
    oScript2.src = 'https://apip.weatherdt.com/float/static/js/r.js?v=1111'
    document.body.appendChild(oScript2)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut')
    },
    clearCache() {
      this.$store.dispatch('clearCache')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 12px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .el-button {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        vertical-align: text-bottom;
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 10px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 20px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 15px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

