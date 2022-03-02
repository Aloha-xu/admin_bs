import axios from "axios";

const loadList = (data) => axios.post("/api/admin/order/list", data);

export default {
  loadList,
};
