import axios from "axios";
//列表
const list = (data) => axios.post("/api/role/list", data);
//添加
const add = (data) => axios.post("/api/role/add", data);
//删除
const remove = (data) => axios.post('/api/role/del', data);
//更新
const update = (data) => axios.post('/api/role/update', data);
//根据角色id获取菜单配置
const loadConfig = (data) => axios.post("/api/role/getMenuByRoleId", data);
//为指定角色添加菜单
const createMenu = (data) => axios.post("/api/role/addMenuByRole", data);
//为指定角色删除菜单
const removeMenu = (data) => axios.post('/api/role/delMenuByRole', data);

export default {
  list,
  add,
  remove,
  update,
  loadConfig,
  createMenu,
  removeMenu,
};
