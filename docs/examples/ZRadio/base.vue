<template>
  <z-radio :options="options" v-model="value"> </z-radio>
</template>

<script setup>
import { ref } from "vue";
const value = ref("");
const options = ref([
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" }
]);
</script>

<style lang="scss" scoped></style>
