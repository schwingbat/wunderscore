/* WUNDERSCORE!
 * ------------
 * This is the subset of underscore/lodash that I actually use, plus a couple more things.
 * I find both of them have lots and lots of functions that I will never use.
 * So this is my attempt at an easily portable, reusable subset that
 * makes sense for me.
 */

/*=========================*\
||      Type Checking      ||
\*=========================*/

export function isEqual(one, two) {
  // All-purpose equality check including deep comparison of objects.

  if (typeof one !== typeof two) return false;

  if (isFunction(one) && isFunction(two)) {
    return one === two;
  } else if (one instanceof Array && two instanceof Array) {
    // Both values are arrays.
    if (one.length !== two.length) return false;

    // Both are arrays of the same length. Compare their values.
    for (let i = 0; i < one.length; i++) {
      if (!isEqual(one[i], two[i])) return false;
    }
  } else if (one instanceof Object && two instanceof Object) {
    // Both are objects that are not arrays.
    if (Object.keys(one).length !== Object.keys(two).length) return false;

    // Both are objects with the same number of values.
    // Run through each one and compare them.
    for (const key in one) {
      if (!isEqual(one[key], two[key])) return false;
    }
  } else {
    // They are neither arrays nor objects, so a strict equality check should sort them out.
    return one === two;
  }

  // If the function hasn't returned false by now, that means our values,
  // if objects or arrays, have the same number of keys, and all have equal
  // values, and if not objects or arrays, they have passed a strict equality check.
  return true;
}

export function isArray(thing) {
  return thing instanceof Array;
}

export function isFunction(thing) {
  return typeof thing === 'function';
}

export function isObject(thing) {
  return typeof thing === 'object' && !(thing instanceof Array);
}

export function isEmail(str) {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return regex.test(str.toLowerCase());
}

/*=========================*\
||      Object Tools       ||
\*=========================*/

export function mapObject(obj, func) {
  // Like ES5 map, but for object values instead of arrays.
  const mapped = [];

  // If no function is given, convert object values to an array.
  if (!func) {
    func = val => val;
  }

  for (const key in obj) {
    // Pass the value, like normal _.map(), but the key
    // as the second property instead of an index.
    mapped.push(func(obj[key], key));
  }

  return mapped;
}

export function filterObject(obj, func) {
  const filtered = {};

  for (const key in obj) {
    if (func(obj[key], key)) {
      filtered[key] = obj[key];
    }
  }

  return filtered;
}

export function toArray(obj) {
  // Convert an object to an array of its values.

  const arr = [];

  for (const key in obj) {
    arr.push(obj[key]);
  }

  return arr;
}

export function countBy(obj, func) {
  /**
   * Uses the given function's return value
   * as a key to count occurrences.
   */

  const counts = {};

  for (const key in obj) {
    const returnVal = func(obj[key], key);

    if (returnVal) {
      if (counts.hasOwnProperty(returnVal)) {
        counts[returnVal] += 1;
      } else {
        counts[returnVal] = 1;
      }
    }
  }

  return counts;
}

export function clone(obj) {
  // Recursively deep clone all properties in
  // an object or an array.

  if (typeof obj === 'object') {
    let cloned;

    if (Array.isArray(obj)) {
      cloned = [];
    } else {
      cloned = {};
    }

    for (const key in obj) {
      cloned[key] = clone(obj[key]);
    }

    return cloned;
  } else {
    return obj; // Numbers and strings are immutable anyway.
  }
}

/*=========================*\
||       Array Tools       ||
\*=========================*/

export function flatten(arr) {
  /**
   * Collapses a nested multidimensional array
   * down into a single array, keeping the order
   * of the elements as they appeared originally.
   */

  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (isArray(arr[i])) {
      flatten(arr[i]).forEach(val => {
        newArr.push(val);
      });
    } else {
      newArr.push(arr[i]);
    }
  }

  return newArr;
}

export function find(arr, func) {
  /**
   * Return the first item of the array that
   * causes 'func' to return true, or return
   * undefined if none return true.
   */

  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      return arr[i];
    }
  }
}

export function includes(arr, val) {
  // Determine whether any item in an array is equal to the given value.

  for (let i = 0; i < arr.length; i++) {
    if (isEqual(arr[i], val)) {
      return true;
    }
  }

  return false;
}

