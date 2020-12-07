import { getNameInFavoritePodcasts } from "src/utils/helper";

describe("getNameInFavoritePodcasts", () => {
    test("it should get the podcastName with the given podcastID inside of the array", () => {
        const inputKey1 = "123456"
        const inputArray1 = [
            { "podcastID": "934275", "podcastName": "this is my fave podcast" },
            { "podcastID": "723843", "podcastName": "this is my fave podcast too" },
            { "podcastID": "123456", "podcastName": "this is the one!!" },
            { "podcastID": "192", "podcastName": "not sure about this one" },
        ]
        const output1 = "this is the one!!";

        const inputKey2 = "123456"
        const inputArray2 = [
            { "podcastID": "934275", "podcastName": "this is my fave podcast" },
            { "podcastID": "723843", "podcastName": "this is my fave podcast too" },
            { "podcastID": "32758", "podcastName": "not anymore!" },
            { "podcastID": "192", "podcastName": "not sure about this one" },
        ]
        const output2 = undefined;

        expect(getNameInFavoritePodcasts(inputKey1, inputArray1)).toEqual(output1);
        expect(getNameInFavoritePodcasts(inputKey2, inputArray2)).toEqual(output2);
    });
})