import axios from "axios";
// 加载下一级菜单
const loadSub = (data) => axios.post("/api/menu/sub", data);
// 添加菜单
const add = (data) => axios.post("/api/menu/add", data);
// 更新菜单
const update = (data) => axios.post(`/api/menu/update`, data);
// 删除菜单
const del = (data) => axios.post(`/api/menu/del`, data);
// 获取侧边栏菜单
const loadTree = (data) => axios.post("/api/menu/tree", data);

export default {
  loadSub,
  add,
  update,
  del,
  loadTree,
};
