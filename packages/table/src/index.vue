<template>
  <div
    v-loading="loading"
    element-loading-text="数据加载中..."
    element-loading-spinner="el-icon-loading"
    :style="{ height: tableHeight2 }"
    :class="['z-table', isPage ? 'z-table--haspagination' : '']"
  >
    <el-table
      :data="tableShowData"
      style="width: 100%"
      :height="tableHeight"
      :max-height="maxHeight"
      :cell-style="cellStyle || { padding: '2px 0' }"
      :header-cell-style="{ padding: '2px 0' }"
      :stripe="stripe"
      :border="border"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-key="rowKey"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :header-row-class-name="headerRowClassName"
      :header-cell-class-name="headerCellClassName"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="getSummaries"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      :row-style="rowStyle"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDagend"
      @expand-change="expandChange"
      ref="jeanTable"
      v-if="isShowTable"
    >
      <!-- 拖动排序 -->
      <el-table-column align="center" width="45" v-if="isSortable && !isTree">
        <template #header>
          <i class="el-icon-sort" />
        </template>
        <template #default>
          <span class="learun-table__drag-handler">
            <i class="el-icon-rank" />
          </span>
        </template>
      </el-table-column>

      <el-table-column v-if="isExpand" :fixed="isFixed" type="expand" #default="scope" width="28">
        <slot v-bind="scope" name="table_expand"></slot>
      </el-table-column>

      <el-table-column v-if="isShowNum" :label="ShowNumLabel" :fixed="isFixed" type="index" :index="indexMethod" />

      <el-table-column v-if="isMultiSelect" :fixed="isFixed" type="selection" width="45" header-align="center" />

      <template v-for="(item, index) in tableColumns" :key="item.prop || index">
        <el-table-column
          v-bind="item"
          :label="item.label"
          :show-overflow-tooltip="item.isNotAutoWrap == true ? true : false"
          :fixed="isSortable && !isTree ? false : item.fixed"
          :sortable="sortable || item.sortable"
          v-if="!item.children"
        >
          <template #header="{ column }">
            <span v-if="isRequired(column.property)" style="color: red">*</span>
            <span>{{ column.label }}</span>
          </template>
          <template #default="slotProps">
            <slot v-bind="slotProps" :name="item.prop">
              {{ columnText(slotProps.$index, slotProps.row, item, slotProps) }}
            </slot>
          </template>
        </el-table-column>
        <DynamicColumn
          v-else
          :columnOption="item"
          :columnText="columnText"
          :isRequired="isRequired"
          :key="index"
          :label="item.label"
          :showOverflowTooltip="item.isNotAutoWrap == true ? true : false"
          :fixed="isSortable && !isTree ? false : item.fixed"
          :sortable="sortable"
          :allProps="item.props"
        >
          <template v-for="myProp in item.props || []" #[myProp]="scope">
            <slot v-bind="scope" :name="myProp"></slot>
          </template>
        </DynamicColumn>
      </template>
      <slot></slot>
    </el-table>
    <div v-if="isPage" class="z-table--pagination">
      <el-pagination
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page="currentPage"
        :page-sizes="pageSizes || [20, 50, 100, 200]"
        v-model:page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, toRefs } from "vue";
