import axios from "axios";
const add = (data) => axios.post("/api/banner/add", data);
const del = (data) => axios.post("/api/banner/del", data);
const update = (data) => axios.post("/api/banner/update", data);
const list = (data) => axios.post("/api/banner/list", data);
export default {
    add,
    update,
    list,
    del
};
