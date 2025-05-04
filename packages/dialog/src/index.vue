<template>
  <!-- 'pointer-events': modal ? '' : 'none' -->
  <el-dialog
    v-model="midVisible"
    :modal="modal"
    append-to-body
    :close-on-click-modal="closeOnClickModal"
    :title="title"
    :before-close="beforeClose"
    :destroy-on-close="destroyOnClose"
    :width="`${numberWidth}px`"
    :style="dialogStyle"
    :class="[myClass, { 'jean-dialog-top': !modal }]"
    :show-close="false"
    @open="openDialog"
    @opened="openedDialog"
    @close="closeDialog"
    @closed="closedDialog"
  >
    <template #header>
      <div class="z-dialog-header" :style="{ cursor: !autoHeight && !isMin ? 'move' : '' }" @mousedown="onMousedown">
        <slot name="title">
          <div class="el-dialog__title" :title="title">
            <span class="el-dialog__title__text">{{ title }}</span>
          </div>
        </slot>
        <div class="z-dialog-header-icons">
          <button v-if="showMinBtn" @click="handleMin" type="button" class="el-dialog__headerbtn">
            <i :class="['el-dialog__close', { 'jean-icon-unfold': isMin }, { 'jean-icon-narrow': !isMin }]"></i>
          </button>
          <el-button v-if="showClose" @click="handleClose" :icon="Close" text> </el-button>
        </div>
      </div>
    </template>
    <div
      v-show="!isMin"
      v-loading="loading"
      :element-loading-text="loadingText"
      :class="['z-dialog-window', { 'z-dialog-window-hasBtns': hasBtns }, { 'z-dialog-window-hasSteps': isStep }]"
      :style="{ height: autoHeight ? 'auto' : heightComputed + 'px' }"
    >
      <el-steps v-if="isStep" :active="stepActive" simple finish-status="success">
        <el-step v-for="(item, index) in steps" :key="index" :title="item"></el-step>
      </el-steps>

      <slot></slot>

      <div class="z-dialog-btns" v-if="hasBtns">
        <slot name="btns">
          <el-button v-if="isStep" @click="prev" :plain="theme == 'dark'" size="small" :disabled="stepPrevBtn">上一步 </el-button>
          <el-button
            v-if="isStep"
            @click="next"
            :plain="theme == 'dark'"
            size="small"
            :disabled="stepNextBtn"
            :loading="nextBtnLoading"
            >下一步</el-button
          >
          <el-button v-if="!isStep && showClose" :plain="theme == 'dark'" size="small" @click="handleClose"> 取消 </el-button>
          <el-button :plain="theme == 'dark'" size="small" type="primary" @click="handleOk" :disabled="stepSaveBtn && isStep">{{
            isStep ? "完成" : "确定"
          }}</el-button>
        </slot>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { Close } from "@element-plus/icons-vue";
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  title: String,
  visible: {
    type: Boolean
  },
  width: {
    type: [String, Number],
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  modal: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  beforeClose: Function,
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  hasBtns: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showMinBtn: {
    type: Boolean,
    default: false
  },
  autoHeight: {
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
  validateSteps: Function,
  theme: {
    type: String,
    default: "default" // dark
  },
  placement: {
    type: String,
    default: "center" // 'top' 'top-left' 'top-right' 'left' 'center' 'right' 'bottom-left' 'bottom' 'bottom-right'
  }
});

const emit = defineEmits(["update:visible", "update:stepActive", "ok", "close", "closed", "open", "opened"]);
const isDragging = ref(false);
const loading = ref(false);
const loadingText = ref("");
const midVisible = ref(false);
const nextBtnLoading = ref(false);

const stepPrevBtn = ref(true);
const stepNextBtn = ref(false);
const stepSaveBtn = ref(true);

const move = ref({
  isMove: false,
  left: 0,
  top: 0,
  startX: 0,
  startY: 0,
  originX: 0, // 初始X位置
  originY: 0, // 初始Y位置
  currentX: 0,
  currentY: 0
});

const isMin = ref(false);

const heightComputed = computed(() => {
  let _height = props.height;
  if (typeof _height === "string") {
    if (_height.includes("px")) {
      _height = Number(height.replace("px", ""));
    } else if (_height.includes("%")) {
      _height = (Number(_height.replace("%", "")) * window.innerHeight) / 100;
    }
  }

  // 限制最大高度（视窗高度 - 头部高度 - 安全边距）
  const maxHeight = window.innerHeight - 40 - 32;
  return Math.min(_height, maxHeight);
});

const numberWidth = computed(() => {
  let width = props.width;

  // 处理百分比/px/数字
  if (typeof width === "string") {
    if (width.includes("px")) {
      width = Number(width.replace("px", ""));
    } else if (width.includes("%")) {
      width = (Number(width.replace("%", "")) * window.innerWidth) / 100;
    }
  }

  // 限制最大宽度（视口宽度 - 安全边距）
  const maxWidth = window.innerWidth - 32;
  return Math.min(width, maxWidth);
});

