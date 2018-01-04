<template>
  <div class="article-content">
    <div class="left-img">
      <a target="_blank" :href="url+arti.categoryPath+'/'+arti._id+'.html'">
        <img alt="无题图" :src="url + arti.titleImg"/>
      </a>
    </div>
    <div class="right-news">
      <div class="article-delete" @click="deleteArticle" title="删除">×</div>
      <div class="article-title">
        <a target= "_blank" :href="url+arti.categoryPath+'/'+arti._id+'.html'">{{arti.title}}</a>
      </div>
      <div class="article-edit iconfont icon-wenzhang" @click="editArticle" title="编辑"></div>              
    </div>
  </div>
</template>
<script>
import {URL} from '../utils/connect.js'
export default {
  props: {
    article: {type: Object}
  },
  data () {
    return {
      arti: this.article,
      url: URL
    }
  },
  methods: {
    deleteArticle () {
      this.$emit('delete', this.article)
    },
    editArticle () {
      this.$emit('edit', this.article)
    }
  }
}
</script>
<style>
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
  transition: all .4s;
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
.article-delete:hover,.article-edit:hover{
  color:#4777FF;
  zoom:1;
  transform: scale(1.5);
  transition: all .4s;
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
