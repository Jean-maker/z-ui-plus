import { validateNull } from "./validate";

// 表格数据转换
export const columnText = (value, { dataType, dataCode, options, valueKey, labelKey, format }) => {
  if (validateNull(value)) {
    return "";
  }

  switch (dataType) {
    case "mydata": {
      return findDataSourceName(options, value, "value", "label");
    }
    case "boolean": {
      return value ? "是" : "否";
    }
    case "array": {
      if (!Array.isArray(value)) {
        return value;
      } else if (value.length === 0) {
        return "该项为必填";
      } else {
        const key = labelKey || "label";
        return value.map(item => item[key]).join(", ");
      }
    }

    // case 'dataItem':
    // 	return this.lr_dataItemName(this.lr_dataItem[dataCode], value);
    // case 'dataSource':
    // 	return this.lr_dataSourceName2(dataCode, value, valueKey, labelKey);
    // case 'datetime':
    // 	return window.$formatDate(value, format || 'yyyy-MM-dd hh:mm:ss');
    // case 'company':
    // 	return this.lr_loadCompanyName(value);
    // case 'department':
    // 	return this.lr_departmentNameByOne(value);
    // case 'role':
    // 	return (this.lr_role[value] || {})[labelKey || 'f_FullName'] || '';
    // case 'post':
    // 	return (this.lr_post[value] || {})[labelKey || 'f_FullName'] || '';
    // case 'user':
    // 	return this.lr_userName(value);
    // case 'fullUser':
    // 	return this.lr_fullUser(value);
    // case 'areas':
    // 	return this.lr_areasName(value);
    default:
      return value;
  }
};

const findDataSourceName = (dataSource: any, value: any, valueKey: string, labelKey: string) => {
  let findItem = dataSource.find(t => t[valueKey] == value);
  if (findItem) {
    return findItem[labelKey];
  }
  return "";
};
const findTreeItem = (arr: any, res: any) => {
  arr.forEach(t => {
    res.push({ value: t.value, label: t.label });
    if (t.children) {
      findTreeItem(t.children, res);
    }
  });
};
