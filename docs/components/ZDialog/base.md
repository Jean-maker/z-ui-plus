# `z-dialog` 弹窗

### 基本用法

:::demo
ZDialog/base
:::

### `z-dialog` 属性值

| 参数              | 说明                                 | 类型                                   | 可选值                                                                                     | 默认值 |
| ----------------- | ------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| visible           | 是否显示 Drawer，支持 .sync 修饰符   | boolean                                | -                                                                                          | false  |
| width             | drawer 的宽度                        | string/number                          | -                                                                                          | 600    |
| height            | drawer 的高度                        | number                                 | -                                                                                          | 400    |
| title             | z-dialog 的标题                      | string                                 | -                                                                                          | -      |
| modal             | 是否需要遮罩层                       | boolean                                | -                                                                                          | true   |
| closeOnClickModal | 点击遮罩关闭                         | boolean                                | -                                                                                          | false  |
| destroyOnClose    | 关闭时销毁抽屉内的元素               | boolean                                |                                                                                            | false  |
| beforeClose       | 关闭前的回调，会暂停 z-dialog 的关闭 | function(done)，done 用于关闭 z-dialog | —                                                                                          | —      |
| showClose         | 是否显示关闭按钮                     | boolean                                | —                                                                                          | true   |
| showMinBtn        | 是否显示最小化按钮                   | boolean                                | —                                                                                          | true   |
| hasBtns           | 是否需要 drawer 的"取消""确定"按钮   | boolean                                | —                                                                                          | true   |
| isStep            | 是否需要步骤条                       | boolean                                | —                                                                                          | true   |
| stepActive        | 步骤条初始页码,支持 .sync 修饰符     | number                                 | —                                                                                          | 0      |
| steps             | 步骤名称                             | Array                                  | -                                                                                          | []     |
| validateSteps     | 到下一步校验                         | Function                               | —                                                                                          | -      |
| autoHeight        | 动态高度                             | boolean                                | —                                                                                          | false  |
| placement         | 显示位置                             | string                                 | `top`,`top-left`,`top-right`,`left`,`center`,`right`,`bottom-left`,`bottom`,`bottom-right` | center |

### `z-dialog` Slot

| name   | 说明              |
| ------ | ----------------- |
| —      | z-dialog 的内容   |
| header | z-dialog 头部内容 |

### `z-dialog` 事件

| 事件名称 | 说明                          | 回调参数                                                                                      |
| -------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| open     | z-dialog 打开的回调           | -                                                                                             |
| opened   | z-dialog 打开动画结束时的回调 | -                                                                                             |
| close    | z-dialog 关闭的回调           | -                                                                                             |
| closed   | z-dialog 关闭动画结束时的回调 | -                                                                                             |
| ok       | z-dialog 点击确认按钮         | showLoading(text) 显示加载状态 hideLoading() 关闭加载状态;text 显示文字，默认为 保存数据中... |
