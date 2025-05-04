<template>
  <div ref="zQueryRef" class="z-query-container">
    <el-form
      class="form-content"
      :style="{
        width: props.items?.length > showNum ? getColMinWidth * showNum + 'px' : getColMinWidth * props.items.length + 'px'
      }"
      ref="formRef"
      :inline="true"
      :model="formData"
      label-position="right"
      :label-width="labelWidth"
    >
      <el-row :gutter="10">
        <el-col
          ref="colWidthRef"
          :style="{ minWidth: getColMinWidth + 'px' }"
          :span="getColSpan"
          v-for="(item, index) in showItems"
          :key="index"
        >
          <el-form-item class="w100" :label="item.label" :prop="item.prop">
            <slot :name="item.prop"></slot>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <template v-if="showItems2?.length > 0">
          <el-col
            :style="{ minWidth: getColMinWidth + 'px' }"
            :span="getColSpan"
            v-for="(item, index) in showItems2"
            :key="index"
          >
            <el-form-item class="w100" :label="item.label" :prop="item.prop">
              <slot :name="item.prop"></slot>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="btns-box lh32">
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button v-if="items.length > showNum" type="primary" link @click="areConditionFold">
        {{ conditionFold ? "展开" : "收起" }}
        <el-icon v-if="conditionFold"><ArrowDown /></el-icon>
        <el-icon v-else><ArrowUp /></el-icon>
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
const emit = defineEmits(["search", "reset"]);
const props = defineProps({
  labelWidth: {
    type: Number,
    default: 80
  },
  items: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const zQueryRef = ref();
const colWidthRef = ref();
const showNum = ref(3);
// 是否收起
const conditionFold = ref(true);
const showItems = computed(() => {
  if (props.items.length > showNum.value) {
    return props.items.slice(0, showNum.value);
  } else {
    return props.items;
  }
});
const showItems2 = computed(() => {
  if (!conditionFold.value) {
    return props.items.slice(showNum.value, props.items.length);
  } else {
    return [];
  }
});
const getColSpan = computed(() => {
  if (showNum.value > 3) {
    return 24 / showNum.value;
  } else {
    return 6;
  }
});
// el-col设置最小宽度
const getColMinWidth = computed(() => {
  return props.labelWidth + 200 + 20;
});
const initNum = () => {
  const queryWidth = zQueryRef.value.offsetWidth - 200;
  let num = queryWidth / getColMinWidth.value;

  if (Math.trunc(num) < props.items?.length) {
    showNum.value = Math.trunc(num);
  } else {
    showNum.value = props.items?.length;
  }
};
const areConditionFold = () => {
  conditionFold.value = !conditionFold.value;
};
// 查询
const handleSearch = () => {
  emit("search");
};
// 重置
const handleReset = () => {
  emit("reset");
};
onMounted(() => {
  window.addEventListener("resize", initNum);
  setTimeout(() => {
    initNum();
  }, 300);
});

// 当组件卸载时移除事件监听器以防止内存泄漏
onUnmounted(() => {
  window.removeEventListener("resize", initNum);
});
</script>
<style lang="less">
@import "./index.less";
</style>
