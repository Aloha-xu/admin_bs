import axios from "axios";
// 登录
const login = (formData) => axios.post("/api/admin/login", formData);
// 注册
const register = (formData) => axios.post("/api/admin/register", formData);
// 获取管理员的个人详情
const info = (data) => axios.post("/api/admin/info", data);
// 修改本账户信息
const update = (data) => axios.post("/api/admin/update", data);

export default {
  login,
  register,
  info,
  update,
};
