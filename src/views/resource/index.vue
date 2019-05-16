<template>
  <div class="resource-container">
    <split-pane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <div>
          <div class="btn-container">
            <el-button v-if="addAuth" type="text" icon="el-icon-plus" @click="addNode">添加节点</el-button>
          </div>

          <resource-tree :data="resourceTree" @clickNode="clickNode" @dbClickNode="dbClickNode" @refresh="refresh"/>
        </div>
      </template>
      <template slot="paneR">
        <resource-detail :tree="resourceTree" :node="currentNode" :status="nodeStatus" @refresh="refresh"/>
      </template>
    </split-pane>
  </div>

</template>

<script>
import splitPane from 'vue-splitpane'
import { mapGetters } from 'vuex'
import { ResourceTree, ResourceDetail } from './components'
import { selectTree } from '@/api/resource'

export default {
  name: 'Resource',
  components: { splitPane, ResourceTree, ResourceDetail },
  data() {
    return {
      resourceTree: [],
      treeLoading: false,
      currentNode: {},
      // 清空右侧节点 0、添加节点 1、查看节点 2 编辑节点
      nodeStatus: 1
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    addAuth: function() {
      return this.permissions.indexOf('resource-add') !== -1
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh: function() {
      this.currentNode = {}
      this.nodeStatus = 1
      this.treeLoading = true
      selectTree().then(res => {
        this.resourceTree = res.data
      }).finally(() => {
        this.treeLoading = false
      })
    },
    clickNode: function(node) {
      this.currentNode = node
      this.nodeStatus = 1
    },
    dbClickNode: function(node) {
      this.currentNode = node
      this.nodeStatus = 2
    },
    addNode: function() {
      if (!this.addAuth) {
        return
      }
      this.currentNode = {}
      this.nodeStatus = 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .resource-container {
    margin: 0px 0px;
    position: relative;
    height: 100vh;

    .btn-container {
      width: 100%;
      height: 20px;
      text-align: right;

      .el-button {
        width: 60px;
        margin-right: 5px;
      }
    }
  }
</style>

