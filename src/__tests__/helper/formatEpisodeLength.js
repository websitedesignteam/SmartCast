import { formatEpisodeLength } from "src/utils/helper";

describe("formatEpisodeLength", () => {
    test("it should format a number time given in seconds to a string in standard minute:second format", () => {
        const input = 4320;
        const output = "72:00";

        expect(formatEpisodeLength(input)).toEqual(output);
    });
})
