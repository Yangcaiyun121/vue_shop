<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" stripe border style="width: 100%">
        <el-table-column type="index" width="180">
        </el-table-column>
        
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodslist: [],
      total: 0,
    }
  },
  created() {
    //this.getGoodsList()
  },
  methods: {
    toAddGoods(){
        this.$router.push('/goods/add')
    }
    // async getGoodsList() {
    //   const { data: res } = this.$http.get('goods', { params: this.queryInfo })
    //   if (res.meta.status !== 200) {
    //     this.$message.error('获取商品列表失败！')
    //   }
    //   this.$message.success('获取商品列表成功！')
    //   this.goodslist = res.data.goodslist
    //   this.total = res.data.total
    //   console.log(this.goodslist);
    // },
  },
}
</script>

<style lang="less" scoped>
</style>