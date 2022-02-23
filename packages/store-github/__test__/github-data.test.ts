import { GitHubData, equals } from "../src/github-data";

test("equalsExactly", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    expect(equals(left, right)).toBe(true);
});

test("equalsLazy", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [
            { database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] },
            { database: "d2", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] },
        ],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [
            { database: "d2", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] },
            { database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p2", "p1"] },
        ],
    };
    expect(equals(left, right)).toBe(true);
});

test("notEqualsTimestampLength", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [
            { database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] },
            { database: "d2", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] },
        ],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    expect(equals(left, right)).toBe(false);
});

test("notEqualsDatabaseId", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d2", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    expect(equals(left, right)).toBe(false);
});

test("notEqualsLastWatchUnixTime", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 12, lastWatchPageIds: ["p1", "p2"] }],
    };
    expect(equals(left, right)).toBe(false);
});

test("notEqualsLastWatchPageIdsLength", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1"] }],
    };
    expect(equals(left, right)).toBe(false);
});

test("notEqualsLastWatchPageIdsValue", () => {
    const left: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p1", "p2"] }],
    };
    const right: GitHubData = {
        scheme: "v0",
        timestamps: [{ database: "d1", lastWatchUnixTime: 11, lastWatchPageIds: ["p2", "p3"] }],
    };
    expect(equals(left, right)).toBe(false);
});
