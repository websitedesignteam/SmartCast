import { isFormComplete } from "src/utils/helper";

describe("isFormComplete", () => {
    // test("it should check if form is complete", () => {
    const input1 = {
        key1: "here's a string",
        key2: 1,
        key3: "another field i filled out",
    }
    const output1 = true;

    const input2 = {
        key1: "here's a string",
        key2: null,
        key3: "another field i filled out",
    }
    const output2 = false;

    //     expect(isFormComplete(input)).toEqual(output);
    // });

    it("should return true if every key in object has a truthy value", () => {
        expect(isFormComplete(input1)).toEqual(output1);
      });
      it("should return false if not every key has a truthy value", () => {
        expect(isFormComplete(input2)).toEqual(output2);
      });

})