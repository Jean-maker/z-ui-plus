<template>
  <div>
    <el-input
      ref="main"
      :placeholder="$t(placeholder)"
      v-model="showValue"
      :size="size"
      :clearable="disabled ? false : clearable"
      :disabled="disabled"
      @clear="handleInputClear"
      @focus="handleShow"
    >
      <template #append>
        <el-button icon="el-icon-more" @click="handleShow"></el-button>
      </template>
    </el-input>
    <z-dialog
      :title="$t(placeholder)"
      v-model:visible="dialogVisible"
      :height="height"
      :width="width"
      :hasBtns="multiple"
      @ok="handleSelectMultiple"
      @opened="handleDialogOpened"
    >
      <z-layout class="l-tab-page">
        <l-select-panel
          v-model="value2"
          isChangeSearch
          ref="selectPanel"
          :valueKey="valueKey"
          model="client"
          :columns="myColumns"
          v-model:selectedData="selectedData"
          :multiple="multiple"
          :isPage="isPage"
          :loadSelectTable="loadSelectTable"
          @rowClick="handleSelectPanel"
          style="padding: 8px"
        />
      </z-layout>
    </z-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from "vue";
import type { PropType } from "vue";

interface OptionItem {
  [key: string]: any;
  label?: string;
  value?: any;
}

interface ColumnItem {
  prop: string;
  hidden?: boolean;
  [key: string]: any;
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | Array<any>>,
    default: ""
  },
  placeholder: {
    type: String,
    default: "请选择"
  },
  size: {
    type: String,
    default: "mini"
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 504
  },
  width: {
    type: Number,
    default: 960
  },
  columns: {
    type: Array as PropType<ColumnItem[]>,
    default: () => []
  },
  options: {
    type: Array as PropType<OptionItem[]>,
    default: () => []
  },
  labelKey: {
    type: String,
    default: "label"
  },
  valueKey: {
    type: String,
    default: "value"
  },
  isPage: {
    type: Boolean,
    default: true
  },
  isApi: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "change"]);

const { modelValue, isPage, isApi, code, valueKey, labelKey, options, columns, disabled } = toRefs(props);

const dialogVisible = ref(false);
const selectedData = ref<any[]>([]);
const value2 = ref(modelValue.value);
const main = ref();
const selectPanel = ref();

const myColumns = computed(() => {
  return columns.value.filter(t => !t.hidden);
});

const showValue = computed({
  get: () => {
    if (!modelValue.value) {
      return "";
    }

    if (isPage.value && isApi.value && (window as any).lr_loadDataSourcePage) {
      (window as any).lr_loadDataSourceDataByValue(code.value, valueKey.value, modelValue.value);
    }

    const value = String(modelValue.value);
    const valueList = value.split(",");
    const res = [];
    for (const item of valueList) {
      let v;
      if (isPage.value && isApi.value && (window as any).lr_loadDataSourcePage) {
        v = (window as any).lr_dataSourceDataByValue[`${code.value}_${item}`];
      } else {
        v = options.value.find(t => t[valueKey.value] == item);
      }
      if (v) {
        res.push(v[labelKey.value]);
      } else {
        res.push(item); // 如果找不到值就显示原值
      }
    }
    return res.join(", ");
  },
  set: val => {
    emit("update:modelValue", val);
  }
});

watch(
  modelValue,
  val => {
    value2.value = val;
  },
  { immediate: true }
);

const handleInputClear = () => {
  selectPanel.value?.handleClear();
  handleChange("");
};

const handleChange = (val: any) => {
  emit("change", val);
};

const handleShow = () => {
  if (!disabled.value) {
    dialogVisible.value = true;
  }
};

const tableLoadData = () => {
  selectPanel.value?.init();
};

const loadSelectTable = (postData: any) => {
  if (isPage.value && isApi.value && (window as any).lr_loadDataSourcePage) {
    let whereSql = "";
    if (postData.keyword) {
      for (const col of myColumns.value) {
        if (whereSql) {
          whereSql += " OR ";
        }
        whereSql += `${col.prop} like '%${postData.keyword}%'`;
      }
    }

    return (window as any).lr_loadDataSourcePage(code.value, {
      page: postData.page,
      rows: postData.rows,
      sidx: myColumns.value[0]?.prop || "",
      whereSql: whereSql
    });
  } else {
    return new Promise(resolve => {
      if (options.value.length === 0) {
        resolve({ rows: [] });
      } else {
        const data = options.value.filter(t => {
          for (const col of myColumns.value) {
            const item = (t[col.prop] || "") + "";
            if (item.includes(postData.keyword)) {
              return true;
            }
          }
          return false;
        });

        if (isPage.value) {
          const rows = paginate(postData.page, postData.rows, data);
          resolve({ rows: rows, records: data.length });
        } else {
          resolve({ rows: data });
        }
      }
    });
  }
};

const paginate = (page: number, rows: number, data: any[]) => {
  const start = (page - 1) * rows;
  const end = start + rows;
  return data.slice(start, end);
};

const handleDialogOpened = () => {
  tableLoadData();
};

const handleSelectPanel = (row: any) => {
  emit("update:modelValue", value2.value);
  main.value?.focus();
  main.value?.blur();
  dialogVisible.value = false;
  handleChange(row);
};

const handleSelectMultiple = () => {
  emit("update:modelValue", value2.value);
  main.value?.focus();
  main.value?.blur();
  dialogVisible.value = false;
};
</script>
