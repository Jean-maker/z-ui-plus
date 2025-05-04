# `z-fullscreen-dialog` 全屏弹窗

### 基本用法

:::demo
ZFullscreenDialog/base
:::

### `z-fullscreen-dialog` 属性值

| 参数          | 说明                                                        | 类型     | 可选值 | 默认值 |
| ------------- | ----------------------------------------------------------- | -------- | ------ | ------ |
| visible       | 是否显示 Drawer，支持 .sync 修饰符                          | boolean  | -      | false  |
| title         | z-fullscreen-dialog 的标题                                  | string   | -      | -      |
| showClose     | 是否显示关闭按钮                                            | boolean  | —      | true   |
| showOk        | 是否显示保存按钮                                            | boolean  | —      | true   |
| okLabel       | 保存按钮文字                                                | string   | —      | `保存` |
| closeEvent    | 关闭方法，在弹窗关闭时调用,返回 true 则成功关闭,否则不关闭, | Function | —      | -      |
| isStep        | 是否需要步骤条                                              | boolean  | —      | true   |
| stepActive    | 步骤条初始页码,支持 .sync 修饰符                            | number   | —      | 0      |
| steps         | 步骤名称                                                    | Array    | -      | []     |
| validateSteps | 到下一步校验                                                | Function | —      | -      |

### `z-fullscreen-dialog` Slot

| name        | 说明                             |
| ----------- | -------------------------------- |
| —           | z-fullscreen-dialog 的内容       |
| title       | z-fullscreen-dialog 头部标题     |
| headerMid   | z-fullscreen-dialog 头部中部     |
| headerRight | z-fullscreen-dialog 头部右侧内容 |

### `z-fullscreen-dialog` 事件

| 事件名称 | 说明                                     | 回调参数                                                                                      |
| -------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| open     | z-fullscreen-dialog 打开的回调           | -                                                                                             |
| opened   | z-fullscreen-dialog 打开动画结束时的回调 | -                                                                                             |
| close    | z-fullscreen-dialog 关闭的回调           | -                                                                                             |
| closed   | z-fullscreen-dialog 关闭动画结束时的回调 | -                                                                                             |
| ok       | z-fullscreen-dialog 点击确认按钮         | showLoading(text) 显示加载状态 hideLoading() 关闭加载状态;text 显示文字，默认为 保存数据中... |
