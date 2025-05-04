<template>
  <z-checkbox :options="data" v-model="value"> </z-checkbox>
</template>

<script setup lang="ts">
import { ref } from "vue";
const value = ref("");
const data = ref([
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" }
]);
</script>

<style scoped></style>
