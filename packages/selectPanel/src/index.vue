<template>
  <div class="l-select-panel">
    <z-panel style="padding: 0">
      <template #toolLeft>
        <div class="l-panel--item" v-if="multiple">
          <el-radio-group v-model="showType" size="mini" @change="handleTypeChange">
            <el-radio-button label="1">全部</el-radio-button>
            <el-radio-button label="2">已选</el-radio-button>
          </el-radio-group>
        </div>
        <div class="l-panel--item" v-if="showType == 1 || model == 'client'">
          <el-input
            style="width: 200px"
            :placeholder="$t('请输入查询关键字')"
            v-model="searchWord"
            size="mini"
            @clear="hanleSearchInput"
            @input="hanleSearchInput"
            @keyup.enter="hanleSearch"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="hanleSearch"></el-button>
            </template>
          </el-input>
        </div>
        <div class="l-panel--item l-select-panel--numText" v-if="multiple">
          {{ `${$t("已经选中")}${value2.length}${$t("条")}` }}
        </div>
      </template>
      <template #toolRight>
        <el-button-group v-if="isRefresh">
          <el-button :disabled="disabledRefresh" size="mini" icon="el-icon-refresh-left" @click="handleRefresh"></el-button>
        </el-button-group>
        <slot name="btns"></slot>
        <el-button-group v-if="multiple">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleClear()">清空</el-button>
        </el-button-group>
      </template>
      <l-table
        :columns="columns"
        :dataSource="tableShowData"
        :loading="selectLoading"
        :isPage="isPage"
        :pageTotal="tableTotal"
        v-model:tablePage="tableCurrentPage"
        :isMultiSelect="multiple"
        :reserveSelection="false"
        :pageSizes="[20, 30, 50]"
        :pageSize="tablePageSize"
        :row-key="rowKey"
        :default-expand-all="defaultExpandAll"
        @select="handleSelect"
        @selectAll="handleSelectAll"
        @loadPageData="turnTablePage"
        @rowClick="handleRowClick"
        ref="selectTable"
      >
        <template v-for="item in columns" #[item.prop]="scope">
          <slot v-bind="scope" :name="item.prop"></slot>
        </template>
        <slot></slot>
      </l-table>
    </z-panel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, toRefs } from "vue";
import type { PropType } from "vue";

interface ColumnItem {
  prop: string;
  hidden?: boolean;
  [key: string]: any;
}

interface TableItem {
  [key: string]: any;
  children?: TableItem[];
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | Array<any>>,
    default: ""
  },
  valueKey: {
    type: String,
    default: "value"
  },
  labelKey: {
    type: String
  },
  idKey: {
    type: String
  },
  pidKey: {
    type: String
  },
  columns: {
    type: Array as PropType<ColumnItem[]>,
    default: () => []
  },
  model: {
    type: String,
    default: "service" // service（选中数据从后端加载） client （选中数据从前端获取）
  },
  selectedData: {
    type: Array as PropType<TableItem[]>,
    default: () => []
  },
  loadSelectTable: {
    type: Function as PropType<(queryData: any) => Promise<any>>
  },
  refreshData: {
    type: Function as PropType<() => void>
  },
  isRefresh: {
    type: Boolean,
    default: false
  },
  isPage: {
    type: Boolean,
    default: true
  },
  isTree: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: true
  },
  defaultExpandAll: {
    type: Boolean,
    default: true
  },
  isChangeSearch: {
    type: Boolean,
    default: false
  },
  notSelectChildren: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "update:selectedData", "change", "rowClick"]);

const {
  modelValue,
  valueKey,
  labelKey,
  idKey,
  pidKey,
  columns,
  model,
  selectedData,
  loadSelectTable,
  refreshData,
  isRefresh,
  isPage,
  isTree,
  multiple,
  defaultExpandAll,
  isChangeSearch,
  notSelectChildren
} = toRefs(props);

const searchWord = ref("");
const selectLoading = ref(false);
const tableData = ref<TableItem[]>([]);
const tableTotal = ref(0);
const tablePageSize = ref(20);
const tableCurrentPage = ref(1);
const showType = ref("1");
const disabledRefresh = ref(false);
const selectTable = ref<any>(null);

const value2 = computed({
  get: () => {
    if (multiple.value) {
      if (!validatenull(modelValue.value)) {
        return String(modelValue.value).split(",");
      } else {
        return [];
      }
    } else {
      return modelValue.value;
    }
  },
  set: val => {
    if (multiple.value) {
      emit("update:modelValue", String(val));
    } else {
      emit("update:modelValue", val);
    }
    emit("change", val);
  }
});

