<template>
  <el-form :model="article" :rules="rules" ref="sendArticleForm" size="mini">
    <el-row >
      <el-col :span="20">
        <el-form-item prop="title">
          <el-input v-model="article.title" autofocus placeholder='请输入标题'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button type="success" plain @click="onSubmit('sendArticleForm')">保存</el-button>
          <el-button type="error" plain @click="cancle">取消</el-button>          
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
              :options="columns"
              :props="props"
              v-model="categoryValue">
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
            :file-list="fileList"
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
      <Editor :content="modArticle.content" ref="E"></Editor>
    </el-form-item>
  </el-form>
</template>
<script>
import Editor from './Editor'
import {fetch, URL} from '../utils/connect.js'
export default {
  props: {
    modArticle: {type: Object},
    columns: {type: Array}
  },
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
      fileList: [],
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
    this.article = this.modArticle
    this.keyword = this.modArticle.keyword.join()
    this.article.keyword = this.modArticle.keyword
    this.visibleKeyword = false
    if (this.modArticle.titleImg) {
      this.fileList.push({url: URL + this.modArticle.titleImg})
    }
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i]._id === this.article.categoryId) {
        this.categoryValue.push(this.article.categoryId)
        break
      }
      if (this.columns[i].children !== undefined) {
        for (var j = 0; j < this.columns[i].children.length; j++) {
          if (this.columns[i].children[j]._id === this.article.categoryId) {
            this.categoryValue.push(this.columns[i]._id, this.columns[i].children[j]._id)
            break
          }
        }
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.article.content = this.$refs['E'].getContent()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = this.$loading({
            lock: true,
            text: '修改中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          if (this.article.author === '') {
            delete this.article.author
          }
          this.article.categoryId = this.categoryValue[this.categoryValue.length - 1]
          for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i]._id === this.article.categoryId) {
              this.article.categoryLabel = this.columns[i].label
              this.article.categoryPath = this.columns[i].path
              break
            }
            if (this.columns[i].children !== undefined) {
              for (var j = 0; j < this.columns[i].children.length; j++) {
                if (this.columns[i].children[j]._id === this.article.categoryId) {
                  this.article.categoryLabel = this.columns[i].children[j].label
                  this.article.categoryPath = this.columns[i].children[j].path
                  break
                }
              }
            }
          }
          fetch(URL + 'kevin/article.api', this.onSubmitComplate, 'PUT', this.article)
        }
      })
    },
    cancle () {
      this.$emit('cancleEdit')
    },
    onSubmitComplate (data) {
      this.loading.close()
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '数据库错误。'
        })
      }
      this.$emit('cancleEdit')
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
