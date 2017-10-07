import * as _ from './wunderscore';

//================================//
//         Type Functions         //
//================================//

describe('Type Functions', () => {
	describe('isEqual', () => {
		test('compares numbers', () => {
			expect(_.isEqual(1, 1)).toBe(true);
			expect(_.isEqual(5, 5)).toBe(true);
			expect(_.isEqual(72, 41)).toBe(false);
		});

		test('compares objects', () => {
			expect(_.isEqual({ thing1: 'yes' }, { thing1: 'yes' })).toBe(true);
			expect(_.isEqual({ thing1: 'yes' }, { thing2: 'nope' })).toBe(false);
			expect(_.isEqual({ thing1: 'yep', thing2: 'yep' }, { shorter: 'nope' })).toBe(false);
		});

		test('compares functions', () => {
			const f1 = val => val;
			const f2 = val => val * 2;

			expect(_.isEqual(f1, f2)).toBe(false);
			expect(_.isEqual(f1, f1)).toBe(true);
		});

		test('compares arrays', () => {
			const a1 = [1, 2, 3];
			const a2 = [2, 3, 4];

			expect(_.isEqual(a1, [1, 2, 3])).toBe(true);
			expect(_.isEqual(a1, a2)).toBe(false);
			expect(_.isEqual([1, 'two', { three: 'fish' }], [1, 'three'])).toBe(false);
		});

		test('compares nested objects and arrays', () => {
			expect(_.isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
			expect(_.isEqual([1, [2, 3]], [[1, 2], 3])).toBe(false);
		});
	});

	describe('isArray', () => {
		test('correctly identifies arrays', () => {
			expect(_.isArray([1, 2, 3])).toBe(true);
			expect(_.isArray({ fish: 'positive' })).toBe(false);
			expect(_.isArray(function() { return 'nope'; })).toBe(false);
		});
	});

	describe('isFunction', () => {
		test('correctly identifies functions', () => {
			expect(_.isFunction([1, 2, 3])).toBe(false);
			expect(_.isFunction({ fish: 'positive' })).toBe(false);
			expect(_.isFunction(function() { return 'yep'; })).toBe(true);
			expect(_.isFunction(() => 'also yep')).toBe(true);
		});
	});

	describe('isObject', () => {
		test('correctly identifies objects', () => {
			expect(_.isObject([1, 2, 3])).toBe(false);
			expect(_.isObject({ fish: 'positive' })).toBe(true);
			expect(_.isObject(function() { return 'nope'; })).toBe(false);

			function Thing() {
				this.isAnObject = 'yes';
			}

			expect(_.isObject(new Thing())).toBe(true);

			function Whoa() {
				return {
					isAnObject: true
				};
			}

			expect(_.isObject(Whoa())).toBe(true);	
		});
	});

	describe('isEmail', () => {
		test('correctly identifies email addresses', () => {
			expect(_.isEmail('toonytony@gmail.com')).toBe(true);
			expect(_.isEmail('imriledup@gmail.com')).toBe(true);
			expect(_.isEmail('nobodyinparticular@yahoo.com')).toBe(true);
		});

		test('accepts addresses from new TLDs', () => {
			expect(_.isEmail('tony@ratwizard.io')).toBe(true);
			expect(_.isEmail('fork@dog.club')).toBe(true);
			expect(_.isEmail('jork@pickle.detective')).toBe(true);
		});

		test('rejects invalid email addresses', () => {
			expect(_.isEmail('')).toBe(false);
			expect(_.isEmail('just_a_name')).toBe(false);
			expect(_.isEmail(';DROP TABLE USERS;')).toBe(false);
		});
	});
});

//================================//
//        Object Functions        //
//================================//

describe('Object Functions', () => {
	describe('mapObject', () => {
		test('converts values into an array if no function is given', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			const mapped = _.mapObject(obj);

			expect(mapped).toEqual(['cat', 'dog', 'dog']);
		});

		test('uses a given function to modify the mapped values', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			const mapped = _.mapObject(obj, val => val.toUpperCase());

			expect(mapped).toEqual(['CAT', 'DOG', 'DOG']);
		});
	});

	describe('filterObject', () => {
		test('passes the value and the key to the given function', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			let fail = false;

			_.filterObject(obj, (val, key) => {
				if (!val || !key) fail = true;	
			});

			expect(fail).toBe(false);
		});

		test('filters the object using the given function', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			const filtered = _.filterObject(obj, (val, key) => key !== 'Lacie');

			expect(filtered).toEqual({
				Catniss: 'cat',
				Jack: 'dog'
			});
		});
	});

	describe('toArray', () => {
		test('converts an object\'s values into an array', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			expect(_.toArray(obj)).toEqual(['cat', 'dog', 'dog']);
		});
	});

	describe('countBy', () => {
		test('given function is passed the value and the key as parameters', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			let fail = false;
			_.countBy(obj, (val, key) => {
				if (!val || !key) fail = true;
			});

			expect(fail).toBe(false);
		});

		test('counts by value', () => {
			const obj = {
				Catniss: 'cat',
				Lacie: 'dog',
				Jack: 'dog',
			};

			const counted = _.countBy(obj, val => val);

			expect(counted).toEqual({
				cat: 1,
				dog: 2
			});
		});
	});

	describe('clone', () => {
		test('clone sanity check - two references to same object are both linked', () => {
			let obj1 = { test: 1 };
			let obj2 = obj1;

			obj1.test = 5;
			expect(obj2.test).toBe(5);

			obj2.test = 'fork';
			expect(obj1.test).toBe('fork');

			expect(obj1.test).toBe(obj2.test);

			let arr1 = [1, 2, 3];
			let arr2 = arr1;

			arr1[1] = 5;
			expect(arr2[1]).toBe(5);

			arr2[3] = 7;
			expect(arr1).toEqual([1, 5, 3, 7]);
			expect(arr1).toBe(arr2);
		});

		test('clone clones objects', () => {
			const obj = { test: 5 };
			const obj2 = _.clone(obj);

			obj.test = 'fish';
			expect(obj2.test).toBe(5);
		});

		test('clone clones arrays', () => {
			const arr = [1, 2, 3];
			const arr2 = _.clone(arr);

			arr[1] = 5;
			expect(arr2).toEqual([1, 2, 3]);
		});

		test('clone clones recursively', () => {
			const arr = [{ test: 1 }, { test: 2 }, { test: 3 }];
			const arr2 = _.clone(arr);

			arr[1].test = 'fish';

			expect(arr2[1].test).toBe(2);
		});

		test('clone passes through non object or arrays', () => {
			expect(_.clone(5)).toBe(5);
			expect(_.clone('string')).toBe('string');
		});
	});
});