const tableShowData = computed(() => {
  if (isTree.value) {
    return toTree(tableData.value, idKey.value, pidKey.value, valueKey.value, labelKey.value);
  } else {
    return tableData.value;
  }
});

const rowKey = computed(() => {
  return multiple.value || isTree.value ? valueKey.value : "";
});

watch(
  modelValue,
  val => {
    if (multiple.value) {
      value2.value = !validatenull(val) ? String(val).split(",") : [];
    } else {
      value2.value = val;
    }
  },
  { immediate: true }
);

const init = () => {
  tableLoadData();
};

const reset = () => {
  showType.value = "1";
  value2.value = multiple.value ? [] : "";
  searchWord.value = "";
  if (model.value === "client") {
    emit("update:selectedData", []);
  }
  tableData.value = [];
};

const hanleSearch = () => {
  tableLoadData();
};

const hanleSearchInput = () => {
  if (isChangeSearch.value) {
    hanleSearch();
  }
};

const handleSelect = (selection: TableItem[], row: TableItem) => {
  if (isTree.value && row && !notSelectChildren.value) {
    const sres: TableItem[] = [];
    if (selection.findIndex(t => t[valueKey.value] === row[valueKey.value]) !== -1) {
      if (row.children && row.children.length > 0) {
        selectChildren(row.children, selection, sres, true);
      }
      selection.push(...sres);
    } else {
      if (row.children && row.children.length > 0) {
        selectChildren(row.children, selection, sres, false);
      }
      selection = selection.filter(t => sres.findIndex(t2 => t2[valueKey.value] === t[valueKey.value]) === -1);
    }
  }

  let valueTmp = [...value2.value];
  let selectedDataTmp = [...selectedData.value];

  const selectedList = selection.map(t => t[valueKey.value]);
  const addList = selectedList.filter(t => !valueTmp.includes(t));

  if (addList.length > 0) {
    valueTmp = [...addList, ...valueTmp];
    if (model.value === "client") {
      selectedDataTmp = [...selectedDataTmp, ...tableData.value.filter(t => addList.includes(t[valueKey.value]))];
    }
  } else {
    const notSelectedList = tableData.value.filter(t => !selectedList.includes(t[valueKey.value])).map(t => t[valueKey.value]);
    const deleteList = notSelectedList.filter(t => valueTmp.includes(t));

    valueTmp = valueTmp.filter(t => !deleteList.includes(t));
    if (model.value === "client") {
      selectedDataTmp = selectedDataTmp.filter(t => !deleteList.includes(t[valueKey.value]));
    }
  }

  value2.value = valueTmp;
  if (model.value === "client") {
    emit("update:selectedData", selectedDataTmp);
  }
};

const handleSelectAll = (selection: TableItem[]) => {
  if (isTree.value) {
    if (tableData.value.length > 0) {
      const valueTmp = value2.value;
      if (tableData.value.filter(t => valueTmp.includes(t[valueKey.value])).length < tableData.value.length) {
        const needSelectData = tableData.value.map(t => t[valueKey.value]);
        nextTick(() => {
          selectTreeRows2(tableShowData.value, needSelectData);
        });
        handleSelect(tableData.value);
      } else {
        selectTable.value?.clearSelection();
        handleSelect([]);
      }
    }
  } else {
    handleSelect(selection);
  }
};

const tableLoadData = (isNotFirst = false) => {
  if (!isNotFirst) {
    tableCurrentPage.value = 1;
  }
  selectLoading.value = true;
  const queryData = {
    rows: tablePageSize.value,
    page: tableCurrentPage.value,
    showType: showType.value
  };

  if (showType.value === "2") {
    if (model.value === "client") {
      loadClient();
      selectLoading.value = false;
      return;
    }

    const ids = isPage.value ? pagination(tableCurrentPage.value, tablePageSize.value, value2.value) : value2.value;

    if (ids.length === 0) {
      tableTotal.value = 0;
      tableData.value = [];
      selectLoading.value = false;
      return;
    }
    queryData.ids = String(ids);
  } else {
    queryData.keyword = searchWord.value;
  }

  if (loadSelectTable.value) {
    loadSelectTable
      .value(queryData)
      .then(res => {
        const data = deepClone(res);
        tableData.value = data.rows;
        tableTotal.value = showType.value === "1" ? data.records : value2.value.length;
        selectLoading.value = false;
        disabledRefresh.value = false;
        if (multiple.value) {
          selectRows();
        }
      })
      .catch(() => {
        tableData.value = [];
        selectLoading.value = false;
        disabledRefresh.value = false;
      });
  } else {
    disabledRefresh.value = false;
    selectLoading.value = false;
  }
};

