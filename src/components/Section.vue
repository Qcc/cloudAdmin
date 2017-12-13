<template>
  <el-col :span="20">
    <h1>网站栏目管理</h1>
    <el-tree
      :props="defaultProps"
      show-checkbox
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
        addble: false, // 添加新目录input
        editble: false, // 重命名目录input
        sectionName: '', // 添加,重命名input字段
        sectionPath: '', // 添加重命名 路径字段
        sectionType: 'article',
        path: '',
        type: '',
        btnAdd: '添加', // 添加按钮
        btnRename: '重命名' // 重命名按钮
      },
      treeData: [{
        // idx: 0,
        label: '网站',
        path: 'root',
        addble: false,
        editble: false, // 重命名目录input
        sectionName: '',
        sectionType: '',
        type: 'article',
        sectionPath: '', // 添加重命名 路径字段
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
          addble: item.addble,
          editble: item.editble,
          _id: item._id,
          path: item.path,
          type: item.type,
          level: item.level,
          label: item.label,
          sectionName: item.sectionName,
          sectionType: item.sectionType,
          sectionPath: item.sectionPath
        })
      })
    },
    // 交换相邻兄弟的位置
    changeTree (current, brother) {
      var temp = {}
      var temp1 = {}
      temp.label = current.label
      temp._id = current._id
      temp.path = current.path
      temp.type = current.type
      temp.editble = current.editble
      temp.level = current.level
      temp.children = current.children.concat()
      temp1.children = brother.children.concat()
      current.label = brother.label
      current.level = brother.level
      current._id = brother._id
      current.path = brother.path
      current.type = brother.type
      current.editble = brother.editble
      current.children = []
      this.copyArray(current.children, temp1.children)
      brother.label = temp.label
      brother._id = temp._id
      brother.path = temp.path
      brother.type = temp.type
      brother.editble = temp.editble
      brother.level = temp.level
      brother.children = []
      this.copyArray(brother.children, temp.children)
    },
    append (node, data) {
      if (!data.addble) {
        data.addble = true
        data.editble = false
        data.sectionPath = ''
        data.sectionType = data.type
        data.sectionName = ''
        data.btnAdd = '保存'
        data.btnRename = '重命名'
        return
      }
      const section = data.children.findIndex(d => d.label === data.sectionName)
      const path = data.children.findIndex(d => d.label === data.sectionPath)
      if (section !== -1 || path !== -1) {
        this.$message.error('分类或路径已存在,请重新输入！')
        return
      }
      if (data.sectionName === '' || data.sectionPath === '') {
        this.$message.error('分类或路径不能为空,请重新输入！')
        return
      }
      var newChild = {
        level: data.children.length,
        addble: false,
        editble: false,
        sectionName: '',
        sectionPath: '',
        btnAdd: '添加',
        btnRename: '重命名',
        path: data.sectionPath,
        label: data.sectionName,
        type: data.sectionType,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      data.addble = false
      data.editble = false
      data.sectionName = ''
      data.sectionPath = ''
      data.sectionType = 'article'
      data.btnAdd = '添加'
      data.btnRename = '重命名'
      newChild.parent = null
      if (node.level > 1) {
        newChild.parent = data._id
      }
      this.currentNode = data.children[data.children.length - 1]
      fetch(URL + 'kevin/section.api', this.onAddComplate, 'POST',
      {label: newChild.label, level: newChild.level, type: newChild.type, path: newChild.path, parent: newChild.parent})
    },
    // 补全前端自用属性
    localAttr (arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].addble = false
        arr[i].editble = false
        arr[i].sectionName = ''
        arr[i].sectionPath = ''
        arr[i].sectionType = 'article'
        arr[i].btnAdd = '添加'
        arr[i].btnRename = '重命名'
        arr[i].children = []
      }
    },
    onInitComplate (data) {
      console.log('链接了...', data)
      this.localAttr(data.entity)
      var tree = data.entity.sort(function (a, b) {
        return a.level - b.level
      })
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].parent === null) {
          this.treeData[0].children.push(tree[i])
          tree.splice(i, 1)
          i-- // 删除元素后导致循环跳过某些元素 --补偿
        }
      }
      for (let j = 0; j < tree.length; j++) {
        for (let k = 0; k < this.treeData[0].children.length; k++) {
          if (tree[j].parent === this.treeData[0].children[k]._id) {
            this.treeData[0].children[k].children.push(tree[j])
            tree.splice(j, 1)
            j--
            break
          }
        }
      }
    },
    activeDate (data) {
      if (data.status !== 200) {
        this.$message({
          type: 'error',
          message: '操作失败，获取数据失败'
        })
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
      const index = treeDate.findIndex(d => d._id === data._id)
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
      const index = parent.findIndex(d => d._id === data._id)
      if (data._id === parent[0]._id) {
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
      const index = parent.findIndex(d => d._id === data._id)
      if (data._id === parent[parent.length - 1]._id) {
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
      if (!data.editble) {
        data.addble = false
        data.editble = true
        data.sectionPath = data.path
        data.sectionType = data.type
        data.sectionName = data.label
        data.btnRename = '保存'
        data.btnAdd = '添加'
        return
      }
      const parent = node.parent.data.children
      const section = parent.filter(d => d.label === data.sectionName)
      const path = parent.filter(d => d.path === data.sectionPath)
      console.log('section ', section.length, ' path ', path.length)
      if (section.length >= 1 || path.length >= 1) {
        this.$message.error('分类或路径已存在,请重新输入！')
        return
      }
      if (data.sectionName === '' || data.sectionPath === '') {
        this.$message.error('分类或路径不能为空,请重新输入！')
      } else {
        fetch(URL + 'kevin/section.api', this.onRenameComplate, 'PUT',
        {_id: data._id, sectionType: data.sectionType, sectionName: data.sectionName, sectionPath: data.sectionPath})
        data.label = data.sectionName
        data.path = data.sectionPath
        data.type = data.sectionType
        data.editble = false
        data.sectionName = ''
        data.sectionPath = ''
        data.btnRename = '重命名'
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span >
            <span v-show={data.type === 'article'} class='iconfont icon-wenzhang' style="margin-right:10px;"></span>
            <span v-show={data.type === 'picture'} class='iconfont icon-picture' style="margin-right:10px;"></span>
            <span v-show={data.type === 'video'} class='iconfont icon-shipin' style="margin-right:10px;"></span>
            <span>{data.label} - /{data.path}</span>
          </span>
          <span>
            {data.addble ? <span>
            <el-input placeholder="请输入内容" style="width:200px;padding-right: 2px;" maxlength={4} autofocus clearable size="mini" v-model={data.sectionName} >
              <el-select style="width:70px;" v-model={data.sectionType} slot="prepend" placeholder="类型">
                <el-option label="文章" default value="article"></el-option>
                <el-option label="图片" value="picture"></el-option>
                <el-option label="视频" value="video"></el-option>
              </el-select>
            </el-input>
            <el-input style="width:100px;padding-right: 8px;" maxlength={40} autofocus clearable size="mini" v-model={data.sectionPath} placeholder="请输入路径"></el-input></span> : ''}
            {data.editble ? <span>
            <el-input placeholder="请输入内容" style="width:200px;padding-right: 2px;" maxlength={4} autofocus clearable size="mini" v-model={data.sectionName} >
              <el-select style="width:70px;" v-model={data.sectionType} slot="prepend" placeholder="类型">
                <el-option label="文章" default value="article"></el-option>
                <el-option label="图片" value="picture"></el-option>
                <el-option label="视频" value="video"></el-option>
              </el-select>
            </el-input>
            <el-input style="width:100px;padding-right: 8px;" maxlength={40} autofocus clearable size="mini" v-model={data.sectionPath} placeholder="请输入路径"></el-input></span> : ''}
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
