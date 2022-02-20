export interface GitHubData {
    scheme: string;
    timestamps: GitHubDataTimestamp[];
}

export interface GitHubDataTimestamp {
    database: string;
    lastWatchUnixTime: number;
    lastWatchPageIds: string[];
}
