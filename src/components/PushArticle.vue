<template>
  <el-col :span="20">
    <el-form ref="form" :model="article" size="mini" label-width="55px">
      <el-form-item label="标题">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="article.category" placeholder="请选择分类">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="article.keyword"></el-input>    
      </el-form-item>
      <el-form-item label="概要">
        <el-input v-model="article.summary"></el-input>    
      </el-form-item> 
      <el-form-item>
        <UmEditor v-bind:defaultMsg="defaultMsg" v-bind:config="config" ref="um"></UmEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
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
      ctx: null,
      article: {
        title: '',
        category: null,
        keyword: '',
        summary: '',
        text: ''
      }
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
