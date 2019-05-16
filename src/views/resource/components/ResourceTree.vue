<template>
  <div class="tree-container">
    <el-tree :data="data" :props="props" :expand-on-click-node="false" :node-key="nodeKey">
      <span slot-scope="{ node, data }" class="tree-node">
        <span @click="() => clickNode(node, data, false)" @dblclick="() => clickNode(node, data, true)">
          <svg-icon v-if="data.type===0" :icon-class="node.expanded?'folder-open':'folder-close'" />
          <svg-icon v-else-if="data.type===1" :icon-class="'file'"/>
          {{ node.label }}
        </span>
        <span>
          <el-button
            v-if="deleteAuth"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="() => removeNode(node, data)"/>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>

import { Message } from 'element-ui'
import { remove } from '@/api/resource'
import { mapGetters } from 'vuex'

export default {
  name: 'ResourceTree',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      nodeKey: 'id',
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    deleteAuth: function() {
      return this.permissions.indexOf('resource-remove') !== -1
    }
  },
  methods: {
    clickNode(node, data, dbClick) {
      if (dbClick) {
        this.$emit('dbClickNode', node)
      } else {
        this.$emit('clickNode', node)
      }
    },
    removeNode(node, data) {
      this.$confirm('是否删除节点: ' + data.label, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(data.id).then(res => {
          Message.success('删除成功')
          this.$emit('refresh')
        })
      }).catch(() => {
        // cancel
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree-container {
    margin-top: 10px;
    background-color: #ffffff;
    height: 630px;
    overflow: scroll;

    .tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
</style>
