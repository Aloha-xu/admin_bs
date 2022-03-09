<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>轮播图管理</span>
        <el-button
          type="primary"
          plain
          @click="handleAddBanner"
          style="float:right"
          >添加</el-button
        >
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          type="index"
          width="100"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column label="轮播图图片" width="300">
          <template slot-scope="scope">
            <div class="banner">
              <div class="photo">
                <img :src="scope.row.url" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="300">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.state ? '#75a53d' : '#F56C6C' }">
              {{ scope.row.state ? "已上架" : "已下架" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="small"
              @click="handleShowUpdateDialog(scope.row.bannerId)"
            ></el-button>
            <el-button
              @click="showDeleteModal(scope.row.bannerId)"
              icon="el-icon-delete"
              plain
              type="danger"
            ></el-button>
            <el-button
              plain
              @click="
                handleUpDownGoods(
                  scope.row.state,
                  scope.row.bannerId,
                  scope.row.url
                )
              "
              >{{ scope.row.state ? "下架" : "上架" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="title"
      :visible.sync="ModalVisible"
      @closed="handleClosedDialog('formRef')"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        :label-position="'left'"
      >
        <el-form-item prop="url" label="商品主图">
          <main-photo-upload
            :url.sync="form.url"
            action="/api/upload/goods"
          ></main-photo-upload>
          <el-col :span="24" class="tip">
            上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
            800*800像素以上，大小不超过2M的图片，上传后的图片将自动保存在图片空间的默认分类中
          </el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.state"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClosedDialog('formRef')">取 消</el-button>
        <el-button type="primary" @click="handleUpdateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Banner } from "@/api/index";
// import { getYMDHMS } from "@/plugins/util.js";
import MainPhotoUpload from "@/components/MainPhotoUpload.vue";
export default {
  data() {
    return {
      title: "更改轮播图信息",
      ModalVisible: false,
      tableData: [],
      form: {
        bannerId: "",
        state: 1,
        url: "",
      },
      rules: {
        url: [
          { required: true, message: "请上传一张图片主图", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    MainPhotoUpload,
  },
  created() {
    this.loadBannersList();
  },
  methods: {
    handleAddBanner() {
      this.title = "添加轮播图信息";
      this.ModalVisible = true;
    },
    handleShowUpdateDialog(bannerId) {
      this.title = "更改轮播图信息";
      this.ModalVisible = true;
      this.tableData.some((item, index) => {
        if (item.bannerId == bannerId) {
          this.form = JSON.parse(JSON.stringify(this.tableData[index]));
          return true;
        }
      });
    },
    handleClosedDialog(formName) {
      this.ModalVisible = false;
      this.$refs[formName].resetFields();
    },
    async handleUpdateInfo() {
      //判断是添加还是修改
      this.title == "添加轮播图信息" &&
        (await Banner.add({
          ...this.form,
        }));
      this.title == "更改轮播图信息" &&
        (await Banner.update({
          ...this.form,
        }));
      this.ModalVisible = false;
      this.loadBannersList();
    },
    indexMethod(index) {
      return index + 1;
    },
    // getymdhms(t) {
    //   return getYMDHMS(+t * 1000);
    // },
    async loadBannersList() {
      let { status, data, total } = await Banner.list({});
      if (status) {
        this.tableData = data;
        this.total = total;
      }
    },
    async showDeleteModal(bannerId) {
      this.$confirm("确定要删除该轮播图吗？删除之后无法恢复！！！", {
        type: "warning",
      })
        .then(async () => {
          let { status, msg } = await Banner.del({ bannerId });
          if (status) {
            this.$message.success("删除成功！");
            this.loadBannersList();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async handleUpDownGoods(state, bannerId, url) {
      if (state) {
        //下架
        await Banner.update({
          state: 0,
          bannerId,
          url,
        });
      } else {
        await Banner.update({
          state: 1,
          bannerId,
          url,
        });
      }
      //刷新
      this.loadBannersList();
    },
  },
};
</script>
<style lang="less" scoped>
.banner {
  display: flex;
  .photo {
    margin-right: 6px;
    border: 1px solid #eee;
  }

  .photo img {
    width: 150px;
    display: block;
  }
}
</style>