import type { PropType } from "vue";
import { toTree, toArray } from "../../../docs/.vitepress/utils/tree";
import DynamicColumn from "./dynamic-column.vue";

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
  columns: {
    type: Array as PropType<ColumnItem[]>,
    default: () => []
  },
  dataSource: {
    type: Array as PropType<TableItem[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: [String, Number],
    default: "100%"
  },
  maxHeight: {
    type: [String, Number]
  },
  stripe: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: true
  },
  fit: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  highlightCurrentRow: {
    type: Boolean,
    default: false
  },
  currentRowKey: {
    type: [String, Number]
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((row: TableItem) => string)>
  },
  rowClassName: {
    type: [String, Function] as PropType<string | ((row: TableItem) => string)>
  },
  cellClassName: {
    type: [String, Function] as PropType<string | ((row: TableItem) => string)>
  },
  headerRowClassName: {
    type: [String, Function] as PropType<string | ((row: TableItem) => string)>
  },
  headerCellClassName: {
    type: [String, Function] as PropType<string | ((row: TableItem) => string)>
  },
  defaultExpandAll: {
    type: Boolean
  },
  expandRowKeys: {
    type: Array as PropType<any[]>
  },
  defaultSort: {
    type: Object
  },
  tooltipEffect: {
    type: String
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  sumText: {
    type: String,
    default: "合计"
  },
  summaryMethod: {
    type: Function as PropType<(param: any) => any[]>
  },
  spanMethod: {
    type: Function as PropType<(param: any) => any[]>
  },
  selectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  indent: {
    type: Number,
    default: 16
  },
  lazy: {
    type: Boolean
  },
  load: {
    type: Function as PropType<(row: TableItem, treeNode: any, resolve: (data: TableItem[]) => void) => void>
  },
  treeProps: {
    type: Object
  },
  isPage: {
    type: Boolean,
    default: false
  },
  pageSizes: {
    type: Array as PropType<number[]>
  },
  pageTotal: {
    type: Number,
    default: 0
  },
  tablePage: {
    type: Number,
    default: 1
  },
  isShowNum: {
    type: Boolean,
    default: true
  },
  ShowNumLabel: {
    type: String,
    default: "#"
  },
  isMultiSelect: {
    type: Boolean
  },
  reserveSelection: {
    type: Boolean,
    default: true
  },
  isTree: {
    type: Boolean,
    default: false
  },
  pidKey: {
    type: String
  },
  selectKey: {
    type: String
  },
  sortable: {
    type: Boolean,
    default: false
  },
  isSortable: {
    type: Boolean,
    default: false
  },
  isExpand: {
    type: Boolean,
    default: false
  },
  isChild: {
    type: Boolean,
    default: false
  },
  rowStyle: {
    type: [Object, Function] as PropType<Record<string, any> | ((row: TableItem) => Record<string, any>)>
  },
  cellStyle: {
    type: [Object, Function] as PropType<Record<string, any> | ((row: TableItem) => Record<string, any>)>
  },
  pageSize: {
    type: Number,
    default: 50
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "update:tablePage",
  "update:pageSize",
  "select",
  "selectAll",
  "selectionChange",
  "cellMouseEnter",
  "cellMouseLeave",
  "cellClick",
  "cellDblclick",
  "rowClick",
  "rowContextmenu",
  "rowDblclick",
  "headerClick",
  "headerContextmenu",
  "sortChange",
  "filterChange",
  "currentChange",
  "headerDagend",
  "expandChange",
  "loadPageData",
  "sortable-change"
]);

const {
  columns,
  dataSource,
  isPage,
  pageSize,
  tablePage,
  isTree,
  isSortable,
  isChild,
  isMultiSelect,
  reserveSelection,
  selectKey,
  rowKey,
  pidKey,
  summaryMethod,
  required
} = toRefs(props);

const selectedData = ref<TableItem[]>([]);
const columnsVisible = ref(false);
const columnsChecks = ref<string[] | null>(null);
const pageSize3 = ref(0);
const isShowTable = ref(true);
const jeanTable = ref<any>(null);
const columnsTree = ref<any>(null);

const pageSize2 = computed({
  get: () => (pageSize3.value !== 0 ? pageSize3.value : pageSize.value),
  set: val => {
    pageSize3.value = val;
    emit("update:pageSize", val);
  }
});

const isFixed = computed(() => {
  return columns.value.find(item => item.fixed === true) !== undefined && !isSortable.value;
});

const tableHeight = computed(() => {
  if (props.height === "notset" || isChild.value) {
    return undefined;
  } else {
    return "100%";
  }
});

