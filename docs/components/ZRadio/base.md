# `z-radio` 单选框

### 使用说明

:::demo
ZRadio/base
:::

:::

### `z-radio`的属性值

| 参数                   | 说明             | 类型    | 可选值                  | 默认值 |
| ---------------------- | ---------------- | ------- | ----------------------- | ------ |
| value (绑定到 v-model) | 组件绑定值       | string  | -                       | -      |
| labelKey               | 显示字段         | string  | -                       | label  |
| valueKey               | 值字段           | string  | -                       | value  |
| options                | 组件的数据来源   | Array   | -                       | -      |
| size                   | 单选框组的尺寸   | string  | large / default / small | -      |
| border                 | 是否显示边框     | boolean | -                       | false  |
| isButton               | 是否变成按钮样式 | boolean | -                       | false  |
| disabled               | 是否禁用         | boolean | -                       | false  |

### `z-radio` 事件

| 事件名称 | 说明           | 回调参数    |
| -------- | -------------- | ----------- |
| change   | 值改变触发事件 | data 选中值 |
