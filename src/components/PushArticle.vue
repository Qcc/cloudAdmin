<template>
  <el-col :span="20">
    <el-form :model="article" :rules="rules" ref="sendArticleForm" size="mini">
      <el-row >
        <el-col :span="22">
          <el-form-item prop="title">
            <el-input v-model="article.title" placeholder='请输入标题'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
          <el-button type="success" plain @click="onSubmit('sendArticleForm')">发布文章</el-button>
        </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="12">
          <el-row>
          <el-col :span="12">
            <el-form-item prop="category">
              <el-select v-model="article.category" placeholder="请选择分类">
                <el-option v-for="item in category" :key="item._id" v-if="item.type === 'article'" :label="item.label" :value="item.path">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">/{{ item.path }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="11" style="float:right">
              <el-form-item prop="author">
                <el-input v-model="article.author" placeholder='请输入作者，默认‘佚名’'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="keyword">
            <el-input v-model="article.keyword" placeholder='请输入关键词，用‘,’分隔'></el-input>
          </el-form-item>
          <el-form-item prop="summary">
            <el-input type="textarea"  :rows="3" v-model="article.summary" placeholder='请输入概要'></el-input>    
          </el-form-item> 
        </el-col>
        <el-col :span="12">
          <el-form-item prop="titleImg" style="text-align: center;">
            <el-upload
              :action="actionUrl"
              list-type="picture-card"
              name="titleImg"
              :limit="limit"
              :on-success="handleonSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i>标题图片</i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item> 
        </el-col>
      </el-row >
      <el-form-item prop="content">
        <Editor ref="E"></Editor>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<script>
import Editor from './Editor'
import {fetch, URL} from '../utils/connect.js'
export default {
  components: {
    Editor
  },
  data () {
    return {
      ctx: null,
      limit: 1,
      actionUrl: URL + 'kevin/upload.api',
      dialogVisible: false,
      dialogImageUrl: '',
      article: {
        title: '',
        author: '',
        titleImg: '',
        category: '',
        keyword: '',
        summary: '',
        content: ''
      },
      category: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 30, message: '长度不能超过5个字符', trigger: 'change' }
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
        content: [
          { required: true, message: '请输入正文', trigger: 'blur' },
          { min: 1, max: 30000, message: '长度不能超过30000个字符', trigger: 'change' }
        ]
      }
    }
  },
  mounted: function () {
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
      this.article.content = this.$refs.E.getContent()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.article.author === '') {
            delete this.article.author
          }
          fetch(URL + 'kevin/article.api', this.onSubmitComplate, 'POST', this.article)
          console.log('submit: ', JSON.stringify(this.article))
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
    handleRemove (file, fileList) {
      this.visibleUpload = true
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      console.log(file)
      console.log(file.url)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleonSuccess (response, file, fileList) {
      console.log(response)
      this.article.titleImg = response.path
    }
  }
}
</script>
