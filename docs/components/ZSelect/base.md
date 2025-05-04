# `z-select` 选择框

### 使用说明

### 基础用法

:::demo
ZSelect/base
:::

:::

### 多选

:::demo
ZSelect/multiple
:::

### 多选,折叠选中项

:::demo
ZSelect/collapseTags
:::

### `z-select` 属性值

| 参数         | 说明               | 类型     | 可选值                  | 默认值  |
| ------------ | ------------------ | -------- | ----------------------- | ------- |
| value        | 组件绑定的值       | string   | -                       | -       |
| placeholder  | 选择框占位符       | string   | -                       | -       |
| labelKey     | 显示字段           | string   | -                       | label   |
| valueKey     | 值字段             | string   | -                       | value   |
| size         | 组件的尺寸         | string   | large / default / small | default |
| options      | 选择框里的数据来源 | Array    | -                       | []      |
| disabled     | 是否禁用           | boolean  | true/false              | false   |
| filterable   | 是否可以搜索       | boolean  | true/false              | true    |
| filterMethod | 自定义搜索方法     | function | -                       | -       |
| clearable    | 是否可以清空选项   | boolean  | -                       | false   |
| collapseTags | 多选时折叠选中值   | boolean  | -                       | false   |
| multiple     | 是否可以多选       | boolean  | -                       | false   |

### `z-select` 事件

| 事件名称       | 说明                   | 回调参数    |
| -------------- | ---------------------- | ----------- |
| change         | 值改变触发事件         | data 选中值 |
| clear          | 值清空事件             | -           |
| veisibleChange | 下拉框显示状态改变触发 | 显示状态    |
