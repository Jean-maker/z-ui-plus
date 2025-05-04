<template>
  <div style="position: relative; height: 300px; width: 100%; background: #f0f2f5; padding: 8px">
    <div style="position: relative; height: 280px; width: 100%; background: #fff; padding-top: 10px">
      <z-query :items="queryItems" :formData="queryData" @search="handleSearch" @reset="resetQuery">
        <template #name>
          <el-input v-model="queryData.name" placeholder="请输入姓名" />
        </template>
        <template #name1>
          <el-input v-model="queryData.name1" placeholder="请输入姓名1" />
        </template>
        <template #name2>
          <el-input v-model="queryData.name2" placeholder="请输入姓名2" />
        </template>
      </z-query>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 查询参数
const queryData = ref({
  name: "",
  name1: "",
  name2: ""
});

const queryItems = ref([
  { label: "姓名", prop: "name" },
  { label: "姓名1", prop: "name1" },
  { label: "姓名2", prop: "name2" }
]);

const handleSearch = () => {
  console.log("搜索");
};
const resetQuery = () => {
  console.log("重置");
};
</script>

<style lang="scss" scoped></style>
