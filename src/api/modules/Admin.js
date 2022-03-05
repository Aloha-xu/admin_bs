import axios from "axios";

// 获取管理员列表
const list = (data) => axios.post("/api/admin/list", data);
// 更新管理员个人资料
const update = (data) => axios.post("/api/admin/update", data);
// 删除管理员账户
const remove = (data) => axios.post(`/api/admin/del`, data);

export default {
  list,
  update,
  remove,
};
