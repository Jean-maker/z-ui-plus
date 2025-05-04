<template>
  <el-dialog
    v-model="midVisible"
    :append-to-body="true"
    class="z-fullscreen-dialog"
    :fullscreen="true"
    :show-close="false"
    width="100%"
    @close="closeDialog"
    @closed="closedDialog"
    @open="openDialog"
    @opened="openedDialog"
  >
    <div class="z-rblock" style="padding-top: 57px" v-loading="loading" :element-loading-text="loadingText">
      <div class="z-fullscreen-dialog--header">
        <div class="z-fullscreen-dialog--title">
          <slot name="title">
            <img v-if="logoImg" class="z-fullscreen-dialog--logo" :src="logoImg" />
            <p class="z-fullscreen-dialog--title-text">{{ title }}</p>
          </slot>
        </div>
        <div class="z-fullscreen-dialog--mid">
          <slot name="headerMid">
            <el-steps v-if="isStep" simple :active="stepActive" :space="160" finish-status="success">
              <el-step v-for="(item, index) in steps" :key="index" :title="item"></el-step>
            </el-steps>
          </slot>
        </div>
        <div class="z-fullscreen-dialog--right">
          <el-button v-if="isStep" @click="prev" size="small" :disabled="stepPrevBtn">上一步</el-button>
          <el-button v-if="isStep" @click="next" size="small" :disabled="stepNextBtn" :loading="nextBtnLoading">下一步</el-button>
          <slot name="headerRight"></slot>
          <el-button size="small" v-if="showOk" type="primary" @click="handleOk" :disabled="stepSaveBtn && isStep">{{
            okLabel
          }}</el-button>
          <el-divider class="z-fullscreen-dialog-divider" direction="vertical"></el-divider>
          <el-button
            class="z-fullscreen-dialog-close"
            size="small"
            v-if="showClose"
            @click="handleClose"
            :icon="Close"
            type="text"
          ></el-button>
        </div>
      </div>
      <div class="z-fullscreen-dialog--body">
        <slot></slot>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Close } from "@element-plus/icons-vue";

const props = defineProps({
  visible: {
    type: Boolean
  },
  title: String,
  showClose: {
    type: Boolean,
    default: true
  },
  showOk: {
    type: Boolean,
    default: true
  },
  okLabel: {
    type: String,
    default: "保存"
  },
  isStep: {
    type: Boolean,
    default: false
  },
  stepActive: {
    type: Number,
    default: 0
  },
  steps: {
    type: Array,
    default: () => []
  },
  validateSteps: Function,
  closeEvent: Function
});

const emit = defineEmits(["update:visible", "update:stepActive", "ok", "close", "closed", "open", "opened"]);

const loading = ref(false);
const loadingText = ref("");
const midVisible = ref(false);
const nextBtnLoading = ref(false);

const stepPrevBtn = ref(true);
const stepNextBtn = ref(false);
const stepSaveBtn = ref(true);

watch(
  () => props.visible,
  n => {
    midVisible.value = n;
  }
);

const myStepActive = ref(props.stepActive);
watch(myStepActive, newVal => {
  emit("update:stepActive", newVal);
});
const logoImg = computed(() => {
  if (rootUrl.value) {
    return `${rootUrl.value}img/admin/logo_blue.png`;
  }
  return "";
});

const rootUrl = ref("");

// 带步骤的表单
const prev = () => {
  if (myStepActive.value > 0) {
    myStepActive.value--;
  }
  updateBtnState();
};

const next = async () => {
  if (await myValidateSteps()) {
    if (myStepActive.value < props.steps.length - 1) {
      myStepActive.value++;
    }
    updateBtnState();
  }
};

const updateBtnState = () => {
  stepSaveBtn.value = true;
  stepNextBtn.value = true;
  stepPrevBtn.value = true;
  switch (myStepActive.value) {
    case 0:
      stepNextBtn.value = false;
      break;
    case props.steps.length - 1:
      stepPrevBtn.value = false;
      stepSaveBtn.value = false;
      break;
    default:
      stepPrevBtn.value = false;
      stepNextBtn.value = false;
      break;
  }
};

const myValidateSteps = async () => {
  nextBtnLoading.value = true;
  if (props.validateSteps) {
    const res = await props.validateSteps(props.stepActive);
    nextBtnLoading.value = false;
    return res;
  }
  nextBtnLoading.value = false;
  return true;
};

const handleClose = async () => {
  if (props.closeEvent) {
    if (await props.closeEvent()) {
      midVisible.value = false;
    }
  } else {
    midVisible.value = false;
  }
};

const handleOk = () => {
  emit("ok", showLoading, hideLoading);
};

const showLoading = text => {
  loadingText.value = text || "保存数据中...";
  loading.value = true;
};

const hideLoading = () => {
  loading.value = false;
};

const closeDialog = () => {
  emit("update:visible", false);
  emit("close");
};

const closedDialog = () => {
  if (props.isStep) {
    myStepActive.value = 0;
    updateBtnState();
  }
  emit("closed");
};

const openDialog = () => {
  emit("open");
};

const openedDialog = () => {
  emit("opened", showLoading, hideLoading);
};

const reset = () => {
  myStepActive.value = 0;
  updateBtnState();
};

defineExpose({
  showLoading,
  hideLoading,
  reset
});
</script>

<style lang="less">
@import "./index.less";
</style>
