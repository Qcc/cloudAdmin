<template>
  <el-col :span="20">
    <el-form :model="article" :rules="rules" ref="sendArticleForm" size="mini">
      <el-row >
        <el-col :span="22">
          <el-form-item prop="title">
            <el-input v-model="article.title" autofocus placeholder='请输入标题'></el-input>
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
            <el-form-item prop="categoryId">
              <el-cascader
                placeholder="请选择分类"
                clearable
                change-on-select
                :options="category"
                :props="props"
                v-model="categoryValue"
                @change="categoryChange">
              </el-cascader>
            </el-form-item>
          </el-col>
            <el-col :span="11" style="float:right">
              <el-form-item prop="author">
                <el-input v-model="article.author" placeholder='请输入作者，默认‘佚名’'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="keyword">
            <el-input v-model="keyword" ref="keywordfocus" v-show="visibleKeyword" @blur="keywordBlur" placeholder='请输入关键词，用 空格 或 逗号 分隔'></el-input>
            <div v-if="!visibleKeyword">
              <el-tag
                style="margin-right:4px"
                v-for="(tag, index) in article.keyword"
                @close="editKeyword"
                :type="keywordType[index]"
                :key="tag"
                closable>
                {{tag}}
              </el-tag>
            </div>
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
              ref="uploadTitleImg"
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
      loading: null,
      visibleKeyword: true, // 标签可编辑
      keyword: '',
      keywordType: ['', 'success', 'info', 'warning', 'danger'], // 标签样式
      article: {
        title: '',
        author: '',
        titleImg: '',
        categoryId: '',
        categoryPath: '',
        categoryLabel: '',
        keyword: [],
        summary: '',
        content: ''
      },
      categoryValue: [],
      category: [],
      props: {
        label: 'label',
        value: '_id',
        children: 'children'
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入概要', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入正文', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData () {
      fetch(URL + 'kevin/section.api', this.onInitComplate, 'GET')
    },
    onInitComplate (data) {
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '出现错误，加载分类失败。'
        })
        return
      }
      for (var i = 0; i < data.entity.length; i++) {
        if (data.entity[i].type !== 'article') {
          continue
        }
        if (data.entity[i].parent === null) {
          this.category.push(data.entity[i])
        } else {
          for (var j = 0; j < this.category.length; j++) {
            if (data.entity[i].parent === this.category[j]._id) {
              if (!this.category[j].children) {
                this.category[j].children = []
              }
              this.category[j].children.push(data.entity[i])
              break
            }
          }
        }
      }
    },
    onSubmit (formName) {
      this.article.content = this.$refs['E'].getContent()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          if (this.article.author === '') {
            delete this.article.author
          }
          fetch(URL + 'kevin/article.api', this.onSubmitComplate, 'POST', this.article)
        }
      })
    },
    onSubmitComplate (data) {
      this.loading.close()
      if (data.status === 200) {
        this.$message({
          type: 'success',
          message: '文章已发布可以在首页查看。'
        })
        this.$refs['sendArticleForm'].resetFields()
        this.$refs['uploadTitleImg'].clearFiles()
        this.$refs['E'].clearContent()
        this.keyword = ''
        this.visibleKeyword = true
        this.categoryValue = []
      } else {
        this.$message({
          type: 'error',
          message: '出现错误，文章未发布。'
        })
      }
    },
    categoryChange (value) {
      this.article.categoryId = value[value.length - 1]
      for (let i = 0; i < this.category.length; i++) {
        if (this.category[i]._id === this.article.categoryId) {
          this.article.categoryLabel = this.category[i].label
          this.article.categoryPath = this.category[i].path
          return
        }
      }
    },
    // 关键词数组
    keywordBlur (event) {
      console.log('event ', event)
      if (event.target.value !== '') {
        this.article.keyword = []
        if (event.target.value.indexOf(' ') !== -1) {
          this.article.keyword = event.target.value.split(' ')
        } else if (event.target.value.indexOf(',') !== -1) {
          this.article.keyword = event.target.value.split(',')
        } else if (event.target.value.indexOf('，') !== -1) {
          this.article.keyword = event.target.value.split('，')
        } else {
          this.article.keyword.push(event.target.value)
        }
        this.visibleKeyword = false
      }
    },
    editKeyword (e) {
      this.visibleKeyword = true
    },
    handleRemove (file, fileList) {
      this.visibleUpload = true
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleonSuccess (response, file, fileList) {
      this.article.titleImg = response.path
    }
  }
}
</script>
