<template>
  <div class="z-checkbox">
    <el-checkbox-group v-model="value2">
      <template v-for="(item, index) in options" :key="index">
        <el-checkbox :disabled="disabled" :size="size" :label="item[valueKey]">
          {{ item[labelKey] }}
        </el-checkbox>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { PropType } from "vue";

interface OptionItem {
  [key: string]: any;
}

const props = defineProps({
  value: {
    type: [String, Array] as PropType<string | any[]>,
    default: ""
  },
  labelKey: {
    type: String,
    default: "label"
  },
  valueKey: {
    type: String,
    default: "value"
  },
  options: {
    type: Array as PropType<OptionItem[]>,
    default: () => []
  },
  size: {
    type: String,
    default: "mini"
  },
  disabled: Boolean
});

const emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "change", value: OptionItem[] | undefined): void;
}>();
const value2 = ref([]) as any;
watch(
  () => props.value,
  newVal => {
    if (newVal) {
      value2.value = String(props.value).split(",");
    }
  }
);
watch(value2, newVal => {
  if (newVal) {
    const objs: OptionItem[] = [];
    newVal.forEach(item => {
      const objone = props.options.find(t => t[props.valueKey] == item);
      if (objone) objs.push(objone);
    });
    emit("change", objs);
  }
});

function validatenull(value: any): boolean {
  return value === null || value === undefined || value === "";
}
</script>

<style scoped></style>
