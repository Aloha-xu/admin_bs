import axios from "axios";
//列表
const list = (data) => axios.post("/api/role/list", data);
//添加
const add = (formData) => axios.post("/api/role", formData);
//删除
const remove = (id, params) => axios.post(`/api/role/${id}`, { params });
//更新
const update = (id, formData) => axios.post(`/api/role/${id}`, formData);
//根据角色id获取菜单配置
const loadConfig = (params) => axios.get("/api/role/config", { params });
//为指定角色添加菜单
const createMenu = (formData) => axios.post("/api/role/menu", formData);
//为指定角色删除菜单
const removeMenu = (id, params) =>
  axios.post(`/api/role/menu/${id}`, { params });

export default {
  list,
  add,
  remove,
  update,
  loadConfig,
  createMenu,
  removeMenu,
};
