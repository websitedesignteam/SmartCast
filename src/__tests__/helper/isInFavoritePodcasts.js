import { isInFavoritePodcasts } from "src/utils/helper";

describe("isInFavoritePodcasts", () => {
    test("it should return true if the nested term is a value inside the array, otherwise return false", () => {
        const inputKey1 = "123456"
        const inputArray1 = [
            { "podcastID": "934275", "podcastName": "this is my fave podcast" },
            { "podcastID": "723843", "podcastName": "this is my fave podcast too" },
            { "podcastID": "123456", "podcastName": "this is the one!!" },
            { "podcastID": "192", "podcastName": "not sure about this one" },
        ]
        const output1 = true;

        const inputKey2 = "123456"
        const inputArray2 = [
            { "podcastID": "934275", "podcastName": "this is my fave podcast" },
            { "podcastID": "723843", "podcastName": "this is my fave podcast too" },
            { "podcastID": "32758", "podcastName": "not anymore!" },
            { "podcastID": "192", "podcastName": "not sure about this one" },
        ]
        const output2 = false;

        expect(isInFavoritePodcasts(inputKey1, inputArray1)).toEqual(output1);
        expect(isInFavoritePodcasts(inputKey2, inputArray2)).toEqual(output2);
    });
})