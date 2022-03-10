<template>
  <div>
    <!--  这是后台管理各种管理员的列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="adminId" label="#" width="80"> </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar" :size="50"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号"> </el-table-column>
        <el-table-column prop="fullname" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex == 0 ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机"> </el-table-column>
        <el-table-column prop="roleName" label="角色">
          <template slot-scope="scope">
            <el-tag :type="scope.row.role === 1 ? 'danger' : ''">{{
              scope.row.roleName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" width="160" label="上次登录">
        </el-table-column>
        <el-table-column prop="loginCount" label="登录次数"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              @click="showEditModal(scope.row, scope.$index)"
              plain
              icon="el-icon-edit"
              size="small"
              type="primary"
            ></el-button>
            <el-button
              @click="showDeleteModal(scope.row.adminId, scope.$index)"
              :disabled="scope.row.adminId == 1"
              icon="el-icon-delete"
              plain
              size="small"
              type="danger"
            ></el-button>
            <el-button
              type="primary"
              @click="
                handleShowUpdatePwdDialog(scope.row.adminId, scope.row.username)
              "
              >修改密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--编辑数据-->
    <el-dialog
      title="修改信息"
      :visible.sync="editModalVisible"
      :before-close="handleBeforeCloseDialog"
      @closed="handleClosedDialog('form')"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="fullname">
          <el-input
            v-model="form.fullname"
            auto-complete="off"
            maxlength="5"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="form.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select
            v-model="form.role"
            @change="handleRoleChange"
            placeholder="请选择账户"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <single-upload
            default-image="http://localhost:3003/images/avatar/default.jpg"
            :data="{ type: 'avatar' }"
            action="/api/upload/common"
            :url.sync="form.avatar"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleEdit">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 弹框 密码修改-->
    <el-dialog
      title="密码修改"
      :visible.sync="dialogForm"
      @close="handleCloseDialogPWD"
      :close-on-click-modal="false"
      width="750px"
      height="450px"
    >
      <el-form
        :model="formPWD"
        :rules="rulesPWD"
        ref="formPWD"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input
            type="text"
            v-model="formPWD.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码!"
            type="password"
            v-model="formPWD.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input
            placeholder="请输入密码!"
            type="password"
            v-model="formPWD.checkpassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleUpdata">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入service模块
import { Admin, Role } from "@/api/index";
import SingleUpload from "@/components/SingleUpload.vue";
import md5 from "js-md5";
export default {
  name: "List",
  components: {
    SingleUpload,
  },
  data() {
    var validate = (rule, value, callback) => {
      var pwdRegex = new RegExp("^[0-9]{3,15}$");
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!pwdRegex.test(value)) {
        callback(new Error("请输入3-15位的密码"));
      }
      callback();
    };
    var validateCheckPwd = (rule, value, callback) => {
      var pwdRegex = new RegExp("^[0-9]{3,15}$");
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!pwdRegex.test(value)) {
        callback(new Error("请输入3-15位的密码"));
      } else if (value != this.formPWD.password) {
        callback(new Error("密码输入不一致"));
      }
      callback();
    };
    return {
      tableData: [],
      roles: [],
      editModalVisible: false,
      form: {
        adminId: null,
        fullname: "",
        sex: 0,
        tel: "",
        role: "",
        avatar: "",
      },
      currentIndex: {},
      rules: {
        fullname: [
          {
            required: true,
            type: "string",
            message: "请输入真实姓名！",
            trigger: "blur",
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/,
            message: "请输入有效的姓名",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别！", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入手机号码！", trigger: "blur" },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入有效的手机号码",
            trigger: "blur",
          },
        ],
        role: [
          { required: true, message: "请选择账户角色！", trigger: "blur" },
        ],
        avatar: [
          { required: true, message: "请上传一张头像！", trigger: "click" },
        ],
      },
      //修改密码
      dialogForm: false,
      formPWD: {
        password: "",
        checkpassword: "",
        username: "",
        adminId: "",
      },
      rulesPWD: {
        password: [
          {
            validator: validate,
            trigger: "blur",
          },
        ],
        checkpassword: [
          {
            validator: validateCheckPwd,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.loadList();
    this.loadRole();
    document.title = "用户列表";
  },
  methods: {
    // 修改密码弹窗控制函数
    handleShowUpdatePwdDialog(adminId, username) {
      this.dialogForm = true;
      this.formPWD.username = username;
      this.formPWD.adminId = adminId;
    },
    //修改密码
    handleUpdata() {
      this.$refs["formPWD"].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.formPWD.password = md5(this.formPWD.password);
        let { status, msg } = await Admin.update({ ...this.formPWD });
        if (status) {
          this.dialogForm = false;
          this.$message.success(msg);
          this.loadList();
        }
      });
    },
    //取消 清除校验
    handleCancle() {
      this.dialogForm = false;
      this.$refs["formPWD"].resetFields();
    },
    //关闭 清除校验
    handleCloseDialogPWD() {
      this.dialogForm = false;
      this.$refs["formPWD"].resetFields();
    },

    //加载列表
    async loadList() {
      let { status, data } = await Admin.list();
      if (status) {
        this.tableData = data;
      }
    },
    //加载角色
    async loadRole() {
      let { status, data } = await Role.list();
      if (status) {
        this.roles = data;
      }
    },
    // 显示编辑框
    showEditModal(userData, index) {
      this.editModalVisible = true;
      this.form = { ...userData };
      this.currentIndex = index;
    },
    //监听select的change事件
    handleRoleChange(value) {
      let selectedRole = this.roles.find((item) => item.id === value);
      this.form.role_name = selectedRole.name;
    },
    // 修改账户信息
    handleEdit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return false;
        }
        let { status, msg } = await Admin.update({ ...this.form });
        if (status) {
          this.editModalVisible = false;
          this.$message.success(msg);
          this.loadList();
          // this.$set(this.tableData, this.currentIndex, { ...this.form });
        }
      });
    },
    // 删除账户
    showDeleteModal(id, index) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", { type: "warning" })
        .then(async () => {
          let { status, msg } = await Admin.remove({ id: id });
          if (status) {
            this.$message.success("删除成功！");
            this.tableData.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 校验图片是否为空
    checkImage() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validateField("avatar", (msg) => {
          if (msg) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },
    // 关闭编辑dialog之前，校验图片是否删除
    async handleBeforeCloseDialog(done) {
      let isValid = await this.checkImage();
      if (isValid) {
        done();
      }
    },
    // 关闭编辑dialog
    async handleCloseDialog() {
      let isValid = await this.checkImage();
      this.editModalVisible = !isValid;
    },
    // 关闭dialog动画结束之后，清除之前的验证提示
    handleClosedDialog(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped></style>
