<template>
  <div v-if="!item.hidden" class="menu-wrapper">

    <!-- 可展开目录-->
    <el-submenu v-if="isFolder" :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children">
        <sidebar-item
          v-if="!child.hidden"
          :key="child.path"
          :item="child"
          :base-path="child.path"
          class="nest-menu"/>

        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <item v-if="child.meta" :icon="child.meta.icon" :title="generateTitle(child.meta.title)" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>

    <!-- 可点击目录 -->
    <template v-else>
      <app-link v-if="item.rootRedirect" :to="resolvePath(item.children[0].path)">
        <el-menu-item :index="resolvePath(item.children[0].path)" :class="{'submenu-title-noDropdown': true}">
          <item v-if="item.children[0].meta" :icon="item.children[0].meta.icon" :title="item.children[0].meta.title" />
        </el-menu-item>
      </app-link>

      <app-link v-else :to="resolvePath(item.path)">
        <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown': true}">
          <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    isFolder: function() {
      return this.item.type === 0
    }
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
