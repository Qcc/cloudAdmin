<template>
  <div id="app">
    <div class="top-nav">dingbu</div>
    <el-row >
      <el-col :span="4">
        <Nav-bar/>
      </el-col>
      <router-view class="content-style"/>
    </el-row>
  </div>
</template>

<script>
import Navbar from '@/components/Nav'
export default {
  name: 'app',
  components: {
    'Nav-bar': Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.top-nav{
  height: 60px;
  padding: 0 20px;
  margin: 0 auto;
  box-shadow: 3px 3px 3px 0 #ddd;
}
html {overflow-y:scroll;} 
body {margin:0; padding:0;
  font-family: PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Arial,sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #657180;
  background:#ffffff;
  } 
div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,blockquote,p{padding:0; margin:0;} 
table,td,tr,th{font-size:12px;} 
li{list-style-type:none;} 
img{vertical-align:top;border:0;} 
ol,ul {list-style:none;} 
h1,h2,h3,h4,h5,h6{font-size:14px; font-weight:normal;} 
address,cite,code,em,th,span {font-weight:normal; font-style:normal;}
a{ 
  color: #222;
  background: 0 0;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
  transition: color .2s ease;
}
.content-style{
  padding: 15px;
}
</style>
