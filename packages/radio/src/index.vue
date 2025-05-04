<template>
  <div class="z-radio">
    <el-radio-group v-model="value2" :size="size">
      <template v-for="(item, index) in options" :key="index">
        <el-radio v-if="!isButton" :disabled="disabled" :border="border" :label="item[valueKey]">
          {{ item[labelKey] }}
        </el-radio>
        <el-radio-button v-else :disabled="disabled" :label="item[valueKey]">
          {{ item[labelKey] }}
        </el-radio-button>
      </template>
    </el-radio-group>
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
    type: [String, Number] as PropType<string | number>,
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
    default: "default"
  },
  border: Boolean,
  isButton: Boolean,
  disabled: Boolean
});

const emit = defineEmits<{
  (e: "input", value: string | number): void;
  (e: "change", value: OptionItem | undefined): void;
}>();

const value2 = ref("") as any;
watch(
  () => props.value,
  newVal => {
    if (newVal) {
      value2.value = props.value;
    }
  }
);
watch(value2, newVal => {
  if (newVal) {
    emit("change", newVal);
  }
});
</script>

<style scoped></style>