const tableHeight2 = computed(() => {
  if (props.height === "notset" || isChild.value) {
    return undefined;
  } else {
    return props.height + "px";
  }
});

const currentPage = computed({
  get: () => (!validatenull(tablePage.value) ? tablePage.value : 1),
  set: val => emit("update:tablePage", val)
});

const tableShowData = computed(() => {
  if (isTree.value) {
    return toTree(dataSource.value, multiSelectKey.value, pidKey.value, multiSelectKey.value, multiSelectKey.value);
  } else {
    return dataSource.value;
  }
});

const multiSelectKey = computed(() => {
  if (selectKey.value) {
    return selectKey.value;
  } else if (typeof rowKey.value === "string") {
    return rowKey.value;
  } else {
    return selectKey.value;
  }
});

const selectedValues = computed(() => {
  return selectedData.value.map(t => t[multiSelectKey.value]);
});

const arrayColumns = computed(() => {
  return toArray(columns.value);
});

const treeColumns = computed(() => {
  return toTree(deepClone(arrayColumns.value));
});

const tableColumns = computed(() => {
  if (columns.value.length === 0) {
    return [{ label: "", prop: "jean_null", minWidth: "1" }];
  }

  let res: ColumnItem[];

  if (columnsChecks.value !== null) {
    res = arrayColumns.value.filter(t => columnsChecks.value?.includes(t._id!));
  } else {
    res = arrayColumns.value.filter(t => defaultCheckedKeys.value.includes(t._id!));
  }
  if (res.length === 0) {
    return [{ label: "", prop: "jean_null", minWidth: "1" }];
  }
  return toTree(res);
});

const defaultCheckedKeys = computed(() => {
  return arrayColumns.value.filter(t => t.isNotShow !== true).map(t => t._id!);
});

watch(dataSource, () => {
  if (isChild.value) {
    nextTick(() => {
      const list = document.querySelectorAll(".el-table__row");
      list.forEach(row => {
        row.classList.add("el-table__row2");
        row.classList.remove("el-table__row");
      });
    });
  }
  selectRows();
});

const indexMethod = (index: number) => {
  if (isPage.value) {
    return (currentPage.value - 1) * pageSize2.value + index + 1;
  } else {
    return index + 1;
  }
};

const handleSizeChange = (val: number) => {
  pageSize2.value = val;
  emit("loadPageData", { rows: val, page: currentPage.value });
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  emit("loadPageData", { rows: pageSize2.value, page: val });
};

const doLayout = () => {
  isShowTable.value = false;
  nextTick(() => {
    isShowTable.value = true;
  });
};

const reset = () => {
  selectedData.value = [];
  jeanTable.value?.clearSelection();
};

const getSelected = () => {
  return deepClone(selectedData.value);
};

const handleSelect = (selection: TableItem[], row: TableItem) => {
  if (!reserveSelection.value) {
    emit("select", selection, row);
    return;
  }

  const addList = selection.filter(t => !selectedValues.value.includes(t[multiSelectKey.value]));

  if (addList.length > 0) {
    selectedData.value = [...addList, ...selectedData.value];
  } else {
    const notSelectedList = dataSource.value.filter(
      t => selection.findIndex(t2 => t2[multiSelectKey.value] === t[multiSelectKey.value]) === -1
    );
    const deleteList = notSelectedList.filter(t => selectedValues.value.includes(t[multiSelectKey.value]));
    selectedData.value = selectedData.value.filter(
      t => deleteList.findIndex(t2 => t2[multiSelectKey.value] === t[multiSelectKey.value]) === -1
    );
  }

  emit("select", selection, row);
};

