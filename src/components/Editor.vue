<template>
    <div>
        <div id="editorElem" style="text-align:left;"></div>
    </div>
</template>

<script>
  import {URL} from '../utils/connect.js'
  import E from 'wangeditor-code'
  export default {
    name: 'editor',
    props: {
      content: {type: String}
    },
    data () {
      return {
        editor: null
      }
    },
    methods: {
      getContent () {
        return this.editor.txt.html()
      },
      clearContent () {
        this.editor.txt.clear()
      }
    },
    mounted () {
      var editor = new E('#editorElem')
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.customConfig.zIndex = 1
      editor.customConfig.uploadImgMaxLength = 1
      editor.customConfig.uploadImgServer = URL + 'kevin/upload.api'
      editor.customConfig.uploadFileName = 'titleImg'
      editor.customConfig.codeLanguage = [
        'PHP',
        'css',
        'html',
        'javascript',
        'java',
        'csharp',
        'cpp',
        'c',
        'python',
        'aspnet',
        'json',
        'bash',
        'ruby',
        'lua',
        'sql',
        'swift',
        'docker',
        'objectivec'
      ]
      editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          // 图片 上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = URL + result.path
          insertImg(url)
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      editor.create()
      if (this.content) {
        editor.txt.html(this.content)
      }
      this.editor = editor
    }
  }
</script>