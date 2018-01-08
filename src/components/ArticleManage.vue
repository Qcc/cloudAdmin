<template>
  <el-col :span="20">
    <div v-if="editing" class="article-box">
      <el-col :span="4" style="margin-bottom:10px">
        <el-cascader
          class="search-article-type"
          placeholder="请选择分类"
          clearable
          change-on-select
          :options="category"
          :props="props"
          @change="selectColumnsType">
        </el-cascader>
      </el-col>
      <el-col :span="16">
        <el-input v-model="search" class="search-article-input" clearable placeholder="请输入标题"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="onSearchArticle" class="search-article-btn" type="primary" plain icon="el-icon-search">搜索文章</el-button>
      </el-col>
      <el-col :span="24">
        <div v-if="articles.length === 0" class="no-articles">
          <h4>没有文章可修改～！</h4>
        </div>
      </el-col>
      <el-col :span="24">
        <ul class="article-list">
          <li v-for="item in articles" :key="item._id">
            <article-box :article="item" @delete="deleteArticle" @edit="editArticle"></article-box>
          </li>
        </ul>
      </el-col>
    </div>
    <edit-article v-if="!editing" :modArticle="article" :columns="category" @cancleEdit="cancle"></edit-article>
    <div v-if="editing" class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 200, 1000]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
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
      categoryId: '',
      articles: [],
      article: {},
      category: [],
      limit: 10,
      count: 0,
      search: '',
      categoryValue: [],
      props: {
        label: 'label',
        value: '_id',
        children: 'children'
      }
    }
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData () {
      var params = `search=${this.search}&type=${this.categoryId}&currentPage=${this.currentPage - 1}&limit=${this.limit}`
      // var params = {type: this.column, currentPage: this.currentPage, limit: this.limit}
      fetch(URL + 'kevin/article.api?' + params, this.onInitComplate, 'GET')
    },
    onInitComplate (data) {
      console.log('获取数据...', data)
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '操作失败，获取数据失败'
        })
        return
      }
      this.count = data.entity.articlesCount
      this.articles = data.entity.articles
      this.category = []
      for (var i = 0; i < data.entity.columns.length; i++) {
        if (data.entity.columns[i].type !== 'article') {
          continue
        }
        if (data.entity.columns[i].parent === null) {
          this.category.push(data.entity.columns[i])
        } else {
          for (var j = 0; j < this.category.length; j++) {
            if (data.entity.columns[i].parent === this.category[j]._id) {
              if (!this.category[j].children) {
                this.category[j].children = []
              }
              this.category[j].children.push(data.entity.columns[i])
              break
            }
          }
        }
      }
    },
    handleSizeChange (val) {
      this.limit = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initData()
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
    },
    selectColumnsType (value) {
      if (value.length === 0) {
        this.categoryId = ''
      } else {
        this.categoryId = value[value.length - 1]
      }
      this.initData()
    },
    // 模糊查询标题
    onSearchArticle () {
      if (this.search === '') {
        this.$message({
          type: 'error',
          message: '请输入标题！'
        })
      } else {
        this.initData()
      }
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
.search-article-btn{
  border-radius: 0 5px 5px 0;
}
.search-article-input input{
  border-radius: 0;
}
.search-article-type input{
  border-radius: 5px 0 0 5px;
}
.no-articles{
  text-align: center;
  height: 100px;
}
.no-articles>h4{
  line-height: 100px;
}
</style>
