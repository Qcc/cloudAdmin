<template>
  <el-col :span="20">
    <h1>文章管理</h1>
    <div class="article-box">
      <ul class="article-list">
        <li>
          <div class="article-content">
            <div class="left-img">
              <a><img src="http://127.0.0.1:3001/uploads/201812/7v337frwgut9v6vz.JPEG"/></a>
            </div>
            <div class="right-news">
              <div class="article-delete" title="删除">×</div>
              <div class="article-title">
                <a href="#">大法师更多发改大法官地方个地方个地方高飞的个地方个地方个</a>
              </div>
              <div class="article-edit iconfont icon-wenzhang" title="编辑"></div>              
            </div>
          </div>
        </li>
        <li>
          <div class="article-content">
            <div class="left-img">
              <a><img src="http://127.0.0.1:3001/uploads/201812/7v337frwgut9v6vz.JPEG"/></a>
            </div>
            <div class="right-news">
              <div class="article-title">
                <a href="#">ffghfghfgh浮动和广士大夫商店士大夫商店发射的发泛的个地方个地方个地方更多个士大夫到沙发</a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="pagination">
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
export default {
  data () {
    return {
      currentPage: 4
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style>
.article-box{
  width: 100%;
}
.article-list{
}
.article-list li{
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}
.article-title{
  display: block;
  font-size: 20px;
  line-height: 1.3;
  margin-bottom: 4px;
  font-weight: 300;
  max-height: 80px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-content{
  height: 102px;
  width: 500px;
  position: relative;
  padding: 10px 0;
  /* border-bottom: 1px solid #e8e8e8; */
  box-shadow: 1px 1px 1px 1px rgba(120,120,120,0.2);
}
.article-content:hover{
  box-shadow: 1px 1px 2px 2px rgba(120,120,120,0.4);
}
.left-img{
  width: 158px;
  height: 102px;
  margin-right: 16px;
  float: left;
  overflow: hidden;
  position: relative;
}
.left-img>a>img{
  display: inline-block;
  max-width: 100%;
  height: auto;
  vertical-align: middle;
  transition: all .5s ease-out .1s;
}
.right-news{
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.article-title{
  display: block;
  font-size: 20px;
  line-height: 1.3;
  margin-bottom: 4px;
  font-weight: 300;
  max-height: 80px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-content:hover .article-delete,.article-content:hover .article-edit{
  font-size: 20px
}
.article-delete{
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
}
.article-edit{
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  font-size: 16px;  
  right: 10px;
}
.pagination{
  clear: both;
}
</style>
