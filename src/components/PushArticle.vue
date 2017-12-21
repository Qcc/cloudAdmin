<template>
  <el-col :span="20">
    <el-form :model="article" :rules="rules" ref="sendArticleForm" size="mini" label-width="65px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="article.category" placeholder="请选择分类">
          <el-option v-for="item in category" :key="item._id" v-if="item.type === 'article'" :label="item.label" :value="item.path">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">/{{ item.path }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="article.keyword"></el-input>
      </el-form-item>
      <el-form-item label="概要" prop="summary">
        <el-input v-model="article.summary"></el-input>    
      </el-form-item> 
      <el-form-item prop="text">
        <UmEditor v-bind:defaultMsg="defaultMsg" v-bind:config="config" ref="um"></UmEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('sendArticleForm')">立即创建</el-button>
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
import {fetch, URL} from '../utils/connect.js'
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
        category: '',
        keyword: '',
        summary: '',
        text: ''
      },
      category: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 5, message: '长度不能超过5个字符', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
          { min: 1, max: 100, message: '长度不能超过100个字符', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入概要', trigger: 'blur' },
          { min: 1, max: 200, message: '长度不能超过200个字符', trigger: 'change' }
        ],
        text: [
          { required: true, message: '请输入正文', trigger: 'blur' },
          { min: 1, max: 30000, message: '长度不能超过30000个字符', trigger: 'change' }
        ]
      }
    }
  },
  mounted: function () {
    this.ctx = this.$refs.um.getUMCTX()
    this.initData()
  },
  methods: {
    initData () {
      console.log('获取数据...')
      fetch(URL + 'kevin/section.api', this.onInitComplate, 'GET')
    },
    onInitComplate (data) {
      console.log('链接了...', data)
      this.category = data.entity
    },
    onSubmit (formName) {
      this.article.text = this.ctx.getContent()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          fetch(URL + 'kevin/article.api', this.onSubmitComplate, 'POST')
          console.log('submit: ', this.article)
        }
      })
    },
    onSubmitComplate (data) {
      if (data.status === 200) {
        this.$message({
          type: 'success',
          message: '文章已发布可以在首页查看。'
        })
        // this.$refs['sendArticleForm'].resetFields()
      } else {
        this.$message({
          type: 'error',
          message: '出现错误，文章未发布。'
        })
      }
    },
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
