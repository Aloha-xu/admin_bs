<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑商品</span>
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
          <el-col :span="24" class="tip"
            >价格必须是0-999999之间的数字，且不能高于市场价</el-col
          >
        </el-form-item>

        <el-form-item prop="inventory" label="商品库存">
          <el-col :span="4">
            <el-input v-model.number="form.inventory">
              <template slot="append">件</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="img" label="商品主图">
          <main-photo-upload
            :url.sync="form.img"
            action="/api/upload/goods"
          ></main-photo-upload>
          <el-col :span="24" class="tip">
            上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
            800*800像素以上，大小不超过2M的图片，上传后的图片将自动保存在图片空间的默认分类中
          </el-col>
        </el-form-item>
        <el-form-item prop="slider" label="商品轮播图">
          <slider-upload
            action="/api/upload/slider/"
            v-model="form.slider"
            :file-list="fileList"
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
          <el-button type="success" @click="handleEdit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { Category, Goods } from "@/api/index";
import wangEditor from "wangeditor";

import MainPhotoUpload from "@/components/MainPhotoUpload.vue";
import SliderUpload from "@/components/SliderUpload";
import { getToken } from "@/plugins/util.js";
export default {
  components: {
    MainPhotoUpload,
    SliderUpload,
  },
  data() {
    return {
      goodsId: "",
      fileList: [],
      form: {
        cateId: "",
        hotPoint: "",
        name: "",
        price: "",
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
            max: 100,
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
  async created() {
    this.goodsId = this.$route.params.id;
    document.title = "商品编辑";
    //获取分类列表
    let { data } = await Category.load({ pId: 1 });
    this.cateIdBox = data;
  },
  async mounted() {
    // 获取参数对应的数据
    let data = await this.loadDetail();
    //富文本编辑器
    const editor = new wangEditor("#editor");
    editor.config.zIndex = 100;
    //配置上传图片
    editor.config.uploadImgServer = "/api/upload/editor";
    editor.config.uploadFileName = "file";
    // 配置header信息
    editor.config.uploadImgHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    //同步HTML代码至data
    editor.config.onchange = (html) => {
      this.form.detail = html;
    };
    editor.create();
    editor.txt.html(data.detail);
    // 轮播图
    let arr = data.slider.split(",");
    console.log(arr);
    let list = arr.map(function(item, index) {
      let obj = {};
      obj.url = item;
      obj.name = index + ".jpg";
      obj.response = { src: item };
      return obj;
    });
    this.fileList = list;
    // 获取所有省份
    // this.loadProvince();
  },
  methods: {
    async loadDetail() {
      let { status, data } = await Goods.detail({ goodsId: this.goodsId });
      if (status) {
        this.form = data;
        this.form.goodsId = this.goodsId;
        return data;
      }
    },
    //修改商品
    async handleEdit() {
      let { status } = await Goods.update({ ...this.form });
      if (status) {
        this.$message.success("更新商品成功！");
      }
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
