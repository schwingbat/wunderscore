const isEqual = require("../wunderscore").isEqual;

describe("isEqual", () => {
	it("should find two empty objects to be equal", () => {
		expect(isEqual({}, {})).toBe(true);
	});

	it("should find two objects with the same values equal", () => {
		const obj1 = {
			one: "1",
			two: 2,
			three: {
				value: "three"
			}
		}

		const obj2 = {
			one: "1",
			two: 2,
			three: {
				value: "three"
			}
		}

		expect(isEqual(obj1, obj2)).toBe(true);
	});

	it("should find two objects with different values unequal", () => {
		const obj1 = {
			one: "1",
			two: 2,
			three: {
				value: "three"
			}
		}

		const obj2 = {
			one: "5",
			two: 7,
			three: {
				schalrb: false
			}
		}

		expect(isEqual(obj1, obj2)).toBe(false);
	});

	it("should find one object with a subset of another's values to be unequal", () => {
		const obj1 = {
			one: "1",
			two: 2,
			three: {
				value: "three"
			}
		}

		const obj2 = {
			two: 2,
		}

		expect(isEqual(obj1, obj2)).toBe(false);
	});

	it("should find two instantiations of the same constructor equal", () => {
		function Proto() {
			this.value = "hello world"
		}

		const one = new Proto();
		const two = new Proto();

		expect(isEqual(one, two)).toBe(true);
	});

	it("should find two of the same number equal", () => {
		expect(isEqual(5, 5)).toBe(true);
	});

	it("should find two different numbers to be unequal", () => {
		expect(isEqual(15, 9)).toBe(false);
	});

	it("should find an object and a number unequal", () => {
		expect(isEqual({ val: "hello" }, 5)).toBe(false);
	});

	it("should find two arrays with the same values equal", () => {
		var arr1 = [1, 2, 3, 4, 5];
		var arr2 = [1, 2, 3, 4, 5];

		expect(isEqual(arr1, arr2)).toBe(true);
	});

	it("should find two arrays with different numbers unequal", () => {
		var arr1 = [1, 2, 3, 4, 5];
		var arr2 = [1, 2, 3, 4, 6];

		expect(isEqual(arr1, arr2)).toBe(false);
	});
});