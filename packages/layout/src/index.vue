<template>
  <div class="z-layout" :style="{ 'padding-left': leftWidth }">
    <div class="z-layout--left" :style="{ width: leftWidth }">
      <div class="z-layout--wrapper"><slot name="left"></slot></div>
      <div v-if="leftMove" class="z-layout--move" @mousedown="onMousedown('left', $event)"></div>
    </div>
    <div class="z-layout--container" :style="{ 'padding-right': rightWidth }">
      <div class="z-layout--right" :style="{ width: rightWidth }">
        <div class="z-layout--wrapper"><slot name="right"></slot></div>
        <div v-if="rightMove" class="z-layout--move" @mousedown="onMousedown('right', $event)"></div>
      </div>
      <div class="z-layout--container" :style="{ 'padding-bottom': bottomHeight }">
        <div class="z-layout--bottom" :style="{ height: bottomHeight }">
          <div class="z-layout--wrapper"><slot name="bottom"></slot></div>
          <div v-if="bottomMove" class="z-layout--move" @mousedown="onMousedown('bottom', $event)"></div>
        </div>
        <div class="z-layout--container" :style="{ 'padding-top': topHeight }">
          <div class="z-layout--top" :style="{ height: topHeight }">
            <div class="z-layout--wrapper"><slot name="top"></slot></div>
            <div v-if="topMove" class="z-layout--move" @mousedown="onMousedown('top', $event)"></div>
          </div>
          <div class="z-layout--wrapper" ref="mid">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ZLayout">
import { ref, computed, watch } from "vue";

interface MoveState {
  type: string;
  isMove: boolean;
  pageX: number;
  pageY: number;
  size: number;
  h: number;
  w: number;
}

const props = defineProps({
  left: {
    type: Number,
    default: 200
  },
  leftMove: {
    type: Boolean,
    default: true
  },
  right: {
    type: Number,
    default: 200
  },
  rightMove: {
    type: Boolean,
    default: true
  },
  top: {
    type: Number,
    default: 60
  },
  topMove: {
    type: Boolean,
    default: true
  },
  bottom: {
    type: Number,
    default: 60
  },
  bottomMove: {
    type: Boolean,
    default: true
  }
});

const slots = defineSlots();

const mleft = ref(props.left);
const mright = ref(props.right);
const mtop = ref(props.top);
const mbottom = ref(props.bottom);
const mid = ref<HTMLElement | null>(null);

const move = ref<MoveState>({
  type: "",
  isMove: false,
  pageX: 0,
  pageY: 0,
  size: 0,
  h: 0,
  w: 0
});

// 监听props变化更新对应的ref
watch(
  () => props.left,
  val => (mleft.value = val)
);
watch(
  () => props.right,
  val => (mright.value = val)
);
watch(
  () => props.top,
  val => (mtop.value = val)
);
watch(
  () => props.bottom,
  val => (mbottom.value = val)
);

const leftWidth = computed(() => {
  return slots.left ? `${mleft.value}px` : "0";
});

const rightWidth = computed(() => {
  return slots.right ? `${mright.value}px` : "0";
});

const topHeight = computed(() => {
  return slots.top ? `${mtop.value}px` : "0";
});

const bottomHeight = computed(() => {
  return slots.bottom ? `${mbottom.value}px` : "0";
});

const onMousedown = (type: string, e: MouseEvent) => {
  move.value.type = type;
  move.value.isMove = true;
  move.value.pageX = e.pageX;
  move.value.pageY = e.pageY;
  move.value.size = move.value[`m${type}` as keyof MoveState] as number;

  if (mid.value) {
    move.value.h = mid.value.clientHeight;
    move.value.w = mid.value.clientWidth;
  }

  document.onmouseup = onMouseup;
  document.onmousemove = onMousemove;
};

const onMousemove = (e: MouseEvent) => {
  if (move.value.isMove) {
    switch (move.value.type) {
      case "left":
        const x1 = e.pageX - move.value.pageX;
        let left = move.value.size + x1;
        if (left < 0) {
          left = 4;
        } else if (left > move.value.size + move.value.w) {
          left = move.value.size + move.value.w;
        }
        mleft.value = left;
        break;
      case "right":
        const x2 = e.pageX - move.value.pageX;
        let right = move.value.size - x2;
        if (right < 0) {
          right = 4;
        } else if (right > move.value.size + move.value.w) {
          right = move.value.size + move.value.w;
        }
        mright.value = right;
        break;
      case "top":
        const y = e.pageY - move.value.pageY;
        let top = move.value.size + y;
        if (top < 0) {
          top = 4;
        } else if (top > move.value.size + move.value.h) {
          top = move.value.size + move.value.h;
        }
        mtop.value = top;
        break;
      case "bottom":
        const y2 = e.pageY - move.value.pageY;
        let bottom = move.value.size - y2;
        if (bottom < 0) {
          bottom = 4;
        } else if (bottom > move.value.size + move.value.h) {
          bottom = move.value.size + move.value.h;
        }
        mbottom.value = bottom;
        break;
    }
  }
};

const onMouseup = () => {
  move.value.isMove = false;
  document.onmousemove = document.onmouseup = null;
};
</script>

<style lang="less">
@import "./index.less";
</style>
