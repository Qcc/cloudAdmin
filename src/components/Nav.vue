<template>
<el-row >
  <el-col>
    <el-menu
      :default-active="this.$route.name"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      :router="true"
      active-text-color="#ffd04b">
      <el-menu-item index="Overview">
        <i class="el-icon-menu"></i>
        <span slot="title">预览</span>
      </el-menu-item>
      <el-menu-item index="Section">
        <i class="el-icon-menu"></i>
        <span slot="title">栏目管理</span>
      </el-menu-item>
      <el-menu-item index="PushArticle">
        <i class="el-icon-setting"></i>
        <span slot="title">发表文章</span>
      </el-menu-item>
      <el-menu-item index="ArticleManage">
        <i class="el-icon-menu"></i>
        <span slot="title">文章管理</span>
      </el-menu-item>
      <el-menu-item index="PushImage">
        <i class="el-icon-menu"></i>
        <span slot="title">发表图片</span>
      </el-menu-item>
      <el-menu-item index="ImageManage">
        <i class="el-icon-setting"></i>
        <span slot="title">图片管理</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</el-row>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
