<template>
  <div>
    <div class="box-card">
      <div style="margin-bottom: 20px">订单列表</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="item in tabs">
          <el-tab-pane
            :label="item.label"
            :name="item.name"
            style="width: 150px"
          ></el-tab-pane>
        </template>
      </el-tabs>
      <!-- table -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="#" width="50"></el-table-column>
        <el-table-column width="750">
          <template slot-scope="scope">
            <el-table :data="scope.row.goodsList">
              <el-table-column prop="name" label="商品" width="500">
                <template slot-scope="scope">
                  <div class="goods">
                    <div class="photo">
                      <img :src="scope.row.img" />
                    </div>
                    <div class="name">
                      <span>{{ scope.row.name }}</span>
                      <br />
                      <span>订单号:{{ scope.row.orderId }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价"></el-table-column>
              <el-table-column
                prop="goodsNumber"
                label="数量"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="付款总额" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.freightPrice + scope.row.goodsPrices }}</div>
            <div>含运费：￥{{ scope.row.freightPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="下单时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态"
          width="200"
        ></el-table-column>
        <el-table-column label="操作">
          <!-- 
						发货 ---弹窗 填快递公司 快递单号
						退货 ---弹窗 审批同意/不同意退货 
						修改 ---    快递公司 快递单号  状态是没发货之前
									商品价格 邮费  未付款之前
						取消订单 --- 
          -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              @click="$router.push('detail/' + scope.row.orderId)"
              >编辑</el-button
            >
            <el-button
              @click="handleDeleteOrder(scope.row.orderId)"
              plain
              type="danger"
              v-if="scope.row.code != 6"
              >取消订单</el-button
            >
            <el-button
              icon="el-icon-truck"
              plain
              v-if="scope.row.code == 1 || scope.row.code == 4 ? true : false"
              @click="
                handlePopEditInfo(
                  scope.row.code,
                  scope.row.refundReason,
                  scope.row.orderId
                )
              "
            >
              {{
                scope.row.code == 1
                  ? "发货"
                  : scope.row.code == 4
                  ? "审核退货"
                  : ""
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- pop快递信息 -->
    <el-dialog
      title="填写快递信息"
      :visible.sync="shipModalVisible"
      @closed="handleClosedDialog('shipRef')"
    >
      <el-form
        ref="shipRef"
        :model="shipForm"
        :rules="rules"
        label-width="80px"
        :label-position="'left'"
      >
        <el-form-item label="快递公司" prop="shipName">
          <el-input v-model="shipForm.shipName"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="shipNumber">
          <el-input v-model="shipForm.shipNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateShipInfo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- pop 退货信息-->
    <el-dialog
      title="退货信息"
      :visible.sync="refundModalVisible"
      @closed="handleClosedDialog('refundRef')"
    >
      <el-form
        ref="refundRef"
        :model="refundForm"
        :rules="rules"
        label-width="80px"
        :label-position="'left'"
      >
        <el-form-item label="退货理由">
          <el-input
            v-model="refundForm.refundReason"
            type="textarea"
            :rows="2"
            readonly="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRefundInfo(8)">拒绝退货</el-button>
        <el-button type="primary" @click="handleRefundInfo(5)"
          >同意退货</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Order } from "@/api/index";
import { getYMDHMS } from "@/plugins/util.js";

export default {
  data() {
    return {
      tabs: [
        {
          label: "全部",
          name: "7",
        },
        {
          label: "待付款",
          name: "0",
        },
        {
          label: "待发货",
          name: "1",
        },
        {
          label: "待收货",
          name: "2",
        },
        {
          label: "退货中",
          name: "4",
        },
        {
          label: "订单关闭",
          name: "6",
        },
      ],
      activeName: "7",
      orderId: "",
      tableData: [],
      shipModalVisible: false,
      refundModalVisible: false,
      shipForm: {
        shipName: "",
        shipNumber: "",
      },
      refundForm: {
        refundReason: "",
      },
      rules: {
        shipName: [
          { required: true, message: "请输入快递公司！", trigger: "blur" },
        ],
        shipNumber: [
          { required: true, message: "请输入快递编号！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadList();
    document.title = "订单列表";
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.loadList();
    },
    async loadList() {
      let { status, data } = await Order.loadList({
        status: +this.activeName,
        pageSize: 20,
        pageIndex: 1,
      });
      if (status) {
        data.forEach(function(item) {
          item.createTime = getYMDHMS(+item.createTime * 1000);
        });
        this.tableData = data;
      }
    },
    //处理发货退货弹出框
    handlePopEditInfo(code, refundReason, orderId) {
      if (code == 1) {
        //发货
        this.shipModalVisible = true;
      } else if (code == 4) {
        //退货
        this.refundForm.refundReason = refundReason;
        this.refundModalVisible = true;
      }
      this.orderId = orderId;
    },
    //取消订单
    async handleDeleteOrder(orderId) {
      this.$confirm("确定要取消该订单？取消之后无法恢复！！！", {
        type: "warning",
      })
        .then(async () => {
          let { status, msg } = await Order.cancel({
            orderId,
          });
          if (status) {
            this.$message.success(msg);
            this.loadList();
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //处理 提交发货快递信息
    handleUpdateShipInfo() {
      // 表单验证
      this.$refs.shipRef.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.shipForm.orderId = this.orderId;
        let { status, msg } = await Order.updataShipInfo({
          ...this.shipForm,
        });
        if (status) {
          this.$message.success(msg);
          this.shipModalVisible = false;
          this.loadList();
        } else {
          this.$message.error(msg);
        }
      });
    },
    //处理退货 简易 5 -成功  8-失败
    async handleRefundInfo(v) {
      let { status, msg } = await Order.refund({
        orderState: v,
        orderId: this.orderId,
      });
      if (status) {
        this.$message.success(msg);
        this.refundModalVisible = false;
        this.loadList();
      } else {
        this.$message.error(msg);
      }
    },
    handleClosedDialog(formName) {
      this.$refs[formName].resetFields();
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

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 50px;
}
</style>
