import axios from "axios";

const remove = (data) => axios.post("/api/upload", data);

export default {
  remove,
};
