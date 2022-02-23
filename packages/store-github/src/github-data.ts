export interface GitHubData {
    scheme: string;
    timestamps: GitHubDataTimestamp[];
}

export interface GitHubDataTimestamp {
    database: string;
    lastWatchUnixTime: number;
    lastWatchPageIds: string[];
}

export function equals(left: GitHubData | undefined, right: GitHubData | undefined): boolean {
    if (left == undefined || right == undefined) {
        return left == right;
    }
    if (left.scheme != right.scheme) {
        return false;
    }
    if (left.timestamps.length != right.timestamps.length) {
        return false;
    }
    for (const leftTimestamp of left.timestamps) {
        if (contains(right.timestamps, leftTimestamp) == false) {
            return false;
        }
    }
    return true;
}

function contains(array: GitHubDataTimestamp[], value: GitHubDataTimestamp): boolean {
    for (const a of array) {
        if (a.database != value.database) {
            continue;
        }
        if (a.lastWatchUnixTime != value.lastWatchUnixTime) {
            continue;
        }
        if (arrayEquals(a.lastWatchPageIds, value.lastWatchPageIds) == false) {
            continue;
        }
        return true;
    }
    return false;
}

function arrayEquals(left: string[], right: string[]): boolean {
    if (left.length != right.length) {
        return false;
    }
    for (const leftValue of left) {
        if (right.includes(leftValue) == false) {
            return false;
        }
    }
    return true;
}
