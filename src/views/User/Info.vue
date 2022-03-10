<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账户信息</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="账户" prop="username">
          <el-input
            v-model="form.username"
            disabled
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input
            v-model.trim="form.fullname"
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
          <el-input v-model.number="form.tel" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <single-upload
            default-image="http://localhost:3003/images/avatar/default.jpg"
            :data="{ type: 'avatar' }"
            action="/api/upload/common"
            :url.sync="form.avatar"
          />
        </el-form-item>

        <el-button
          type="primary"
          @click="updateInfo"
          style="float: right; margin-bottom: 100px"
          >修 改</el-button
        >

        <el-button
          type="primary"
          @click="dialogForm = true"
          style="float: right; margin-bottom: 100px ; margin-right:20px"
          >修改密码</el-button
        >
      </el-form>
    </el-card>

    <!-- 弹框 密码修改-->
    <el-dialog
      title="密码修改"
      :visible.sync="dialogForm"
      @close="handleCloseDialog"
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
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码!"
            prefix-icon="el-icon-key"
            type="password"
            v-model="formPWD.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="checkpassword">
          <el-input
            placeholder="请输入密码!"
            prefix-icon="el-icon-key"
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
import SingleUpload from "@/components/SingleUpload.vue";
import md5 from "js-md5";

export default {
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
      dialogForm: false,
      roles: [],
      form: {
        username: "",
        fullname: "",
        sex: 0,
        tel: "",
        role: "",
        avatar: "",
      },
      rules: {
        username: [{ required: true }],
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
        avatar: [
          { required: true, message: "请上传一张头像！", trigger: "click" },
        ],
      },
      formPWD: {
        password: "",
        checkpassword: "",
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
    // 双向数据绑定，vuex中的state不适合用计算属性
    this.form = { ...this.$store.state.User.profile };
    document.title = "账户信息";
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用，可以访问组件实例 `this`
    this.$refs.form.validateField("avatar", (msg) => {
      if (msg) {
        this.$message.error(msg);
        next(false);
      } else {
        next();
      }
    });
  },
  methods: {
    handleUpdata() {
      this.$refs["formPWD"].validate((valid) => {
        if (!valid) {
          return false;
        }
        let { role } = this.form;
        this.formPWD.password = md5(this.formPWD.password);
        this.$store
          .dispatch("User/Update", { ...this.formPWD })
          .then(({ status, msg }) => {
            if (status) {
              localStorage.setItem("role", role);
              this.$message.success(msg);
              this.dialogForm = false;
            }
          });
      });
    },
    handleCancle() {
      this.dialogForm = false;
      this.$refs["formPWD"].resetFields();
    },
    handleCloseDialog() {
      this.dialogForm = false;
      this.$refs["formPWD"].resetFields();
    },
    // 修改账户信息
    updateInfo() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let { role } = this.form;
        this.$store
          .dispatch("User/Update", { ...this.form })
          .then(({ status, msg }) => {
            if (status) {
              localStorage.setItem("role", role);
              this.$message.success(msg);
            }
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 70%;
  margin: 0 auto;
}
</style>
