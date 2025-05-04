<template>
  <el-button @click="showDrawer">打开弹窗</el-button>
  <el-button @click="showDrawer2">打开弹窗(带步骤条)</el-button>
  <z-dialog v-model:visible="visible" title="我是一个测试表单" @ok="handleOk"> </z-dialog>
  <z-dialog
    :isStep="true"
    :steps="['第一步', '第二步', '第三步']"
    v-model:stepActive="stepActive"
    v-model:visible="visible2"
    title="我是一个测试表单(步骤条)"
    @ok="handleOk2"
  >
  </z-dialog>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
const visible2 = ref(false);
const stepActive = ref(0);

const showDrawer = () => {
  visible.value = true;
};
const showDrawer2 = () => {
  visible2.value = true;
};
const handleOk = () => {
  setTimeout(() => {
    hideLoading();
    visible.value = false;
  }, 1000);
};
const handleOk2 = () => {
  setTimeout(() => {
    hideLoading();
    visible2.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped></style>
