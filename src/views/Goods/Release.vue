<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布新商品</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-row>
          <el-form-item prop="cateId" label="商品分类">
            <el-select v-model="form.cateId" placeholder="请选择分类">
              <el-option
                v-for="item in cateIdBox"
                :key="item.cateId"
                :label="item.name"
                :value="item.cateId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item prop="name" label="商品名称">
          <el-col :span="14">
            <el-input
              v-model.trim="form.name"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-col>
          <el-col :span="24" class="tip"
            >商品标题名称长度至少3个字符，最长100个汉字</el-col
          >
        </el-form-item>
        <el-form-item prop="price" label="商品价格">
          <el-col :span="4">
            <el-input v-model.number="form.price">
              <template slot="append">元</template>
            </el-input>
          </el-col>
          <el-col :span="24" class="tip">价格必须是0-999999之间的数字</el-col>
        </el-form-item>

        <el-form-item prop="inventory" label="商品库存">
          <el-col :span="4">
            <el-input v-model.number="form.inventory">
              <template slot="append">件</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="img" label="商品主图">
          <main-photo-upload :url.sync="form.img" action="/api/upload/goods">
          </main-photo-upload>
          <el-col :span="24" class="tip">
            上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
            800*800像素以上，大小不超过2M的图片，上传后的图片将自动保存在图片空间的默认分类中
          </el-col>
        </el-form-item>
        <el-form-item prop="slider" label="商品轮播图">
          <slider-upload
            action="/api/upload/slider"
            v-model="form.slider"
          ></slider-upload>
          <el-col :span="24" class="tip">
            上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
            800*800像素以上，大小不超过2M的图片，上传后的图片将自动保存在图片空间的默认分类中
          </el-col>
        </el-form-item>
        <div class="section-title">商品详情描述</div>
        <el-form-item prop="detail" label="商品描述">
          <div id="editor"></div>
        </el-form-item>
        <div class="section-title">商品物流信息</div>
        <el-form-item prop="freight" label="运费">
          <el-col :span="3">
            <el-input v-model.number="form.freight">
              <template slot="append">元</template>
            </el-input>
          </el-col>
          <el-col :span="24" class="tip"
            >运费设为0，前台商品将显示免运费</el-col
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRelease">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { Category, Goods } from "@/api/index";
import wangEditor from "wangeditor";
import { getToken } from "@/plugins/util.js";

import MainPhotoUpload from "@/components/MainPhotoUpload.vue";
import SliderUpload from "@/components/SliderUpload";

export default {
  components: {
    MainPhotoUpload,
    SliderUpload,
  },
  data() {
    return {
      form: {
        cateId: "",
        name: "",
        price: null,
        inventory: 1000,
        img: "",
        slider: "",
        detail: "",
        freight: 0,
      },
      rules: {
        cateId: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入商品的名称", trigger: "blur" },
          {
            type: "string",
            min: 3,
            max: 200,
            message: "商品标题名称长度至少3个字符，最长100个汉字",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "请输入商品的价格", trigger: "blur" },
          {
            pattern: /(^[1-9]\d{0,4}(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
            message: "价格必须是0-999999之间的数字",
            trigger: "blur",
          },
        ],
        inventory: [
          {
            required: true,
            type: "integer",
            message: "请输入商品的库存数量",
            trigger: "blur",
          },
          {
            min: 0,
            max: 999999,
            type: "integer",
            message: "库存必须是0-999999之间的整数",
            trigger: "blur",
          },
        ],
        img: [
          { required: true, message: "请上传一张图片主图", trigger: "blur" },
        ],
        slider: [
          {
            required: true,
            message: "请上传至少一张轮播图照片",
            trigger: "blur",
          },
        ],
        detail: [
          { required: true, message: "请填写商品详情", trigger: "blur" },
        ],
        freight: [
          {
            required: true,
            type: "number",
            message: "请填写商品的运费",
            trigger: "blur",
          },
          {
            min: 0,
            type: "number",
            message: "运费必须是0-999999之间的数字",
            trigger: "blur",
          },
        ],
      },
      cateIdBox: [],
    };
  },
  mounted() {
    const editor = new wangEditor("#editor");
    editor.config.zIndex = 100;
    //配置上传图片`
    editor.config.uploadImgServer = "/api/upload/editor/";
    editor.config.uploadFileName = "file";
    // 配置header信息
    //token拿取写一个getToken

    editor.config.uploadImgHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    //同步HTML代码至data
    editor.config.onchange = (html) => {
      this.form.detail = html;
    };
    editor.create();
  },
  async created() {
    //获取分类列表
    let { data } = await Category.load({ pId: 1 });
    this.cateIdBox = data;
    // 获取一级分类
    // this.handleCateChange();
    // 获取所有省份
    // this.loadProvince();

    document.title = "发布新商品";
  },
  methods: {
    //分类change事件
    // async handleCateChange() {
    //   let { data} = await Category.load({ pId: 1 });
    //   this.cateIdBox = data;
    // if (!id) {
    //   return false;
    // }
    // let data = await this.loadOptions(id);
    // this[cate + "_options"] = data;
    // //如果数组为空，下一级分类设置为空
    // if (data.length == 0) {
    //   this.form[cate] = undefined;
    //   return false;
    // }
    // //默认选择数组第一项
    // this.form[cate] = data[0].id;
    // },
    //获取下一级分类
    // async loadOptions(id) {
    //   let { status, data, msg } = await Category.load({ pId: id });
    //   if (status) {
    //     return Promise.resolve(data);
    //   } else {
    //     this.$message.error(msg);
    //   }
    // },
    // // 获取省份
    // async loadProvince() {
    //   let { status, data } = await PCCT.province();
    //   if (status) {
    //     this.province_options = data;
    //     //默认选择数组第一项
    //     this.form.province = data[0].province_id;
    //   }
    // },
    // // 根据省id获取城市
    // async loadCity(id) {
    //   let { status, data } = await PCCT.city({ id });
    //   if (status) {
    //     this.city_options = data;
    //     //默认选择数组第一项
    //     this.form.city = data[0].city_id;
    //   }
    // },
    // // 根据市区id获取县区
    // async loadCounty(id) {
    //   let { status, data } = await PCCT.county({ id });
    //   if (status) {
    //     this.county_options = data;
    //     //默认选择数组第一项
    //     this.form.county = data[0].county_id;
    //   }
    // },
    // // 根据市区id获取县区
    // async loadTown(id) {
    //   let { status, data } = await PCCT.town({ id });
    //   if (status) {
    //     this.town_options = data;
    //     //默认选择数组第一项
    //     this.form.town = data[0].town_id;
    //   }
    // },
    //发布商品
    handleRelease() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let { status } = await Goods.release({ ...this.form });
          if (status) {
            this.$message.success("发布商品成功！");
            this.$router.replace("/goods/list");
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.tip {
  font-size: 12px;
  color: #999;
}

.section-title {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
}

.el-upload img {
  max-width: 100%;
}
</style>