const turnTablePage = ({ rows }: { rows: number }) => {
  tablePageSize.value = rows;
  tableLoadData(true);
};

const loadClient = () => {
  let tableDataTmp = selectedData.value;

  if (!validatenull(searchWord.value)) {
    tableDataTmp = tableDataTmp.filter(t => clientFilter(t));
  }

  if (isPage.value) {
    tableData.value = pagination(tableCurrentPage.value, tablePageSize.value, tableDataTmp);
    tableTotal.value = value2.value.length;
  } else {
    tableData.value = tableDataTmp;
  }
  selectRows();
};

const selectRows = () => {
  nextTick(() => {
    if (isTree.value) {
      selectTreeRows(tableShowData.value);
    } else {
      tableData.value.forEach(row => {
        if (value2.value.includes(row[valueKey.value])) {
          selectTable.value?.toggleRowSelection(row, true);
        }
      });
    }
  });
};

const selectTreeRows = (data: TableItem[]) => {
  data.forEach(row => {
    if (value2.value.includes(row[valueKey.value])) {
      selectTable.value?.toggleRowSelection(row, true);
    }
    if (row.children) {
      selectTreeRows(row.children);
    }
  });
};

const selectTreeRows2 = (data: TableItem[], selectValues: any[]) => {
  data.forEach(row => {
    if (selectValues.includes(row[valueKey.value])) {
      selectTable.value?.toggleRowSelection(row, true);
    }
    if (row.children) {
      selectTreeRows2(row.children, selectValues);
    }
  });
};

const clientFilter = (t: TableItem) => {
  for (const id in t) {
    const v = String(t[id]);
    if (v.includes(searchWord.value)) {
      return true;
    }
  }
  return false;
};

const handleClear = () => {
  value2.value = multiple.value ? [] : "";
  searchWord.value = "";
  if (model.value === "client") {
    emit("update:selectedData", []);
  }
  selectTable.value?.clearSelection();
  showType.value = "1";
  tableLoadData();
};

const handleTypeChange = () => {
  tableLoadData();
};

const handleRowClick = (row: TableItem) => {
  if (!multiple.value) {
    emit("update:selectedData", [row]);
    value2.value = row[valueKey.value];
    emit("rowClick", row);
  }
};

const handleRefresh = () => {
  value2.value = multiple.value ? [] : "";
  searchWord.value = "";
  if (model.value === "client") {
    emit("update:selectedData", []);
  }
  selectTable.value?.clearSelection();
  showType.value = "1";

  refreshData.value?.();
  disabledRefresh.value = true;
};

const selectChildren = (list: TableItem[], selection: TableItem[], res: TableItem[], selected: boolean) => {
  list.forEach(row => {
    if (selected) {
      if (selection.findIndex(t => t[valueKey.value] === row[valueKey.value]) === -1) {
        selectTable.value?.toggleRowSelection(row, true);
        res.push(row);
      }
      if (row.children && row.children.length > 0) {
        selectChildren(row.children, selection, res, true);
      }
    } else {
      if (selection.findIndex(t => t[valueKey.value] === row[valueKey.value]) !== -1) {
        selectTable.value?.toggleRowSelection(row, false);
        res.push(row);
      }
      if (row.children && row.children.length > 0) {
        selectChildren(row.children, selection, res, false);
      }
    }
  });
};

// 工具函数
const validatenull = (val: any) => {
  return val === null || val === undefined || val === "";
};

const deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

const pagination = (page: number, rows: number, data: any[]) => {
  const start = (page - 1) * rows;
  const end = start + rows;
  return data.slice(start, end);
};

const toTree = (data: any[], idKey: string, pidKey: string, valueKey: string, labelKey: string) => {
  const result: any[] = [];
  const map: Record<string, any> = {};

  data.forEach(item => {
    map[item[idKey]] = { ...item, children: [] };
  });

  data.forEach(item => {
    const parent = map[item[pidKey]];
    if (parent) {
      parent.children.push(map[item[idKey]]);
    } else {
      result.push(map[item[idKey]]);
    }
  });

  return result;
};

defineExpose({
  init,
  reset
});
</script>

<style lang="less">
@import "./index.less";
</style>
