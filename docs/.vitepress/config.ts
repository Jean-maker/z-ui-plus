import { defineConfig } from "vitepress";
import { mdPlugin } from "./config/plugins";
export default defineConfig({
  title: "TuiPlus基础组件文档",
  description: "基于Element-plus基础组件封装使用",
  lang: "cn-ZH",
  base: "/z-ui-plus/",
  lastUpdated: true,
  themeConfig: {
    logo: "/favicon.ico",
    siteTitle: "ZuiPlus基础组件文档",
    outline: 3,
    socialLinks: [{ icon: "github", link: "https://github.com/Jean-maker/z-ui-plus" }],
    nav: [
      {
        text: "安装指南",
        link: "/components/"
      },
      { text: "基础组件", link: "/components/ZButton/base.md" },
      {
        text: "GitHub地址",
        link: "https://github.com/Jean-maker/z-ui-plus"
      },
      {
        text: "博客",
        items: [{ text: "CSDN", link: "https://blog.csdn.net/Jean_yuanyuan" }]
      }
    ],
    sidebar: {
      "/components": [
        {
          text: "布局",
          items: [
            { text: "z-layout布局", link: "/components/ZLayout/base.md" },
            { text: "z-panel面板", link: "/components/ZPanel/base.md" },
            { text: "z-query查询框", link: "/components/ZQuery/base.md" }
          ]
        },
        {
          text: "弹层",
          items: [
            { text: "z-drawer抽屉", link: "/components/ZDrawer/base.md" },
            { text: "z-dialog弹窗", link: "/components/ZDialog/base.md" },
            { text: "z-fullscreen-dialog全屏弹窗", link: "/components/ZFullscreenDialog/base.md" }
          ]
        },
        {
          text: "表单",
          items: [
            { text: "z-radio单选框", link: "/components/ZRadio/base.md" },
            { text: "z-checkbox多选框", link: "/components/ZCheckbox/base.md" },
            { text: "z-select选择框", link: "/components/ZSelect/base.md" },
            { text: "z-table表格", link: "/components/ZTable/base.md" }
          ]
        },
        {
          text: "常用组件",
          items: [{ text: "Button组件", link: "/components/ZButton/base.md" }]
        }
      ]
    }
  },
  markdown: {
    headers: {
      level: [0, 0]
    },
    // light: #f9fafb, dark: --vp-code-block-bg
    theme: { light: "github-light", dark: "github-dark" },
    config: md => mdPlugin(md)
  }
});
