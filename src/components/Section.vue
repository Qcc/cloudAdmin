<template>
  <el-col :span="20">
    <h1>网站栏目管理</h1>
    <el-tree
      :props="defaultProps"
      show-checkbox
      node-key="id"
      :data="data"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </el-col>
</template>
<script>
export default {
  name: 'Section',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        editble: false, // 控制input框是否显示
        sectionName: '', // 添加,重命名input字段
        btnAdd: '添加', // 添加按钮
        btnRename: '重命名' // 重命名按钮
      },
      data: [{
        id: 0,
        label: '网站',
        editble: false,
        sectionName: '',
        btnAdd: '添加',
        btnRename: '重命名',
        children: []
      }]
    }
  },
  methods: {
    append (node, data) {
      console.log('添加', node, data)
      data.editble = true
      const section = data.children.findIndex(d => d.label === data.sectionName)
      if (section !== -1) {
        this.$message.error('分类已存在,请重新输入！')
        return
      }
      if (data.sectionName === '') {
        data.btnAdd = '保存'
      } else {
        const newChild = { id: data.children.length, editble: false, sectionName: '', btnAdd: '添加', btnRename: '重命名', label: data.sectionName, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        data.editble = false
        data.sectionName = ''
        data.btnAdd = '添加'
        data.btnRename = '重命名'
      }
    },
    remove (node, data) {
      console.log('删除', node, data)
      const treeDate = node.parent.data.children
      const index = treeDate.findIndex(d => d.id === data.id)
      if (data.children.length !== 0) {
        this.$message.error('该目录不为空，不能删除！')
      } else {
        treeDate.splice(index, 1)
      }
    },
    upMove (node, data) {
      console.log('上移', node, data)
      const parent = node.parent.data.children
      const index = parent.findIndex(d => d.id === data.id)
      console.log(index)
      if (index === 0) {
        this.$message.error('分类已处于首位！')
      } else {
        let temp = JSON.parse(JSON.stringify(data))
        parent[index] = JSON.parse(JSON.stringify(parent[index - 1]))
        parent[index - 1] = temp
      }
    },
    downMove (node, data) {
      console.log('下移', node, data)
    },
    reName (node, data) {
      console.log('重命名', node, data)
      data.editble = true
      const parent = node.parent.data.children
      const section = parent.findIndex(d => d.label === data.sectionName)
      if (section !== -1) {
        this.$message.error('分类已存在,请重新输入！')
        return
      }
      if (data.sectionName === '') {
        data.btnRename = '保存'
      } else {
        data.label = data.sectionName
        data.editble = false
        data.sectionName = ''
        data.btnRename = '重命名'
        data.btnAdd = '添加'
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            {data.editble ? <el-input style="width:100px;padding-right: 8px;" maxlength={4} autofocus clearable size="mini" v-model={data.sectionName} placeholder="请输入类目"></el-input> : ''}
            <el-button style="font-size: 12px;" type="text" v-show={!node.isLeaf || node.level < 3} on-click={ () => this.append(node, data) }>{data.btnAdd}</el-button>
            <el-button style="font-size: 12px;" type="text" v-show={node.level > 1} on-click={ () => this.upMove(node, data) }>上移</el-button>
            <el-button style="font-size: 12px;" type="text" v-show={node.level > 1} on-click={ () => this.downMove(node, data) }>下移</el-button>
            <el-button style="font-size: 12px;" type="text" v-show={node.level > 1} on-click={ () => this.reName(node, data) }>{data.btnRename}</el-button>
            <el-button style="font-size: 12px;" type="text" v-show={node.level > 1} on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>
<style>

</style>
