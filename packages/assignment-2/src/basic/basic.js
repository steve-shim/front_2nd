export function shallowEquals(target1, target2) {
  function checkValue(target1, target2) {
    return function innerFunction(v, idx, arr) {
      return arr[idx] === target2[idx];
    };
  }

  function shallowEqual(object1, object2) {
    if (object1.constructor !== object2.constructor) {
      return false;
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  if (typeof target1 !== typeof target2) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) {
      return false;
    }
    //console.log("[배열 비교]");
    return target1.every(checkValue(target1, target2));
  }

  if (
    Object.prototype.toString.call(target1) === "[object Object]" &&
    Object.prototype.toString.call(target2) === "[object Object]"
  ) {
    //console.log("[객체 비교]");
    return shallowEqual(target1, target2);
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  let targetList = [];
  function checkObjValue(t1, t2) {
    if (
      (t1?.constructor !== t2?.constructor &&
        Object.prototype.toString.call(t1) !== "[object Array]") ||
      Object.prototype.toString.call(t1) === "[object Undefined]" ||
      Object.prototype.toString.call(t1) === "[object Null]" ||
      Object.prototype.toString.call(t1) === "[object Number]" ||
      Object.prototype.toString.call(t1) === "[object String]"
    )
      targetList.push(shallowEquals(t1, t2));
    if (t1?.length !== t2?.length) {
      targetList.push(false);
    }
    if (typeof t1 === "object") {
      for (const key in t1) {
        if (Object.keys(t1[key]).length) {
          checkObjValue(t1[key], t2[key]);
        } else {
          targetList.push(shallowEquals(t1[key], t2[key]));
        }
      }
    }
  }
  checkObjValue(target1, target2);
  return targetList.every((v) => v);
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
