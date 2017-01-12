/* WUNDERSCORE!
 * ------------
 * This is the subset of underscore/lodash that I actually use, plus a couple more things.
 * I find both of them have lots and lots of functions that I will never use.
 * So this is my attempt at an easily portable, reusable subset that
 * makes sense for me.
 */


// I'm not going that deep into type checking.
// That's something lodash and underscore do, but I have another library
// called "is" at https://www.github.com/vantaure/is
function isObject(thing) {
	return typeof thing === "object" && !Array.isArray(thing);
}

exports.isEqual = function isEqual(one, two) {
	// All-purpose equality check including deep comparison of objects.

	if (typeof one === typeof two) {
		if (isObject(one) && isObject(two)) {
			// Both values are objects.
			if (Object.keys(one).length !== Object.keys(two).length) {
				// The objects have different numbers of values. Not equal.
				return false;
			}

			// Both are objects with the same number of values.
			// Run through each one and compare them.
			for (var key in one) {
				if (!isEqual(one[key], two[key])) {
					return false;
				}
			}
		} else {
			// Otherwise just do a regular strict equality check.
			if (one !== two) {
				return false;
			}
		}
	} else {
		return false;
	}

	// If the function hasn't returned false by now, that means our values,
	// if objects, have the same number of keys, and all have equal values,
	// and if not objects, they have passed a strict equality check.
	return true;
}

exports.mapObject = function(obj, func) {
	// Like ES5 map, but for object values instead of arrays.
	const mapped = [];

	for (var key in obj) {
		// Pass the value, like normal _.map(), but the key
		// as the second property instead of an index.
		mapped.push(func(obj[key], key));
	}

	return mapped;
}

exports.map = function(arr, func) {
	const mapped = [];

	for (var i = 0; i < arr.length; i++) {
		mapped.push(func(arr[i], i));
	}

	return mapped;
}

exports.filterObject = function(obj, func) {
	const filtered = {};

	for (var key in obj) {
		if (func(obj[key], key)) {
			filtered[key] = obj[key];
		}
	}

	return filtered;
}
	
exports.filter = function(arr, func) {
	var filtered = [];
	
	for (var i = 0; i < arr.length; i++) {
		if (func(arr[i])) {
			filtered.push(arr[i]);
		}
	}
	
	return filtered;
}

exports.countBy = function(obj, func) {
	const counts = {};

	for (let key in obj) {
		const returnVal = func(obj[key]);

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

exports.toArray = function(obj) {
	// Convert an object to an array of its values.
	
	var arr = [];

	for (var key in obj) {
		arr.push(obj[key]);
	}

	return arr;
}

exports.flatten = function(arr) {
	var newArr = [];

	for (var i = 0; i < arr.length; i++) {
		if (Array.isArray(arr[i])) {
			for (var a = 0; a < arr[i].length; a++) {
				newArr.push(arr[i][a]);
			}
		} else {
			newArr.push(arr[i]);
		}
	}

	return newArr;
}

exports.find = function(arr, func) {
	// Return the first item that returns true from the function, or undefined if no matches.

	for (var i = 0; i < arr.length; i++) {
		if (func(arr[i])) {
			return arr[i];
		}
	}

	return undefined;
}

exports.forEach = function(arr, func) {
	for (var i = 0; i < arr.length; i++) {
		func(arr[i], i);
	}
}

exports.forEachReverse = function(arr, func) {
	var fw = 0; // Forward index from first item to last in order of iteration.
	for (var i = arr.length - 1; i >= 0; i--) {
		func(arr[i], fw, i);
		fw++;
	}
}

exports.contains = function(arr, val) {
	// Determine whether any item in an array is equal to the given value.

	for (var i = 0; i < arr.length; i++) {
		if (isEqual(arr[i], val)) {
			return true;
		}
	}

	return false;
}

exports.includes = exports.contains; // Because I always get these confused anyway. They're the same damn thing.
