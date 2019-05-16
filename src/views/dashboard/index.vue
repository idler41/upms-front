<template>
  <div class="dashboard-container">

    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:2px;"/>

    <el-row :gutter="32"/>

    <el-row :gutter="8"/>

  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container {
    padding: 32px;
    background-color: rgb(255, 255, 255);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
