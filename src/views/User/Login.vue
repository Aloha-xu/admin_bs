<template>
  <div class="bg">
    <el-card shadow="always" class="box-card form-box">
      <div slot="header">
        <span>欢迎登录</span>
      </div>
      <el-form
        @keyup.enter.native="handleLogin"
        ref="form"
        :rules="rules"
        size="medium"
        :model="form"
        label-width="60px"
      >
        <el-form-item label="账户" prop="username">
          <el-input
            placeholder="请输入账户名!"
            prefix-icon="el-icon-user"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码!"
            prefix-icon="el-icon-key"
            type="password"
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="link-box">
        <router-link to="/"></router-link>
        <router-link to="/register">注册账户</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { User } from "@/api/";
import md5 from "js-md5";

export default {
  props: ["redirect"],
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名！", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
          // {
          //   type: "string",
          //   pattern: /^[0-9]{3,}$/,
          //   message: "密码至少3位数字",
          //   trigger: "blur",
          // },
        ],
      },
    };
  },
  created() {
    document.title = "登录";
  },
  methods: {
    handleLogin() {
      // 提取数据
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.form.password = md5(this.form.password);
          let { data, msg, status } = await User.login({
            ...this.form,
          });
          if (!status) {
            this.$message.error(msg);
            return;
          }
          this.$message.success(msg);

          document.cookie = `token=${data.token}; expires=${new Date(
            Date.parse(new Date()) + 7200000
          )}`;
          //这的id是adminId
          localStorage.setItem("id", data.id);
          //roleId角色Id
          localStorage.setItem("roleId", data.roleId);
          // 跳转页面
          if (this.redirect) {
            this.$router.replace(this.redirect);
            return;
          }
          this.$router.push("/goods");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.bg {
  width: 100vw;
  height: 100vh;
  background: url(../../assets/img/login/login-bg.jpg);
  background-size: cover;
  position: relative;

  .form-box {
    position: absolute;
    right: 100px;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    border-radius: 4px;
    font-size: 14px;
    width: 360px;

    .link-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
