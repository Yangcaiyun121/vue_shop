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
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot-scope="scope" slot="isok">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot-scope="scope" slot="level">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close = "addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            clearable
            
            :props="{expandTrigger:'hover',checkStrictly:'true',...cascaderProps}"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
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
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          //   将当前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '等级',
          prop: 'cat_level',
          //   将当前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'level',
        },
        {
          label: '操作',
          //   将当前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'opt',
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入父级名称', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      selectedKeys:[],
      cascaderProps:{
        
        value:'cat_id',
        label:'cat_name',
        children:'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败！')
      }
      console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(value) {
      this.queryInfo.pagesize = value
      this.getCateList()
    },
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value
      this.getCateList()
    },
    showAddDialogVisible() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级列表失败!')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChanged(){
        if(this.selectedKeys.length>0){
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
            this.addCateForm.cat_level = this.selectedKeys.length
        }else{
            this.addCateForm.cat_pid = 0
             this.addCateForm.cat_level = 0
        }

    },
    addCate(){
        this.$refs.addCateFormRef.validate(async valid=>{
            if(!valid)return 
             const {data:res} = await this.$http.post('categories',this.addCateForm) 
             if(res.meta.status !== 201){
                this.$message.error('添加分类失败!')
             } 
            this.$message.success('添加分类成功!')
            this.getCateList()
            this.addCateDialogVisible = false
        })
    },
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
    }
  },
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}

</style>