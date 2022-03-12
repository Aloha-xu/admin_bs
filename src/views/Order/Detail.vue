<template>
  <div>
    <!-- 订单什么是可以编辑的？
 * 	 	备注
 * 		邮费 需要是在没给钱之前才能修改 state 0
 * 		快递公司 快递单号 需要在还没发货之前才能修改  state 1 
 * -->
    <!-- 订单信息 商品信息  -->
    <!-- 订单地址信息 -->
    <!-- 订单备注 -->

    <el-card shadow="always">
      <el-descriptions title="订单详细" style="margin-bottom: 20px">
        <el-descriptions-item label="订单编号">
          {{ orderId && orderId }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          {{ orderInfo.status && orderInfo.status }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ orderInfo.createTime && orderInfo.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- table 商品信息 -->
      <el-table :data="orderGoods">
        <el-table-column label="商品" width="500">
          <template slot-scope="scope">
            <div class="goods">
              <div class="photo">
                <img :src="scope.row.img" />
              </div>
              <div class="name">
                <span>{{ scope.row.name }}</span>
                <br />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="goodsNumber" label="数量"></el-table-column>
      </el-table>
      <br />
      <!-- 地址信息 -->
      <el-descriptions
        class="margin-top"
        title="地址信息"
        :column="2"
        border
        size="large"
        style="margin-top: 20px"
      >
        <el-descriptions-item :labelStyle="{ width: '150px' }">
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ addressInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item :labelStyle="{ width: '150px' }">
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ addressInfo.tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            邮寄地址
          </template>
          {{
            addressInfo.province +
            addressInfo.city +
            addressInfo.county +
            addressInfo.street
          }}
        </el-descriptions-item>
      </el-descriptions>
      <br />
      <h3>快递信息</h3>

      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        size="medium"
        style="margin-top: 20px"
      >
        <el-form-item label="快递公司" props="shipName">
          <el-input
            v-model.trim="form.shipName"
            :disabled="orderInfo.code == 1 ? false : true"
            maxlength="4"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="快递单号" props="shipNumber">
          <el-input
            v-model.trim="form.shipNumber"
            :disabled="orderInfo.code == 1 ? false : true"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="邮 费" props="freightPrice">
          <el-input
            v-model.number="form.freightPrice"
            :disabled="orderInfo.code == 0 ? false : true"
          ></el-input>
        </el-form-item>
        <el-form-item label="备 注" props="note">
          <el-input
            v-model.trim="form.note"
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        @click="handleUpdateOrder"
        style="float: right; margin-bottom: 20px"
        >修 改</el-button
      >
    </el-card>
  </div>
</template>

<script>
import { Order } from "@/api/index";
export default {
  name: "OrderDetail",
  data() {
    return {
      //创建时间
      createdTime: "",
      orderId: "",
      orderGoods: [],
      addressInfo: {},
      orderInfo: {},
      form: {
        shipName: "",
        shipNumber: "",
        freightPrice: 0,
        note: "",
      },
    };
  },
  created() {
    this.orderId = this.$route.params.id;
    this.init();
  },
  methods: {
    async init() {
      let orderallinfo = await Order.detail({ orderId: this.orderId });
      this.orderGoods = orderallinfo.data.orderGoods;
      this.addressInfo = orderallinfo.data.addressInfo;
      this.orderInfo = orderallinfo.data.orderInfo;
      let { shipName, shipNumber, freightPrice, note } =
        orderallinfo.data.orderInfo;
      this.form = {
        shipName,
        shipNumber,
        freightPrice,
        note,
      };
    },
    async handleUpdateOrder() {
      this.form.orderId = this.orderId;
      let { status, msg } = await Order.update({ ...this.form });
      if (status) {
        this.$message.success(msg);
        this.$router.go(-1);
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style scoped lang="less">
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

::v-deep
  .el-descriptions__body
  .el-descriptions__table
  .el-descriptions-item__cell {
  font-size: 16px;
}
</style>
