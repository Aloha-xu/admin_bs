import axios from "axios";

const remove = (params) => axios.post("/api/upload", { params });

export default {
  remove,
};
