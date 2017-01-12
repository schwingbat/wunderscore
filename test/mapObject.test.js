const mapObject = require("../wunderscore").mapObject;

describe("mapObject", () => {
	it("should transform an object into an array of its values", () => {
		var obj = {
			one: "one",
			two: "two",
			three: 3
		}

		expect(mapObject(obj, v => v)).toEqual(["one", "two", 3]);
	});
});