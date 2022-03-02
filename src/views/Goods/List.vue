<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品列表</span>
        <el-input
          placeholder="请输入商品名称"
          v-model="searchValues"
          @change="handleSearch"
          clearable
          style="width: 200px; float: right"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed label="商品名称" width="550">
          <template slot-scope="scope">
            <div class="goods">
              <div class="photo">
                <img :src="scope.row.img" />
              </div>
              <div class="name">
                <span>{{ scope.row.name }}</span>
                <br />
                <!-- <span>商品货号：{{ scope.row.articleNo }}</span> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="price" label="价格"></el-table-column>
        <el-table-column
          sortable
          prop="inventory"
          label="库存"
        ></el-table-column>
        <el-table-column
          sortable
          prop="createTime"
          label="发布时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="small"
              @click="$router.push('edit/' + scope.row.goodsId)"
            ></el-button>
            <el-button
              @click="showDeleteModal(scope.row.goodsId)"
              icon="el-icon-delete"
              plain
              type="danger"
            ></el-button>
            <el-button
              plain
              @click="handleUpDownGoods(scope.row.state, scope.row.goodsId)"
              >{{ scope.row.state ? "下架" : "上架" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        background
        layout="->,prev,pager,next,sizes,total"
        class="am-margin-top-sm"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { Goods } from "@/api/index";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 5,
      pageIndex: 1,
      searchValues: "",
    };
  },
  created() {
    this.loadGoodsList();
    document.title = "商品列表";
  },
  methods: {
    async loadGoodsList() {
      let { status, goods, total } = await Goods.list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.searchValues,
      });
      if (status) {
        this.tableData = goods;
        this.total = total;
      }
    },
    // 分页器改变页码数
    currentPageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.loadGoodsList();
    },
    // 分页器pageSize改变
    pageSizeChange(size) {
      this.pageSize = size;
      this.loadGoodsList();
    },
    async showDeleteModal(goodsId) {
      this.$confirm("确定要删除该商品吗？删除之后无法恢复！！！", {
        type: "warning",
      })
        .then(async () => {
          let { status, msg } = await Goods.remove({ goodsId });
          if (status) {
            this.$message.success("删除成功！");
            this.loadGoodsList();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async handleUpDownGoods(state, goodsId) {
      if (state) {
        //下架
        await Goods.state({
          state: 0,
          goodsId,
        });
      } else {
        await Goods.state({
          state: 1,
          goodsId,
        });
      }
      //刷新
      this.loadGoodsList();
    },
    async handleSearch() {
      this.pageIndex = 1;
      this.pageSize = 5;
      this.loadGoodsList();
    },
  },
};
</script>
<style lang="less" scoped>
.goods {
  display: flex;
  align-items: center;

  .photo {
    margin-right: 6px;
    border: 1px solid #eee;
  }

  .photo img {
    width: 80px;
    display: block;
  }
}
</style>
