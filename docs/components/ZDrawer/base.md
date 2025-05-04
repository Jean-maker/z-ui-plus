# `z-drawer` 抽屉

### 基本用法

:::demo
ZDrawer/base
:::

### `z-drawer` 属性值

| 参数               | 说明                                                                                            | 类型                                   | 可选值          | 默认值 |
| ------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------- | --------------- | ------ |
| title              | z-drawer 的标题                                                                                 | string                                 | -               | -      |
| visible            | 是否显示 Drawer，支持 .sync 修饰符                                                              | boolean                                | -               | false  |
| direction          | z-drawer 打开的方向                                                                             | string                                 | rtl/ltr/ttb/btt | rtl    |
| width              | 窗体的宽度                                                                                      | number                                 | -               | 600    |
| modal              | 是否需要遮罩层                                                                                  | boolean                                | -               | true   |
| destroyOnClose     | 关闭时销毁抽屉内的元素                                                                          | boolean                                |                 | true   |
| withHeader         | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 header slot 均不生效 | boolean                                |                 | true   |
| showClose          | 是否显示关闭按钮                                                                                | boolean                                | —               | true   |
| showOk             | 是否显示确认按钮                                                                                | boolean                                | —               | true   |
| okBtnLabel         | 确认按钮文字                                                                                    | string                                 | —               | 确定   |
| closeBtnLabel      | 取消按钮显示文字                                                                                | string                                 | —               | 取消   |
| customClass        | z-drawer 的自定义类名                                                                           | string                                 | —               | —      |
| appendToBody       | z-drawer 自身是否插入至 body 元素上。嵌套的 z-drawer 必须指定该属性并赋值为 true                | boolean                                | —               | false  |
| beforeClose        | 关闭前的回调，会暂停 z-drawer 的关闭                                                            | function(done)，done 用于关闭 z-drawer | —               | —      |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭 z-drawer                                                              | boolean                                | —               | true   |
| wrapperClosable    | 点击遮罩层是否可以关闭 z-drawer                                                                 | boolean                                | —               | false  |

### `z-drawer` Slot

| name   | 说明              |
| ------ | ----------------- |
| —      | z-drawer 的内容   |
| header | z-drawer 头部内容 |

### `z-drawer` 事件

| 事件名称 | 说明                          | 回调参数                                                                                      |
| -------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| open     | z-drawer 打开的回调           | -                                                                                             |
| opened   | z-drawer 打开动画结束时的回调 | showLoading(text) 显示加载状态 hideLoading() 关闭加载状态;text 显示文字，默认为 保存数据中... |
| close    | z-drawer 关闭的回调           | -                                                                                             |
| closed   | z-drawer 关闭动画结束时的回调 | -                                                                                             |
| ok       | z-drawer 点击确认按钮         | showLoading(text) 显示加载状态 hideLoading() 关闭加载状态;text 显示文字，默认为 保存数据中... |
