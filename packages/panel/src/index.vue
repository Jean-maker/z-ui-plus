<template>
  <div class="z-panel">
    <div class="z-panel--wrapper" :style="{ 'padding-top': paddingTop }">
      <div v-if="title || $slots.title" class="l-panel--title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.toolLeft || $slots.toolRight" class="z-panel--tool" :style="{ top: toolTop }">
        <div class="z-panel--tool-left">
          <slot name="toolLeft"></slot>
        </div>
        <div class="z-panel--tool-right">
          <slot name="toolRight"></slot>
        </div>
      </div>
      <el-scrollbar class="z-panel--body">
        <slot></slot>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts" name="ZPanel">
import { computed, useSlots } from "vue";

const props = defineProps({
  title: String,
  loading: {
    type: Boolean,
    default: false
  }
});

const slots = useSlots();

const paddingTop = computed(() => {
  let ptop = 0;
  if (props.title || slots.title) {
    ptop += 40;
  }
  if (slots.toolLeft || slots.toolRight) {
    ptop += 40;
  }
  return `${ptop}px`;
});

const toolTop = computed(() => {
  return props.title || slots.title ? "40px" : "0";
});
</script>

<style lang="less">
@import "./index.less";
</style>
