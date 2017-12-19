<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
        // editorId: Math.random() * 10000000000000000
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted () {
      const _this = this
      this.editor = window.UM.getEditor('editor', this.config) // 初始化UE
      this.editor.addListener('ready', function () {
        _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      })
    },
    methods: {
      getUMCTX () { // 获取内容方法
        return this.editor
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>