import axios from "axios";
//发布商品
const release = (data) => axios.post("/api/admin/goods/release", data);
//删除商品
const remove = (data) => axios.post("/api/admin/goods/del", data);
//编辑商品
const update = (data) => axios.post("/api/admin/goods/updata", data);
//商品列表
const list = (data) => axios.post("/api/admin/goods/list", data);
//商品详情
const detail = (data) => axios.post("/api/admin/goods/detail", data);

export default {
  release,
  remove,
  update,
  list,
  detail,
};
