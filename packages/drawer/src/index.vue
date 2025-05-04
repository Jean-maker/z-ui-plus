<template>
  <el-drawer
    :append-to-body="appendToBody"
    :model-value="visible"
    :direction="direction"
    :size="mySize"
    :with-header="false"
    :wrapper-closable="wrapperClosable"
    :destroy-on-close="destroyOnClose"
    :modal="modal"
    :before-close="beforeClose"
    :close-on-press-escape="closeOnPressEscape"
    custom-class="z-drawer"
    @open="openDrawer"
    @opened="openedDrawer"
    @close="closeDrawer"
    @closed="closedDrawer"
  >
    <div :class="['z-drawer--wrapper', customClass]" v-loading="loading" :element-loading-text="loadingText">
      <div v-if="withHeader" class="z-drawer--header">
        <slot name="header">
          <div class="z-drawer--title">{{ title }}</div>
          <div class="z-drawer--btns">
            <el-button size="small" text @click="handleClose">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </slot>
      </div>
      <div class="z-drawer--body" :style="{ 'padding-bottom': showClose || showOk ? '48px' : '0' }">
        <!-- <el-input style="position: absolute; top: -200px"></el-input> -->
        <div class="z-rblock">
          <slot></slot>
        </div>
        <div class="z-drawer-bottom-btns" v-if="showClose || showOk">
          <el-button v-if="showClose" size="small" @click="handleClose">
            {{ closeBtnLabel }}
          </el-button>
          <slot name="btns"></slot>
          <el-button v-if="showOk" size="small" type="primary" @click="handleOk">
            {{ okBtnLabel }}
          </el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Close } from "@element-plus/icons-vue";

const props = defineProps({
  title: String,
  visible: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: "rtl",
    validator: (val: string) => ["ltr", "rtl", "ttb", "btt"].includes(val)
  },
  size: {
    type: String,
    default: "600px"
  },
  width: Number,
  modal: {
    type: Boolean,
    default: true
  },
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  withHeader: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showOk: {
    type: Boolean,
    default: true
  },
  okBtnLabel: {
    type: String,
    default: "确定"
  },
  closeBtnLabel: {
    type: String,
    default: "取消"
  },
  customClass: String,
  appendToBody: {
    type: Boolean,
    default: true
  },
  beforeClose: Function,
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  wrapperClosable: {
    type: Boolean,
    default: false
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
  validateSteps: Function
});

const emit = defineEmits(["update:visible", "ok", "close", "closed", "open", "opened"]);

const loading = ref(false);
const loadingText = ref("");

const mySize = computed(() => {
  return props.width ? `${props.width}px` : props.size;
});

const handleClose = () => {
  emit("update:visible", false);
};

const handleOk = () => {
  emit("ok", showLoading, hideLoading);
};

const closeDrawer = () => {
  emit("update:visible", false);
  emit("close");
};

const closedDrawer = () => {
  emit("closed");
};

const openDrawer = () => {
  emit("open");
};

const openedDrawer = () => {
  emit("opened", showLoading, hideLoading);
};

const showLoading = (text?: string) => {
  loadingText.value = text || "保存数据中...";
  loading.value = true;
};

const hideLoading = () => {
  loading.value = false;
};
</script>

<style lang="less">
@import "./index.less";
</style>
