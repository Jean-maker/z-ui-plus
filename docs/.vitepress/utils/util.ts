import { ElNotification } from "element-plus";
import type { FormInstance } from "element-plus";

type ObjType =
  | "boolean"
  | "number"
  | "string"
  | "function"
  | "array"
  | "date"
  | "regExp"
  | "undefined"
  | "null"
  | "object"
  | "element";

export const getObjType = (obj: any): ObjType => {
  const toString = Object.prototype.toString;
  const map: Record<string, ObjType> = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)] || "object";
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(data: T): T => {
  const type = getObjType(data);
  let obj: any;

  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    return data;
  }

  if (type === "array") {
    const arr = data as unknown as any[];
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === 0) {
        obj.push(arr[i]);
        continue;
      }
      if (arr[i]) {
        delete (arr[i] as any).$parent;
      }
      obj.push(deepClone(arr[i]));
    }
  } else if (type === "object") {
    for (const key in data as object) {
      if (data) {
        delete (data as any).$parent;
      }
      obj[key] = deepClone((data as any)[key]);
    }
  }
  return obj;
};

/**
 * Generate a UUID
 */
export const uuid = (): string => {
  const s = [] as any;
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((parseInt(s[19], 16) & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
};

/**
 * Extend object properties
 */
export const extend = <T extends object, U extends object>(result: T, data: U): T & U => {
  for (const id in data) {
    (result as any)[id] = data[id];
  }
  return result as T & U;
};

/**
 * Compare two objects by property
 */
export const compare = <T extends Record<string, any>>(propertyName: keyof T) => {
  return (object1: T, object2: T): number => {
    const value1 = object1[propertyName];
    const value2 = object2[propertyName];
    if (value2 < value1) {
      return -1;
    } else if (value2 > value1) {
      return 1;
    } else {
      return 0;
    }
  };
};

/**
 * Generate random number with specified length
 */
export const randomLenNum = (len?: number, date?: boolean): string => {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
};

/**
 * Download file
 */
export const downFile = (url: string, title?: string): void => {
  ElNotification({
    title: title || `文件下载成功`,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration: 1000,
    offset: 60,
    message: `<iframe src='${url}' style="display:none"></iframe>`
  });
};

/**
 * Async wrapper for promises
 */
export const awaitWrapper = async <T>(promise: Promise<{ data: { data: T } }>): Promise<T | null> => {
  try {
    const res = await promise;
    return res.data.data;
  } catch {
    return null;
  }
};

/**
 * Async wrapper for external API calls
 */
export const awaitWrapperEx = async <T>(promise: Promise<T>): Promise<{ err: any; data: T | null }> => {
  try {
    const res = await promise;
    return { err: null, data: res };
  } catch (err) {
    return { err, data: null };
  }
};

/**
 * Form validation wrapper
 */
export const formValidateWrapper = (form: FormInstance | null, defaultValue = true): Promise<boolean> => {
  return new Promise(resolve => {
    if (form) {
      form.validate(valid => {
        resolve(valid);
      });
    } else {
      resolve(defaultValue);
    }
  });
};

/**
 * Clear form fields and validation
 */
export const formClear = (form: FormInstance | null): void => {
  if (!form) {
    return;
  }
  setTimeout(() => {
    form.resetFields();
    setTimeout(() => {
      form.clearValidate();
    }, 0);
  }, 0);
};

/**
 * Set form data with table name prefix
 */
export const setFormData = <T extends Record<string, any>>(formData: Record<string, any>, data: T, tableName?: string): void => {
  let formProp = "";
  for (const key in data) {
    if (tableName) {
      formProp = `${lowerFirst(tableName)}_${key}`;
    } else {
      formProp = lowerFirst(key);
    }
    formData[formProp] = data[key];
  }
};

/**
 * Get form data with table name prefix
 */
export const getFormData = (formData: Record<string, any>, tableName: string): Record<string, any> => {
  const res: Record<string, any> = {};
  for (const key in formData) {
    if (key.startsWith(`${tableName}_`)) {
      const formProp = key.replace(`${tableName}_`, "");
      res[formProp] = formData[key];
    }
  }
  return res;
};

/**
 * Helper function to lowercase first letter
 */
const lowerFirst = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Get function from string
 */
export const getFunction = (fun: string): { res: boolean; msg: string; fn?: Function } => {
  if (fun) {
    try {
      const fn = eval(fun);
      if (typeof fn === "function") {
        return { res: true, msg: "ok", fn };
      } else {
        return { res: false, msg: "此方法不是一个函数" };
      }
    } catch (err) {
      return { res: false, msg: (err as Error).message };
    }
  } else {
    return { res: false, msg: "没设置脚本函数" };
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
  immediate = true
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        fn.apply(this, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    }
  };
};
