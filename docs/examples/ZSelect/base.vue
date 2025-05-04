<template>
  <z-select valueKey="code" :options="options" v-model="value" @change="handleChange"> </z-select>
</template>

<script setup lang="ts">
import { ref } from "vue";
const value = ref("");
const options = ref([
  {
    id: 1,
    label: "一级 1",
    pid: "0",
    code: "1"
  },
  {
    id: 2,
    label: "一级 2",
    pid: "1",
    code: "2"
  }
]);
const handleChange = val => {
  console.log(val);
};
</script>

<style scoped></style>