const handleSelectAll = (selection: TableItem[]) => {
  if (isTree.value) {
    if (dataSource.value.length > 0) {
      if (dataSource.value.filter(t => selectedValues.value.includes(t[multiSelectKey.value])).length < dataSource.value.length) {
        const needSelectData = dataSource.value.map(t => t[multiSelectKey.value]);
        nextTick(() => {
          selectTreeRows2(tableShowData.value, needSelectData);
        });
        handleSelect(dataSource.value);
      } else {
        jeanTable.value?.clearSelection();
        handleSelect([]);
      }
    }
  } else {
    handleSelect(selection);
  }
  emit("selectAll", selection);
};

const selectRows = () => {
  if (!isMultiSelect.value || !reserveSelection.value) {
    return;
  }
  nextTick(() => {
    if (isTree.value) {
      selectTreeRows(tableShowData.value);
    } else {
      dataSource.value.forEach(row => {
        if (selectedValues.value.includes(row[multiSelectKey.value])) {
          jeanTable.value?.toggleRowSelection(row, true);
        }
      });
    }
  });
};

const selectTreeRows = (data: TableItem[]) => {
  data.forEach(row => {
    if (selectedValues.value.includes(row.value)) {
      jeanTable.value?.toggleRowSelection(row, true);
    }
    if (row.children) {
      selectTreeRows(row.children);
    }
  });
};

const selectTreeRows2 = (data: TableItem[], selectValues: any[]) => {
  data.forEach(row => {
    if (selectValues.includes(row.value)) {
      jeanTable.value?.toggleRowSelection(row, true);
    }
    if (row.children) {
      selectTreeRows2(row.children, selectValues);
    }
  });
};

const openColumnsSetting = () => {
  // columnsVisible.value = true;
};

const columnsSettingOpened = () => {
  let checks = columnsChecks.value || defaultCheckedKeys.value;
  checks = checks.filter(t => arrayColumns.value.findIndex(t2 => t2._id === t && t2._hasChildren) === -1);
  columnsTree.value?.setCheckedKeys(checks);
};

const handleColumnsCheck = ($node: any, data: any) => {
  columnsChecks.value = [...data.checkedKeys, ...data.halfCheckedKeys];
  doLayout();
};

const setSort = () => {
  const callback = () => {
    const el = jeanTable.value?.$el.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];

    const dragSortable = window.Sortable?.create(el, {
      ghostClass: "learun-table__sortable",
      handle: ".learun-table__drag-handler",
      onEnd: (evt: any) => {
        const oldindex = evt.oldIndex;
        const newindex = evt.newIndex;
        const targetRow = dataSource.value.splice(oldindex, 1)[0];
        dataSource.value.splice(newindex, 0, targetRow);
        emit("sortable-change", oldindex, newindex, targetRow, dataSource.value);
      }
    });
  };
  if (isSortable.value && !isTree.value) {
    nextTick(() => {
      callback();
    });
  }
};

const columnText = (index: number, row: TableItem, column: ColumnItem, scope: any) => {
  if (typeof column.formatter === "function") {
    return column.formatter({
      row: row,
      column: scope.column,
      cellValue: row[column.prop!],
      index: index
    });
  } else {
    loadCellData(row[column.prop!], column);
    return getCellText(row[column.prop!], column);
  }
};

const loadCellData = (value: any, { dataType, dataCode }: ColumnItem) => {
  // 实现加载单元格数据的逻辑
};

const getCellText = (value: any, { dataType, dataCode, options, valueKey, labelKey, format }: ColumnItem) => {
  if (validatenull(value)) {
    return "";
  }
  // 实现获取单元格文本的逻辑
  return value;
};

