<template>
  <z-select :options="options" :multiple="true" v-model="value" @change="handleChange"> </z-select>
</template>

<script setup lang="ts">
import { ref } from "vue";
const value = ref("");
const options = ref([
  { value: "test", label: "测试类" },
  { value: "TestRpt", label: "测试报表" },
  { value: "PurchaseRpt", label: "采购报表" },
  { value: "SalesRpt", label: "销售报表" },
  { value: "HrReport", label: "人事报表" },
  { value: "InventoryRpt", label: "库存报表" },
  { value: "BillPrinting", label: "单据套打" }
]);

const handleChange = val => {
  console.log(val);
};
</script>

<style scoped></style>
