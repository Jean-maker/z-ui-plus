<template>
  <el-table-column
    v-bind="filteredColumnOption"
    :label="label"
    :show-overflow-tooltip="showOverflowTooltip"
    :fixed="fixed"
    :sortable="sortable || columnOption.sortable"
  >
    <template #header="{ column }">
      <span v-if="isRequired(column.property)" style="color: red">*</span>
      <span>{{ column.label }}</span>
    </template>
    <template v-if="!columnOption.children" #default="scope">
      <slot v-bind="scope" :name="columnOption.prop">
        {{ columnText(scope.$index, scope.row, columnOption, scope) }}
      </slot>
    </template>
    <DynamicColumn
      v-for="(col, index) in columnOption.children || []"
      :key="index"
      :columnOption="col"
      :columnText="columnText"
      :isRequired="isRequired"
      :label="col.label"
      :showOverflowTooltip="col.isNotAutoWrap == true ? true : false"
      :fixed="fixed"
      :sortable="sortable"
      :allProps="allProps"
    >
      <template v-for="myProp in allProps || []" #[myProp]="scope">
        <slot v-bind="scope" :name="myProp"></slot>
      </template>
    </DynamicColumn>
  </el-table-column>
</template>

<script lang="ts">
export default {
  name: "DynamicColumn"
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

interface ColumnItem {
  prop?: string;
  label?: string;
  fixed?: boolean;
  sortable?: boolean | string;
  isNotAutoWrap?: boolean;
  isNotShow?: boolean;
  isSummary?: boolean;
  required?: boolean;
  patterns?: Array<{ reg: string; msg: string }>;
  formatter?: Function;
  children?: ColumnItem[];
  _id?: string;
  _hasChildren?: boolean;
  [key: string]: any;
}

interface TableItem {
  [key: string]: any;
  children?: TableItem[];
}

const props = defineProps({
  columnOption: {
    type: Object as PropType<ColumnItem>,
    required: true
  },
  columnText: {
    type: Function as PropType<(index: number, row: TableItem, column: ColumnItem, scope: any) => string>,
    required: true
  },
  isRequired: {
    type: Function as PropType<(property: string) => boolean>,
    required: true
  },
  sortable: {
    type: Boolean
  },
  fixed: {
    type: Boolean
  },
  showOverflowTooltip: {
    type: Boolean
  },
  label: {
    type: String
  },
  allProps: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});
const filteredColumnOption = computed(() => {
  const { children, ...rest } = props.columnOption;
  return rest;
});
</script>
