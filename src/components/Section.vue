<template>
  <el-col :span="20">
    <h1>网站栏目管理</h1>
    <el-tree
      :props="defaultProps"
      show-checkbox
      node-key="idx"
      :data="treeData"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </el-col>
</template>
<script>
import {fetch, URL} from '../utils/connect.js'
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
      treeData: [{
        idx: 0,
        label: '网站',
        editble: false,
        sectionName: '',
        btnAdd: '添加',
        btnRename: '重命名',
        children: []
      }],
      currentNode: null
    }
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData () {
      console.log('获取数据...')
      fetch(URL + 'kevin/section.api', this.onInitComplate, 'GET')
    },
    copyArray (target, source) {
      source.forEach(function (item) {
        target.push({
          btnAdd: item.btnAdd,
          btnRename: item.btnRename,
          children: item.children,
          editble: item.editble,
          idx: item.idx,
          label: item.label,
          sectionName: item.sectionName
        })
      })
    },
    // 交换相邻兄弟的位置
    changeTree (current, brother) {
      var temp = {}
      var temp1 = {}
      temp.label = current.label
      temp.children = current.children.concat()
      temp1.children = brother.children.concat()
      current.label = brother.label
      current.children = []
      this.copyArray(current.children, temp1.children)
      brother.label = temp.label
      brother.children = []
      this.copyArray(brother.children, temp.children)
    },
    append (node, data) {
      console.log(node, data)
      data.editble = true
      const section = data.children.findIndex(d => d.label === data.sectionName)
      if (section !== -1) {
        this.$message.error('分类已存在,请重新输入！')
        return
      }
      if (data.sectionName === '') {
        data.btnAdd = '保存'
      } else {
        var newChild = {
          idx: data.children.length,
          level: data.children.length,
          editble: false,
          sectionName: '',
          btnAdd: '添加',
          btnRename: '重命名',
          label: data.sectionName,
          children: []
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        data.editble = false
        data.sectionName = ''
        data.btnAdd = '添加'
        data.btnRename = '重命名'
        newChild.parent = null
        if (node.level > 1) {
          newChild.parent = {label: data.label, level: data.level, parentId: data._id}
        }
        this.currentNode = data.children[data.children.length - 1]
        fetch(URL + 'kevin/section.api', this.onAddComplate, 'POST',
        {label: newChild.label, level: newChild.level, parent: newChild.parent})
      }
    },
    // 补全前端自用属性
    localAttr (arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].editble = false
        arr[i].sectionName = ''
        arr[i].btnAdd = '添加'
        arr[i].btnRename = '重命名'
        arr[i].children = []
        console.log(arr)
      }
    },
    onInitComplate (data) {
      console.log('链接了...', data)
      this.localAttr(data.entity)
      var tree = data.entity.sort(function (a, b) {
        return a.level - b.level
      })
      while (tree.length !== 0) {
        for (let i = 0; i < tree.length; i++) {
          console.log('i ', i)
          if (tree[i].parent === null) {
            this.treeData[0].children.push(tree[i])
            tree.splice(i, 1)
            i-- // 删除元素后导致循环跳过某些元素 --补偿
          }
        }
        for (let i = 0; i < tree.length; i++) {
          for (let j = 0; j < this.treeData[0].children.length; j++) {
            if (tree[i].parent.parentId === this.treeData[0].children[j]._id) {
              this.treeData[0].children[j].children.push(tree[i])
              tree.splice(i, 1)
              if (tree.length === 0) {
                break
              }
            }
          }
        }
      }
      // for (let i = 0; i < tree.length; i++) {
      //   console.log('tree.level ', tree[i].level)
      //   if (tree[i].parent === null) {
      //     this.treeData[0].children.push(tree[i])
      //   } else {
      //     for (let j = 0; j < this.treeData[0].children.length; j++) {
      //       if (tree[i].parent.parentId === this.treeData[0].children[j]._id) {
      //         this.treeData[0].children[j].children.push(tree[i])
      //       }
      //     }
      //   }
      // }
    },
    activeDate (data) {
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '操作失败，获取数据失败'
        })
        console.log('post', data)
        this.treeData[0].children = []
        this.initData()
      }
    },
    onAddComplate (data) {
      if (data.status === 200) {
        this.$set(this.currentNode, '_id', data.entity._id)
      }
      this.activeDate(data)
    },
    onDeleteComplate (data) {
      this.activeDate(data)
    },
    onUpdateComplate (data) {
      this.activeDate(data)
    },
    onRemoveComplate (data) {
      this.activeDate(data)
    },
    onUpmoveComplate (data) {
      this.activeDate(data)
    },
    onDownmoveComplate (data) {
      this.activeDate(data)
    },
    onRenameComplate (data) {
      this.activeDate(data)
    },
    remove (node, data) {
      console.log(node, data)
      const treeDate = node.parent.data.children
      const index = treeDate.findIndex(d => d.idx === data.idx)
      if (data.children && data.children.length !== 0) {
        this.$message.error('该目录不为空，不能删除！')
      } else {
        this.$confirm('您确认要删除该目录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          treeDate.splice(index, 1)
          fetch(URL + 'kevin/section.api', this.onRemoveComplate, 'DELETE', {_id: data._id})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    upMove (node, data) {
      const parent = node.parent.data.children
      const index = parent.findIndex(d => d.idx === data.idx)
      if (data.idx === parent[0].idx) {
        this.$message.error('分类已处于首位！')
      } else {
        var target = parent[index]
        var source = parent[index - 1]
        this.changeTree(parent[index], parent[index - 1])
        fetch(URL + 'kevin/section.api', this.onUpmoveComplate, 'PUT',
        {source: {_id: source._id, level: source.level}, target: {_id: target._id, level: target.level}})
      }
    },
    downMove (node, data) {
      const parent = node.parent.data.children
      const index = parent.findIndex(d => d.idx === data.idx)
      if (data.idx === parent[parent.length - 1].idx) {
        this.$message.error('分类已处于末位！')
      } else {
        var target = parent[index]
        var source = parent[index + 1]
        this.changeTree(parent[index], parent[index + 1])
        fetch(URL + 'kevin/section.api', this.onDownmoveComplate, 'PUT',
        {source: {_id: source._id, level: source.level}, target: {_id: target._id, level: target.level}})
      }
    },
    reName (node, data) {
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
        fetch(URL + 'kevin/section.api', this.onRenameComplate, 'PUT',
        {_id: data._id, sectionName: data.sectionName})
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
