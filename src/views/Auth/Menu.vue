<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>菜单权限</span>
      </div>
      <el-alert
        title="Tips"
        type="warning"
        description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示与添加。"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 树形组件 -->
      <el-tree
        :data="treeMenu"
        ref="tree"
        :default-expanded-keys="defaultExpandedKeys"
        node-key="id"
        :props="defaultProps"
        class="am-margin-top-lg"
      >
        <div class="node-box" slot-scope="{ node, data }">
          <div class="node-name">
            {{ node.label }}
          </div>
          <div class="node-action">
            <el-button
              type="text"
              icon="el-icon-edit-outline"
              :disabled="data.menuId == 1"
              @click.stop="openEditModal(node, data)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              @click.stop="openAddModal(node, data)"
              :disabled="data.pId > 1"
            >
              添加
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="data.menuId == 1"
              @click.stop="openRemoveModal(node, data)"
              >删除
            </el-button>
            <div class="node-order am-margin-left-sm">
              显示序号：
              <el-tag size="mini">{{ data.menuOrder }}</el-tag>
            </div>
          </div>
        </div>
      </el-tree>

      <!-- 编辑Modal -->
      <el-dialog
        title="编辑节点"
        :visible.sync="EditModalVisible"
        @closed="handleClosedDialog('editForm')"
      >
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-width="80px"
          :label-position="'left'"
        >
          <el-form-item label="菜单名称" prop="name">
            <el-input
              v-model="editForm.name"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="path">
            <el-input
              v-model="editForm.path"
              placeholder="指定此菜单的链接地址，选填"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="menuOrder">
            <el-input
              v-model.number="editForm.menuOrder"
              placeholder="显示顺序按照数字从小到大，如2001"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditModalVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditMenu">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 添加Modal -->
      <el-dialog
        title="添加节点"
        :visible.sync="AddModalVisible"
        @closed="handleClosedDialog('addForm')"
      >
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="rules"
          label-width="80px"
          :label-position="'left'"
        >
          <el-form-item label="菜单名称" prop="name">
            <el-input
              v-model="addForm.name"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="path">
            <el-input
              v-model="addForm.path"
              placeholder="指定此菜单的链接地址，选填"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="menuOrder">
            <el-input
              v-model.number="addForm.menuOrder"
              placeholder="显示顺序按照数字从小到大，如2001"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddModalVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddMenu">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Menu",
  data() {
    return {
      defaultProps: { label: "name" },
      pageSize: 30,
      iconTotal: 0,
      currentNode: "",
      //默认展开
      defaultExpandedKeys: [1],
      // 编辑Modal
      EditModalVisible: false,
      editForm: {
        menuId: "",
        name: "",
        pId: "",
        path: "",
        menuOrder: null,
      },
      // 添加Modal
      AddModalVisible: false,
      addForm: {
        name: "",
        pId: "",
        path: "",
        menuOrder: null,
      },
      rules: {
        name: [
          {
            required: true,
            type: "string",
            message: "请输入菜单名称！",
            trigger: "blur",
          },
        ],
        menuOrder: [
          {
            required: true,
            type: "integer",
            message: "请填写显示顺序！",
            trigger: "blur",
          },
          {
            pattern: /^\d+$/,
            message: "顺序必须是数字组成！",
            trigger: "blur",
          },
        ],
        path: [
          {
            pattern: /[u4E00-u9FA5]/,
            message: "不能输入汉字！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    document.title = "菜单权限";
  },
  computed: {
    ...mapGetters("Menu", ["treeMenu"]),
  },
  methods: {
    // 删除节点
    openRemoveModal(node, data) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", { type: "warning" })
        .then(async () => {
          this.setDefaultExpandedKeys();
          let { status, msg } = await this.$store.dispatch("Menu/RemoveMenu", {
            menuId: data.menuId,
          });
          if (status) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 打开添加Modal获取pId
    openAddModal(node, data) {
      this.addForm.pId = data.menuId;
      this.AddModalVisible = true;
      // 转存data
      this.currentNode = node;
    },
    // 确认添加节点
    async handleAddMenu() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          //缓存默认展开节点
          this.setDefaultExpandedKeys();
          let { status, msg, data } = await this.$store.dispatch(
            "Menu/CreateMenu",
            {
              ...this.addForm,
            }
          );
          if (!status) {
            this.$message.error(msg);
            return false;
          }
          this.$message.success(msg);
          this.AddModalVisible = false;
          //刷新
          this.$store.dispatch("Menu/LoadMenu", {
            roleId: +localStorage.getItem("roleId"),
          });
        }
      });
    },
    // 打开编辑Modal
    openEditModal(node, data) {
      this.EditModalVisible = true;
      //转存节点data数据
      this.editForm = { ...data };
      //删除children子节点数据，防止污染仓库state
      delete this.editForm.children;
      // 转存node节点
      this.currentNode = node;
    },
    // 编辑节点
    async handleEditMenu() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          let { status, msg } = await this.$store.dispatch("Menu/EditMenu", {
            ...this.editForm,
          });
          if (!status) {
            this.$message.error(msg);
            return false;
          }
          this.$message.success(msg);
          this.EditModalVisible = false;
          //刷新
          this.$store.dispatch("Menu/LoadMenu", {
            roleId: +localStorage.getItem("roleId"),
          });
        }
      });
    },
    // 关闭dialog动画结束之后，清除之前的验证提示
    handleClosedDialog(formName) {
      this.$refs[formName].resetFields();
    },
    //设置默认展开节点
    setDefaultExpandedKeys() {
      // 获取树形组件实例
      let allNodes = this.$refs.tree.store._getAllNodes();
      console.log(allNodes);
      let defaultExpandedNodes = [];
      allNodes.forEach((node) => {
        node.expanded && defaultExpandedNodes.push(node.data.menuId);
      });
      this.defaultExpandedKeys = defaultExpandedNodes;
    },
  },
};
</script>

<style lang="less" scoped>
.node-box {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  .node-order {
    width: 100px;
    display: inline-block;
    font-size: 12px;
  }
}

ul.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border: solid 1px #eaeefb;
  border-radius: 4px;
}

.icon-list li {
  float: left;
  width: 10%;
  text-align: center;
  height: 100px;
  line-height: 100px;
  color: #666;
  font-size: 10px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-right: -1px;
  margin-bottom: -1px;

  &::after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }

  span {
    display: inline-block;
    line-height: normal;
    vertical-align: middle;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
      "Microsoft YaHei", SimSun, sans-serif;
    color: #99a9bf;
    transition: color 0.15s linear;
  }

  i {
    display: block;
    font-size: 26px;
    margin-bottom: 15px;
    color: #606266;
    transition: color 0.15s linear;
  }

  .icon-name {
    display: inline-block;
    padding: 0 3px;
    height: 1em;
  }

  &.checked,
  &.checked:hover {
    background-color: rgb(92, 182, 255);

    span,
    i {
      color: white;
    }
  }

  &:hover {
    span,
    i {
      color: rgb(92, 182, 255);
    }
  }
}
</style>
