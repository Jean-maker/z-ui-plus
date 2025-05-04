# `z-checkbox` 多选框

### 基本用法

:::demo
ZCheckbox/base
:::

### `z-checkbox`的属性值

| 参数     | 说明           | 类型                | 可选值                  | 默认值  |
| -------- | -------------- | ------------------- | ----------------------- | ------- |
| value    | 组件绑定的值   | string/number/array | -                       | -       |
| labelKey | 显示字段       | string              | -                       | label   |
| valueKey | 值字段         | string              | -                       | value   |
| options  | 多选框数据来源 | Array               | -                       | -       |
| size     | 组件的尺寸     | string              | large / default / small | default |
| disabled | 是否禁用       | boolean             | -                       | false   |

### `z-checkbox` 事件

| 事件名称 | 说明           | 回调参数    |
| -------- | -------------- | ----------- |
| change   | 值改变触发事件 | data 选中值 |
