<template>
  <el-button @click="showDrawer">打开抽屉</el-button>
  <z-drawer v-model:visible="visible" title="我是一个测试表单" @ok="handleOk">
    <div class="z-form-body">
      <el-form :model="formData" :rules="rules" ref="form" label-width="60px">
        <el-col :span="24">
          <el-form-item label="名称" prop="f_Name">
            <el-input v-model="formData.f_Name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编码" prop="f_Code">
            <el-input v-model="formData.f_Code"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </z-drawer>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
const formData = ref({
  f_Name: "",
  f_Code: ""
});
const rules = {
  f_Code: [{ required: true, message: "请输入编码", trigger: "null" }],
  f_Name: [{ required: true, message: "请输入名称", trigger: "null" }]
};
const showDrawer = () => {
  visible.value = true;
};
const handleOk = () => {
  setTimeout(() => {
    hideLoading();
    visible.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped></style>