const getSummaries = (param: any) => {
  nextTick(() => {
    jeanTable.value?.doLayout();
  });

  if (summaryMethod.value) {
    return summaryMethod.value(param);
  }

  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = props.sumText;
      return;
    }

    const myColumn = arrayColumns.value.find(t => t.prop === column.property);

    if (myColumn?.isSummary) {
      const values = data.map((item: any) => Number(item[column.property]));
      if (!values.every((value: any) => isNaN(value))) {
        sums[index] = values
          .reduce((prev: number, curr: any) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          .toString();
      } else {
        sums[index] = "N/A";
      }
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

const isRequired = (property: string) => {
  const myColumn = columns.value.find(t => t.prop === property);
  return myColumn?.required || false;
};

const validate = () => {
  let res = true;
  if (required.value) {
    if (dataSource.value.length === 0) {
      // 显示错误消息
      return false;
    }
  }
  try {
    dataSource.value.forEach((row, index) => {
      columns.value.forEach(col => {
        if (!col.isHidden) {
          if (col.required && validatenull(row[col.prop!])) {
            // 显示错误消息
            res = false;
            throw new Error();
          }

          if (col.patterns && col.patterns.length > 0) {
            col.patterns.forEach(pattern => {
              if (
                pattern.reg &&
                !validatenull(row[col.prop!]) &&
                !new RegExp(pattern.reg.substring(1, pattern.reg.length - 1)).test(row[col.prop!])
              ) {
                // 显示错误消息
                res = false;
                throw new Error();
              }
            });
          }
        }
      });
    });
  } catch (error) {}
  return res;
};

// 工具函数
const validatenull = (val: any) => {
  return val === null || val === undefined || val === "";
};

const deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

// 表格事件方法
const selectionChange = (selection: TableItem[]) => emit("selectionChange", selection);
const cellMouseEnter = (row: TableItem, column: any, cell: HTMLElement, event: Event) =>
  emit("cellMouseEnter", row, column, cell, event);
const cellMouseLeave = (row: TableItem, column: any, cell: HTMLElement, event: Event) =>
  emit("cellMouseLeave", row, column, cell, event);
const cellClick = (row: TableItem, column: any, cell: HTMLElement, event: Event) => emit("cellClick", row, column, cell, event);
const cellDblclick = (row: TableItem, column: any, cell: HTMLElement, event: Event) =>
  emit("cellDblclick", row, column, cell, event);
const rowClick = (row: TableItem, column: any, event: Event) => emit("rowClick", row, column, event);
const rowContextmenu = (row: TableItem, column: any, event: Event) => emit("rowContextmenu", row, column, event);
const rowDblclick = (row: TableItem, column: any, event: Event) => emit("rowDblclick", row, column, event);
const headerClick = (column: any, event: Event) => emit("headerClick", column, event);
const headerContextmenu = (column: any, event: Event) => emit("headerContextmenu", column, event);
const sortChange = (column: any, prop: string, order: string) => emit("sortChange", column, prop, order);
const filterChange = (filters: any) => emit("filterChange", filters);
const currentChange = (currentRow: TableItem, oldCurrentRow: TableItem) => emit("currentChange", currentRow, oldCurrentRow);
const headerDagend = (newWidth: number, oldWidth: number, column: any, event: Event) =>
  emit("headerDagend", newWidth, oldWidth, column, event);
const expandChange = (row: TableItem, expanded: boolean) => emit("expandChange", row, expanded);

defineExpose({
  reset,
  getSelected,
  clearSelection: () => jeanTable.value?.clearSelection(),
  toggleRowSelection: (row: TableItem, selected?: boolean) => jeanTable.value?.toggleRowSelection(row, selected),
  toggleAllSelection: () => jeanTable.value?.toggleAllSelection(),
  toggleRowExpansion: (row: TableItem, expanded?: boolean) => jeanTable.value?.toggleRowExpansion(row, expanded),
  setCurrentRow: (row?: TableItem) => jeanTable.value?.setCurrentRow(row),
  clearSort: () => jeanTable.value?.clearSort(),
  clearFilter: (columnKey?: string[]) => jeanTable.value?.clearFilter(columnKey),
  doLayout: () => jeanTable.value?.doLayout(),
  sort: (prop: string, order?: string) => jeanTable.value?.sort(prop, order),
  validate,
  openColumnsSetting
  // doLayout
});
</script>
<style scoped>
@import "./index.less";
</style>
