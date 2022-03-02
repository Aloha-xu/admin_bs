import axios from "axios";

const loadList = (data) => axios.post("/api/admin/order/list", data);
const updataShipInfo = (data) => axios.post("/api/admin/order/ship", data);
const refund = (data) => axios.post("/api/admin/order/refund", data);
const cancel = (data) => axios.post("/api/admin/order/cancel", data);
const detail = (data) => axios.post("/api/admin/order/detail", data);

export default {
  loadList,
  updataShipInfo,
  refund,
  cancel,
  detail
};