const myClass = computed(() => {
  let _class = "";

  if (props.theme == "dark") {
    _class = "z-dialog-dark";
  } else {
    _class = "z-dialog";
  }
  if (isMin.value) {
    _class += ` z-dialog-min z-dialog-bottom-right`;
  } else {
    if (props.autoHeight) {
      _class += ` z-dialog-${props.placement}`;
    }
  }
  return _class;
});
const dialogStyle = computed(() => {
  // 只在有实际移动时应用位置样式
  return move.value.left !== 0 || move.value.top !== 0
    ? {
        position: "fixed",
        left: `${move.value.left}px`,
        top: `${move.value.top}px`,
        margin: "0",
        transform: "none"
      }
    : {};
});
watch(
  () => props.visible,
  n => {
    midVisible.value = n;
  }
);

watch(
  () => props.stepActive,
  () => {
    updateBtnState();
  }
);

function handleClose() {
  // midVisible.value = false;
  closeDialog();
}

function handleOk() {
  emit("ok", showLoading, hideLoading);
}

function handleMin() {
  isMin.value = !isMin.value;
}

function closeDialog() {
  emit("update:visible", false);
  emit("close");
}

function closedDialog() {
  move.value = {
    isMove: false,
    left: 0,
    top: 0,
    startX: 0,
    startY: 0,
    originX: 0, // 初始X位置
    originY: 0, // 初始Y位置
    currentX: 0,
    currentY: 0
  };
  isMin.value = false;
  isDragging.value = false;
  if (props.isStep) {
    emit("update:stepActive", 0);
    nextTick(() => {
      updateBtnState();
    });
  }
  emit("closed");
}

function openDialog() {
  emit("open");
}

function openedDialog() {
  emit("opened", showLoading, hideLoading);
}

function showLoading(text) {
  loadingText.value = text || "保存数据中...";
  loading.value = true;
}

function hideLoading() {
  loading.value = false;
}

// 带步骤的表单
function prev() {
  if (props.stepActive > 0) {
    emit("update:stepActive", props.stepActive - 1);
  }
  nextTick(() => {
    updateBtnState();
  });
}

async function next() {
  if (await myValidateSteps()) {
    if (props.stepActive < props.steps.length - 1) {
      emit("update:stepActive", props.stepActive + 1);
    }
    nextTick(() => {
      updateBtnState();
    });
  }
}

function updateBtnState() {
  stepSaveBtn.value = true;
  stepNextBtn.value = true;
  stepPrevBtn.value = true;
  switch (props.stepActive) {
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
}

async function myValidateSteps() {
  nextBtnLoading.value = true;
  if (props.validateSteps) {
    const res = await props.validateSteps(props.stepActive);
    nextBtnLoading.value = false;
    return res;
  }
  nextBtnLoading.value = false;
  return true;
}

function onMousedown(e) {
  const dialogEl = document.querySelector(".el-dialog");
  if (props.autoHeight || isMin.value || !dialogEl) return;

  // 阻止默认行为，但不再阻止冒泡
  e.preventDefault();

  move.value = {
    isMove: true,
    pageX: e.pageX,
    pageY: e.pageY,
    left: move.value.left || 0,
    top: move.value.top || 0,
    startX: e.clientX,
    startY: e.clientY,
    originX: dialogEl.offsetLeft, // 初始X位置
    originY: dialogEl.offsetTop, // 初始Y位置
    currentX: dialogEl.offsetLeft,
    currentY: dialogEl.offsetTop
  };

  // 直接绑定事件，不使用requestAnimationFrame
  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("mouseup", onMouseup);
}

function onMousemove(e) {
  if (!move.value.isMove) return;

  // 计算鼠标偏移量
  const deltaX = e.clientX - move.value.startX;
  const deltaY = e.clientY - move.value.startY;

  // 计算新坐标
  let newX = move.value.originX + deltaX;
  let newY = move.value.originY + deltaY;

  // 获取弹窗实际宽度（兼容百分比/px/数字）
  const dialogWidth = numberWidth.value;

  // X轴边界限制
  const minX = 0;
  const maxX = window.innerWidth - dialogWidth;
  newX = Math.max(minX, Math.min(newX, maxX));

  // Y轴边界限制
  const minY = 0;
  const maxY = window.innerHeight - heightComputed.value - 40;
  newY = Math.max(minY, Math.min(newY, maxY));

  // 更新坐标
  move.value.currentX = newX;
  move.value.currentY = newY;
  move.value.left = move.value.currentX; // 存储到状态
  move.value.top = move.value.currentY;
}

function onMouseup() {
  move.value.isMove = false;
  move.value.left = move.value.currentX; // 存储到状态
  move.value.top = move.value.currentY;
  document.removeEventListener("mousemove", onMousemove);
  document.removeEventListener("mouseup", onMouseup);
}
</script>

<style lang="less">
:deep(.el-overlay) {
  pointer-events: v-bind('modal ? "auto" : "none"');
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

/* 重置Element Plus的默认transform */
:deep(.el-dialog) {
  margin: 0 !important;
  transform: none !important;
  position: relative; /* 初始使用relative定位 */
}

/* 拖动时使用fixed定位 */
:deep(.el-dialog.is-dragging) {
  position: fixed !important;
}

/* 确保弹窗内容始终可见 */
:deep(.el-dialog__body) {
  overflow: visible !important;
}
@import "./index.less";
</style>
