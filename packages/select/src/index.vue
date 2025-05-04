<template>
  <el-select
    ref="main"
    class="z-select"
    :size="size"
    v-model="value2"
    :collapse-tags="collapseTags"
    :multiple="multiple"
    :value-key="valueKey"
    :disabled="disabled"
    :placeholder="placeholder"
    :filterable="filterable"
    :filter-method="filterMethod"
    :clearable="clearable"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
  >
    <el-option v-for="(item, index) in options" :key="index" :label="item[labelKey]" :value="item[valueKey]" />
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { PropType } from "vue";

interface OptionItem {
  [key: string]: any;
}

const props = defineProps({
  value: {
    type: [String, Number, Array] as PropType<string | number | any[]>,
    default: ""
  },
  placeholder: String,
  labelKey: {
    type: String,
    default: "label"
  },
  valueKey: {
    type: String,
    default: "value"
  },
  size: {
    type: String,
    default: "default"
  },
  options: {
    type: Array as PropType<OptionItem[]>,
    default: () => []
  },
  disabled: Boolean,
  filterable: {
    type: Boolean,
    default: true
  },
  filterMethod: {
    type: Function as PropType<(query: string) => void>,
    default: undefined
  },
  multiple: Boolean,
  collapseTags: Boolean,
  clearable: {
    type: Boolean,
    default: true
  }
});

const value2 = ref("") as any;
const emit = defineEmits<{
  (e: "input", value: string | number | any[]): void;
  (e: "change", value: OptionItem | OptionItem[] | undefined): void;
  (e: "clear"): void;
  (e: "visibleChange", value: boolean): void;
}>();

// const value2 = computed({
//   get: () => {
//     if (props.multiple) {
//       if (props.value && !validatenull(props.value)) {
//         return String(props.value).split(",");
//       } else {
//         return [];
//       }
//     } else {
//       return props.value;
//     }
//   },
//   set: (val: any) => {
//     if (props.multiple) {
//       emit("input", Array.isArray(val) ? val.join(",") : "");
//     } else {
//       emit("input", val as string | number);
//     }
//   }
// });
watch(
  () => props.value,
  newVal => {
    if (props.multiple) {
      if (newVal && !validatenull(newVal)) {
        value2.value = String(newVal).split(",");
      } else {
        value2.value = [];
      }
    } else {
      value2.value = newVal;
    }
  }
);
watch(value2, newVal => {
  if (props.multiple) {
    emit("input", Array.isArray(newVal) ? newVal.join(",") : "");
  } else {
    emit("input", newVal as string | number);
  }
});
const handleChange = (val: any) => {
  if (props.multiple) {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      emit("change", undefined);
      return;
    }
    const objs: OptionItem[] = [];
    (val as any[]).forEach(item => {
      const objone = props.options.find(t => t[props.valueKey] == item);
      if (objone) objs.push(objone);
    });
    emit("change", objs);
  } else {
    if (!val || val === "") {
      emit("change", undefined);
      return;
    }
    const obj = props.options.find(t => t[props.valueKey] == val);
    emit("change", obj);
  }
};

const handleClear = () => {
  emit("clear");
};

const handleVisibleChange = (e: boolean) => {
  emit("visibleChange", e);
};

// Implement or import your validation function
function validatenull(value: any): boolean {
  return value === null || value === undefined || value === "";
}
</script>

<style scoped></style>
