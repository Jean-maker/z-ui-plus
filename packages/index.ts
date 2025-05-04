import type { Component, App } from "vue";

import ZButton from "./button";
import ZLayout from "./layout";
import ZPanel from "./panel";
import ZQuery from "./query";
import ZDrawer from "./drawer";
import ZDialog from "./dialog";
import ZFullscreenDialog from "./fullscreenDialog";
import ZRadio from "./radio";
import ZCheckbox from "./checkbox";
import ZSelect from "./select";
import ZLayerSelect from "./layerSelect";
import ZTable from "./table";
import ZPagination from "./pagination";

// 存储组件列表
const components: {
  [propName: string]: Component;
} = {
  ZButton,
  ZLayout,
  ZPanel,
  ZQuery,
  ZDrawer,
  ZDialog,
  ZFullscreenDialog,
  ZRadio,
  ZCheckbox,
  ZSelect,
  ZLayerSelect,
  ZTable,
  ZPagination
};

// 插件声明：声明所有插件
// 插件注册：在 Vue 项目的入口文件中，通过 ( app.use(插件) ) 进行注册
const installComponents: any = (app: App) => {
  // components.forEach((comp: any) => {
  //   app.component(comp.name as string, comp)
  // })
  //   app.use(ElementPlus, {
  //     locale // 语言设置
  //   // size: Cookies.get('size') || 'medium' // 设置默认尺寸
  // })
  for (const key in components) {
    app.component(key, components[key]);
  }
};
// vue插件
// - install：每个插件都有一个 install 方法
// - 参数：是通过 Vue.createApp() 创建的 app 实例
const install: any = (app: any, router?: any) => {
  // !router && installRouter(app);
  installComponents(app);
};
// @ts-ignore
if (typeof window !== "undefined" && window.Vue) {
  // @ts-ignore
  install(window.Vue);
}
// 按需引入
export {
  ZButton,
  ZLayout,
  ZPanel,
  ZQuery,
  ZDrawer,
  ZDialog,
  ZFullscreenDialog,
  ZRadio,
  ZCheckbox,
  ZSelect,
  ZLayerSelect,
  ZTable,
  ZPagination
};

/**
 * @description 公共方法
 */
// export { throttle, debounce, formatNumber };

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install
};
