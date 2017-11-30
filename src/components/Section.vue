<template>
  <el-col :span="20">
    <h1>网站栏目管理</h1>
    <el-tree
      :props="defaultProps"
      show-checkbox
      node-key="id"
      lazy
      :load="loadTree"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </el-col>
</template>
<script>
let id = 1000
export default {
  name: 'Section',
  data () {
    return {
      addSection: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
        level: 0
      },
      count: 1
    }
  },
  methods: {
    loadTree (node, resolve) {
      console.log(node)
      if (node.level === 0) {
        return resolve([{label: '网站'}])
      }
      if (node.level > 2) return resolve([])
      setTimeout(() => {
        var section = [{
          id: 2,
          label: '科技',
          children: [{
            id: 3,
            label: '手机'
          }, {
            id: 4,
            label: '智能手机'
          }, {
            id: 5,
            label: '电脑'
          }]}, {
            id: 6,
            label: '图片',
            children: [{
              id: 7,
              label: '动态'
            }, {
              id: 8,
              label: '风景'
            }, {
              id: 9,
              label: '壁纸'
            }]}, {
              id: 4,
              label: '热点',
              children: [{
                id: 4,
                label: '推荐'
              }]}]
        return resolve(section)
      }, 500)
    },
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-input style="width:100px;padding-right: 8px;" size="mini" v-model="addSection" placeholder="请输入类目"></el-input>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>添加</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>上移</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>下移</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>
<style>

</style>
