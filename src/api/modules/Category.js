import axios from "axios";

// 添加分类
const add = (data) => axios.post("/api/category/add", data);
// 删除分类
const remove = (data) => axios.post(`/api/category/del`, data);
// 更新分类
const update = (data) => axios.post(`/api/category/updata`, data);
// 获取子级分类
const load = (data) => axios.post("/api/category/sub", data);

export default {
  add,
  remove,
  update,
  load,
};
