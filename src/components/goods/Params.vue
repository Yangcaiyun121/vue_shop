<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb s>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cate-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            clearable
            :props="{ expandTrigger: 'hover', ...cateProps }"
            @change="cateChanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%">
            <!-- 展开行 -->
             <el-table-column type="expand" width="180"> 
                <template slot-scope = "scope">
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true">{{item}}</el-tag>
                </template>
             </el-table-column>
            <el-table-column type="index" width="180"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="index" width="180"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + addText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="addText" prop="attr_name" >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      selectedCateKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    isbtnDisabled() {
      return this.selectedCateKeys.length !== 3
    },
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    addText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      this.catelist = res.data
      console.log(res.data)
    },
    cateChanged() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsDate()
    },
    // 获取参数列表数据
    async getParamsDate() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        this.$message.error('获取参数信息失败！')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals?item.attr_vals.split(','):[]
      });
      console.log(res.data)
      if (this.activeName == 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleClick() {
      this.getParamsDate()
    },
    // 对话框关闭函数
    handleClose() {
        this.$refs.addFormRef.resetFields()
    },
    addParams(){
        this.$refs.addFormRef.validate(async valid=>{
            if(!valid)return 
            const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                attr_name:this.addForm.attr_name,
                attr_sel:this.activeName
            })
            if(res.meta.status !== 201){
                return this.$message.error('添加参数失败！')
            }
            this.$message.success('添加参数成功！')
            this.addDialogVisible =false
            this.getParamsDate()
        })
    }
  },
}
</script>

<style lang="less" scoped>
.cate-opt {
  margin: 15px 0;
}
.el-tag {
    margin: 15px;
}
</style>