import { Menu } from "@/api/index";
//根据角色加载侧边栏菜单
const LoadMenu = async ({ commit, state }, formData) => {
  let { status, data } = await Menu.loadTree(formData);
  if (status) {
    // 储存到state
    commit("StoreMenu", data);
  }
  return { status, data };
};
//编辑菜单
const EditMenu = async ({ commit, state }, menuData) => {
  let { status, msg } = await Menu.update(menuData);
  if (status) {
    // 储存到state
    commit("UpdateMenu", menuData);
  }
  return { status, msg };
};
//添加菜单
const CreateMenu = async ({ commit, state }, menuData) => {
  let { status, msg, data } = await Menu.add(menuData);
  if (status) {
    // 储存到state
    commit("AppendMenu", { ...data, ...menuData });
  }
  return { status, msg, data };
};
//删除菜单
const RemoveMenu = async ({ commit, state }, menuId) => {
  console.log(menuId);
  let { status, msg } = await Menu.del(menuId);
  if (status) {
    // 储存到state
    commit("DeleteMenu", menuId);
  }
  return { status, msg };
};

export default {
  LoadMenu,
  EditMenu,
  CreateMenu,
  RemoveMenu,
};
