<template>
  <el-col :span="20">
    <h1>发布文章</h1>
    <div class="edit-area">
      <UmEditor v-bind:defaultMsg="defaultMsg" v-bind:config="config" ref="um"></UmEditor>
    </div>
    <button @click="getUEContent">获取内容</button>
    <button @click="getContentTxt">获得纯文本</button>
    <button @click="getPlainTxt">获得带格式的纯文本</button>&nbsp;
    <button @click="getHtmlContentLength">获得html长度</button>
    <button @click="getContentLength(true)">获得纯文本长度</button>&nbsp;
  </el-col>
</template>
<script>
import UmEditor from './UMEditor'
export default {
  components: {
    UmEditor
  },
  data () {
    return {
      defaultMsg: '初始文本',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      ctx: null
    }
  },
  mounted: function () {
    this.ctx = this.$refs.um.getUMCTX()
  },
  methods: {
    getHtmlContentLength () {
      let content = this.ctx.getContentLength()
      console.log(content)
    },
    getContentLength (ingoneHtml) {
      let content = this.ctx.getContentLength(ingoneHtml)
      console.log(content)
    },
    getContentTxt () {
      let content = this.ctx.getContentTxt()
      console.log(content)
    },
    getPlainTxt () {
      let content = this.ctx.getPlainTxt()
      console.log(content)
    },
    getUEContent () {
      let content = this.ctx.getContent()
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      })
      console.log(content)
    }
  }
}
</script>
