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
  return target1 === target2;
}

export function createNumber1(n) {
  return n;
}

export function createNumber2(n) {
  return n;
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
