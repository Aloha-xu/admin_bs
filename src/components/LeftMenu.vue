<template>
  <el-menu
    :collapse="isCollapse"
    background-color="#fff"
    router
    text-color="rgb(84 84 84)"
    active-text-color="rgb(0 19 250)"
  >
    <template v-for="(item, index) in sideMenu">
      <el-menu-item v-if="item.path" :index="item.path">
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>

      <el-submenu v-else :index="index + '1'">
        <template slot="title">
          <span slot="title">{{ item.name }}</span>
        </template>
        <el-menu-item v-for="element in item.children" :index="element.path">
          <span slot="title">{{ element.name }}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState("Menu", ["isCollapse"]),
    ...mapGetters("Menu", ["sideMenu"]),
  },
  created() {
    this.loadMenuTree();
  },
  methods: {
    loadMenuTree() {
      //这里的角色id需要根据登录的角色变化而变化 现在测试先写死
      // +localStorage.getItem("id")
      this.$store.dispatch("Menu/LoadMenu", {
        roleId: +localStorage.getItem("roleId"),
      });
    },
  },
};
</script>

<style scoped="scoped">
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
