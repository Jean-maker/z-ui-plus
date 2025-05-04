<template>
  <z-table :columns="columns" :dataSource="tableData" :height="400" :isPage="true">
    <template v-slot:address="scope">
      <el-input size="small" v-model="scope.row.address" placeholder="请输入"> </el-input>
    </template>
    <!-- <el-table-column label="操作" width="180" fixed="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column> -->
  </z-table>
</template>

<script setup lang="ts">
import { ref } from "vue";

const columns = ref([
  { label: "日期", prop: "date", width: "150", fixed: true },
  { label: "姓名", prop: "name", width: "120" },
  {
    label: "所在地",
    props: ["address", "city", "province"],
    children: [
      { label: "省份", prop: "province", width: "120" },
      { label: "市区", prop: "city", width: "120" },
      { label: "地址", prop: "address", width: "300", resizable: false }
    ]
  },

  { label: "邮编", prop: "zip", width: "120", isSummary: true }
]);
const tableData = ref([
  {
    date: "2016-05-03",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-02",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-08",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-06",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  },
  {
    date: "2016-05-07",
    name: "王小虎",
    province: "上海",
    city: "普陀区",
    address: "上海市普陀区金沙江路 1518 弄",
    zip: 200333
  }
]);

const handleEdit = (index, row) => {
  console.log("编辑", row);
};
const handleDelete = (index, row) => {
  console.log("删除", row);
};
</script>

<style scoped></style>