export const contains = includes; // Alias contains to includes. Same thing, different name.

export function arraySubtract(one, two) {
  if (!Array.isArray(one)) {
    throw new Error('subtractArray only works with an array as the first parameter.');
  }

  // Subtract the second array's values from the first.
  let result = [];

  if (Array.isArray(two)) {
    // Subtract array from array
    const marked = [];

    for (let x = 0; x < two.length; x++) {
      for (let y = 0; y < one.length; y++) {
        if (isEqual(one[y], two[x])) {
          marked.push(y);
          break;
        }
      }
    }

    result = one.filter((val, i) => !contains(marked, i));

  } else if (typeof two === 'string' || typeof two === 'number') {
    let found = false;
    for (let i = 0; i < one.length; i++) {
      if (!found && one[i] === two) {
        found = true;
        continue;
      }
      result.push(one[i]);
    }
  } else {
    throw new Error(`Cannot subtract ${typeof two} from an array.`);
  }


  return result;
}

export function asyncMap(arr, func) {
  // Like map, but takes a function that calls 'done' when it's done.
  // Makes it possible to use async stuff inside the function.
  // Takes a callback or returns a promise depending on if a callback
  // is passed as parameter 3.

  return new Promise((resolve, reject) => {
    const total = arr.length;
    let finished = 0;
    let current = 0;

    const mapped = [];

    function done(i, result) {
      finished += 1;
      mapped[i] = result;

      if (finished === total) {
        return resolve(mapped);
      }
    }

    try {
      for (let i = 0; i < total; i++) {
        current = i;
        func(arr[i], i, done.bind(null, i));
      }
    } catch (err) {
      return reject(Error(`Error occurred on item at index ${current}: ${err.message}`));
    }
  });
}

/*=========================*\
||           Math          ||
\*=========================*/

export function range(start, end, step = 1) {
  if (start == null && end == null) {
    throw Error('range must be passed at least one number in order to run');
  }

  // If only start is given, use it as the end and start from 0.
  if (start != null && end == null) {
    end = start;
    start = 0;
  }

  if (step === 0) {
    throw Error('Step cannot be 0');
  }

  // Prevent positive step with negative direction,
  // as well as negative step with positive direction.
  // Both will cause an infinite loop.
  if (end < start) {
    if (step > 0) step = -step;
  } else {
    if (step < 0) step = -step;
  }

  const nums = [];
  let current = start;

  while (current !== end) {
    nums.push(current);
    current += step;
  }

  nums.push(current); // Push final number to array.

  return nums;
}

export function clamp(num, low, high) {
  if (low > high) {
    throw Error('Low limit must be lower than high limit');
  }

  return Math.min(high, Math.max(low, num));
}

export function normalize(num, low, high) {
  if (low == null && high == null) {
    throw Error('normalize requires a low and high parameter to normalize to');
  }

  if (low > high) {
    throw Error('Low limit must be greater than high limit');
  }

  return (num - low) / (high - low);
}

export function rand(low, high, round = true) {
  const n = Math.random();

  if (low == null && high == null) {
    return n; // Basically alias Math.random if no bounds are given.
  }

  if ((low != null && high == null) || (low == null && high != null)) {
    throw Error('rand requires either no params (generates from 0 to 1) or both a low and a high (generates from low to high)');
  }

  // If low is higher than high, reverse the numbers.
  if (low > high) {
    const t = low;
    low = high;
    high = t;
  }

  const r = low + n * (high - low);
  return round ?
    ~~r // fast trunc (double bitwise not) - strips fractional numbers
    :
    r;
}

/*=========================*\
||       Other Utils       ||
\*=========================*/

export function lpad(num, len, char = '0') {
  num = num.toString();
  while (num.length < len) {
    num = char + num;
  }
  return num;
}

export function secondsToObject(sec) {
  const t = {};

  t.seconds = Math.trunc(sec % 60);
  t.minutes = Math.trunc(sec / 60);
  t.hours = Math.trunc(t.minutes / 60);
  t.days = Math.trunc(t.hours / 24);
  t.years = Math.trunc(t.days / 365);

  if (t.hours > 0) {
    t.minutes -= 60 * t.hours;
  }

  if (t.days > 0) {
    t.hours -= 24 * t.days;
  }

  if (t.years > 0) {
    t.days -= 365 * t.years;
  }

  return t;
}