<template>
  <el-col :span="20">
    <div v-if="editing" class="article-box">
      <ul class="article-list">
        <li v-for="item in articles" :key="item._id">
          <article-box :article="item" @delete="deleteArticle" @edit="editArticle"></article-box>
        </li>
      </ul>
    </div>
    <edit-article v-if="!editing" :modArticle="article" @cancleEdit="cancle"></edit-article>
    <div v-if="editing" class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </el-col>
</template>
<script>
import ArticleBox from './ArticleBox'
import EditArticle from './EditArticle'
import {fetch, URL} from '../utils/connect.js'
export default {
  components: {
    ArticleBox,
    EditArticle
  },
  data () {
    return {
      editing: true,
      currentPage: 1,
      columns: null,
      articles: [],
      article: {}
    }
  },
  mounted: function () {
    this.initData(this.columns)
  },
  methods: {
    initData (params) {
      console.log('获取数据...')
      fetch(URL + 'kevin/article.api', this.onInitComplate, 'GET', params)
    },
    onInitComplate (data) {
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '操作失败，获取数据失败'
        })
        return
      }
      this.articles = data.entity
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    deleteArticle (event) {
      this.$confirm('您确认要删除 [ ' + event.title + ' ] 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetch(URL + 'kevin/article.api', this.onRemoveComplate, 'DELETE', {id: event._id}, event)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    cancle (e) {
      this.editing = true
    },
    onRemoveComplate (data, event) {
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '操作失败，文章未删除'
        })
      } else {
        for (var i = 0; i < this.articles.length; i++) {
          if (this.articles[i]._id === event._id) {
            this.articles.splice(i, 1)
            break
          }
        }
      }
    },
    editArticle (event) {
      this.editing = false
      this.article = event
      console.log('当前id:', event)
    }
  }
}
</script>
<style>
.article-box{
  width: 100%;
}
.article-list li{
  margin-right: 15px;
  margin-bottom: 10px;
  float: left;
}
</style>
