import { deepClone } from "./util";

interface TreeNode {
  [key: string]: any;
  value?: any;
  label?: any;
  children?: TreeNode[];
  _id?: string;
  _pid?: string;
  _hasChildren?: boolean;
}

interface GroupMap {
  group: { [key: string]: TreeNode[] };
  map: { [key: string]: TreeNode };
}

function setGroupMap(data: TreeNode[], idKey: string, pidKey: string): GroupMap {
  const groupList: { [key: string]: TreeNode[] } = {};
  const map: { [key: string]: TreeNode } = {};

  data.forEach(item => {
    const pid = item[pidKey];
    groupList[pid] = groupList[pid] || [];
    groupList[pid].push(item);

    map[item[idKey]] = item;
  });

  return {
    group: groupList,
    map: map
  };
}

function setTree(
  data: TreeNode[] | null,
  allList: GroupMap,
  idKey: string,
  valueKey?: string,
  labelKey?: string,
  filterIds?: string[]
): TreeNode[] {
  const res: TreeNode[] = [];

  if (data == null) {
    for (const id in allList.group) {
      if (!filterIds || filterIds.indexOf(id) === -1) {
        if (!allList.map[id]) {
          const list = allList.group[id];
          list.forEach(item2 => {
            if (!filterIds || filterIds.indexOf(item2[idKey]) === -1) {
              if (valueKey) {
                item2.value = item2[valueKey];
              }
              if (labelKey) {
                item2.label = item2[labelKey];
              }

              if (allList.group[item2[idKey]] && allList.group[item2[idKey]].length > 0) {
                item2.children = setTree(allList.group[item2[idKey]], allList, idKey, valueKey, labelKey, filterIds);
              }
              res.push(item2);
            }
          });
        }
      }
    }
  } else {
    data.forEach(item => {
      if (!filterIds || filterIds.indexOf(item[idKey]) === -1) {
        if (valueKey) {
          item.value = item[valueKey];
        }

        if (labelKey) {
          item.label = item[labelKey];
        }

        if (allList.group[item[idKey]] && allList.group[item[idKey]].length > 0) {
          item.children = setTree(allList.group[item[idKey]], allList, idKey, valueKey, labelKey, filterIds);
        }
        res.push(item);
      }
    });
  }

  return res;
}

// Convert data to tree data
export function toTree(
  data: TreeNode[],
  idKey: string = "_id",
  pidKey: string = "_pid",
  valueKey?: string,
  labelKey?: string,
  filterIds?: string[]
): TreeNode[] {
  // Data deduplication based on value
  let _data: TreeNode[] = [];
  let _dataMap: { [key: string]: boolean } = {};

  if (valueKey) {
    data.forEach(item => {
      const value = item[valueKey];
      if (!_dataMap[value]) {
        _dataMap[value] = true;
        _data.push(deepClone(item));
      }
    });
  } else {
    _data = data;
  }

  _dataMap = {};

  if (idKey === pidKey) {
    const res: TreeNode[] = [];
    _data.forEach(item => {
      if (!filterIds || filterIds.indexOf(item[idKey]) === -1) {
        if (valueKey) {
          item.value = item[valueKey];
        }
        if (labelKey) {
          item.label = item[labelKey];
        }
        res.push(item);
      }
    });
    return res;
  }

  const allList = setGroupMap(_data, idKey, pidKey);
  return setTree(null, allList, idKey, valueKey, labelKey, filterIds);
}

const setArray = (list: TreeNode[], pid: string, data?: TreeNode[]): void => {
  data = data || [];
  for (let i = 0, len = data.length; i < len; i++) {
    data[i]._id = data[i].prop || `${pid}_${i}`;
    data[i]._pid = pid;
    const children = data[i].children || [];
    delete data[i].children;
    list.push(data[i]);

    if (children.length > 0) {
      data[i]._hasChildren = true;
      setArray(list, data[i]._id!, children);
    }
  }
};

export const toArray = (data: TreeNode[]): TreeNode[] => {
  const list: TreeNode[] = [];
  setArray(list, "0", deepClone(data));
  return list;
};