//================================//
//         Array Functions        //
//================================//

describe('Array Functions', () => {
	describe('flatten', () => {
		test('flattens a 2D array', () => {
			const arr = [
				[1, 2, 3],
				[4, 5, 6]
			];

			expect(_.flatten(arr)).toEqual([1, 2, 3, 4, 5, 6]);
		});

		test('flattens a 3D array', () => {
			const arr = [
				[1, [2, 3]],
				[[4, 5], 6]
			];

			expect(_.flatten(arr)).toEqual([1, 2, 3, 4, 5, 6]);
		});

		test('flattens a 4D array', () => {
			const arr = [
				[[1, [2, [3]]]],
				[[[[4], 5], 6]]
			];

			expect(_.flatten(arr)).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});

	describe('find', () => {
		test('finds the first match in an array', () => {
			const arr = [{
				number: 1,
				value: 'blark'
			}, {
				number: 2,
				value: 'blork'
			}, {
				number: 3,
				value: 'blork'
			}];

			const found = _.find(arr, val => val.value === 'blork');

			expect(found.number).toBe(2);
		});
	});

	describe('contains/includes', () => {
		test('returns true in true cases', () => {
			expect(_.contains([1, 'two', { three: true }], 'two')).toBe(true);
		});

		test('compares object equality by value', () => {
			expect(_.contains([1, 'two', { three: true }], { three: true })).toBe(true);
		});

		test('returns false in false cases', () => {
			expect(_.contains([1, 'two', { three: true }], 'four')).toBe(false);
		});

		test('contains and includes are the same function', () => {
			expect(_.contains).toBe(_.includes);
		});
	});

	describe('arraySubtract', () => {
		test('exists and is a function', () => {
			expect(typeof _.arraySubtract).toBe('function');
		});

		test('throws an error if first param is not an array', () => {
			expect(() => _.arraySubtract(5, 2)).toThrow();
		});

		test('subtracts a string from an array', () => {
			expect(_.arraySubtract(['1', '2', 3], '2')).toEqual(['1', 3]);
		});

		test('subtracts a number from an array', () => {
			expect(_.arraySubtract([5, 5, 7, 2], 5)).toEqual([5, 7, 2]);
		});

		test('subtracts an array from an array', () => {
			expect(_.arraySubtract([1, 2, 3, 'fish'], [2, 'fish'])).toEqual([1, 3]);
		});

		test('subtracts an array with nested objects from an array', () => {
			const arr = [{
				name: 'thing1'
			}, {
				name: 'thing2'
			}];

			const arr2 = [{
				name: 'thing2'
			}];

			expect(_.arraySubtract(arr, arr2)).toEqual([{ name: 'thing1' }]);
		});

		test('subtracts the right number of items when dealing with several identical values', () => {
			expect(_.arraySubtract(['E', 'E', 'R', 'I', 'E'], ['E', 'I'])).toEqual(['E', 'R', 'E']);
		});

		test('doesn\'t subtract when items are present that aren\'t in the original array' , () => {
			expect(_.arraySubtract(['E', 'E', 'R', 'I', 'E'], ['E', 'I', 'F', 'Y'])).toEqual(['E', 'R', 'E']);
		});
	});

	describe('asyncMap', () => {
		test('takes an array and maps it using the callback', () => {
			expect.assertions(1);

			_.asyncMap([1, 2, 3], (n, i, done) => done(n * 2))
				.then(result => {
					expect(result).toEqual([2, 4, 6]);
				});
		});

		test('reports errors occurring at the right index', () => {
			expect.assertions(1);

			_.asyncMap([1, 2, 3], (n, i, done) => {
				if (i === 1) {
					throw Error('BOOM');
				} else {
					return done(n.toString());
				}
			}).catch(err => {
				expect(err.message.indexOf('index 1')).toBeGreaterThan(0);
			});
		});

		test('works with indefinitely timed resolutions', () => {
			expect.assertions(1);

			const promise = _.asyncMap(['one', 'two', 'three'], (s, i, done) => {
				setTimeout(() => {
					done(s.toUpperCase());
				}, Math.random() * 500);
			});

			return expect(promise).resolves.toEqual(['ONE', 'TWO', 'THREE']);
		});
	});
});

//================================//
//              Math              //
//================================//

describe('Math', () => {
	describe('range', () => {
		test('works with one number specified - 0 to specified', () => {
			expect(_.range(5)).toEqual([0, 1, 2, 3, 4, 5]);
		});

		test('works start and end specified - start to end', () => {
			expect(_.range(5, 10)).toEqual([5, 6, 7, 8, 9, 10]);
		});

		test('throws error if no number parameters are passed', () => {
			expect(() => {
				_.range();
			}).toThrow();
		});

		test('throws error if step of 0 is passed', () => {
			expect(() => {
				_.range(0, 10, 0);
			}).toThrow();
		});

		test('makes a negative step positive when range direction is positive (infinite loop)', () => {
			expect(_.range(0, 50, -10)).toEqual([0, 10, 20, 30, 40, 50]);
		});

		test('makes a positive step negative when range direction is negative (infinite loop)', () => {
			expect(_.range(10, -70, 20)).toEqual([10, -10, -30, -50, -70]);
		});

		test('works with start, end and step specified - start to end by step', () => {
			expect(_.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
			expect(_.range(10, 50, 10)).toEqual([10, 20, 30, 40, 50]);
		});

		test('works with negative end and step', () => {
			expect(_.range(0, -10, -1)).toEqual([0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]);
			expect(_.range(10, -10, -5)).toEqual([10, 5, 0, -5, -10]);
		});
	});

	describe('clamp', () => {
		test('clamps numbers at the high bound', () => {
			expect(_.clamp(50, 0, 10)).toBe(10);
			expect(_.clamp(11, 5, 8)).toBe(8);
		});

		test('clamps numbers at the low bound', () => {
			expect(_.clamp(6, 12, 19)).toBe(12);
		});

		test('doesn\'t clamp if numbers are within bounds', () => {
			expect(_.clamp(5, 0, 10)).toBe(5);
		});

		test('throws error if low limit is greater than high limit', () => {
			expect(() => _.clamp(50, 12, 2)).toThrow();
		});
	});

	describe('normalize', () => {
		test('normalize throws error when no bounds are passed', () => {
			expect(() => _.normalize(5)).toThrow();
		});

		test('normalize throws error when low bound is higher than high bound', () => {
			expect(() => _.normalize(5, 10, 0)).toThrow();
		});

		test('normalize normalizes between low and high bound', () => {
			expect(_.normalize(5, 0, 10)).toBe(0.5);
			expect(_.normalize(76, 30, 900)).toBe(0.052873563218390804);
		});
	});

	describe('rand', () => {
		test('generates a random number', () => {
			let last;
			let same = true;

			for (let i = 0; i < 10; i++) {
				const n = _.rand();
				if (last && n != last) {
					same = false;
					break;
				}
				last = n;
			}

			expect(same).toBe(false);
		});

		test('throws when only one parameter is passed', () => {
			expect(() => _.rand(5)).toThrow();
			expect(() => _.rand(null, 5)).toThrow();
		});

		test('generates a number between a lower and upper given bound', () => {
			expect((() => {
				let works = true;

				for (let i = 0; i < 10000; i++) {
					const n = _.rand(5, 50);

					if (n < 5 || n > 50) {
						works = false;
						break;
					}
				}

				return works;
			})()).toBe(true);
		});

		test('works properly even if you pass low and high in reverse order', () => {
			let works = true;

			for (let i = 0; i < 1000; i++) {
				const n = _.rand(10, 5);
				if (n < 5 || n > 10) {
					works = false;
					break;
				}
			}

			expect(works).toBe(true);
		});

		test('rounds to a float if parameter 3 (round) is false', () => {
			let works = true;

			for (let i = 0; i < 1000; i++) {
				const n = _.rand(10, 5, false);
				if (Math.trunc(n) === n) {
					works = false;
					break;
				}
			}

			expect(works).toBe(true);
		});
	});
});

//================================//
//        Utility Functions       //
//================================//

describe('Utility Functions', () => {
	describe('lpad', () => {
		test('pads to the proper length', () => {
			expect(_.lpad(5, 5)).toBe('00005');
		});

		test('works with arbitrary padding characters', () => {
			expect(_.lpad('fish', 10, '-')).toBe('------fish');
		});
	});

	describe('secondsToObject', () => {
		test('parses seconds correctly', () => {
			expect(_.secondsToObject(6124)).toEqual({
				seconds: 4,
				minutes: 42,
				hours: 1,
				days: 0,
				years: 0
			});

			expect(_.secondsToObject(24)).toEqual({
				seconds: 24,
				minutes: 0,
				hours: 0,
				days: 0,
				years: 0
			});

			expect(_.secondsToObject(31749190)).toEqual({
				seconds: 10,
				minutes: 13,
				hours: 11,
				days: 2,
				years: 1
			});
		});
	});
});