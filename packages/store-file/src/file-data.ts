export interface FileData {
    scheme: string;
    timestamps: FileDataTimestamp[];
}

export interface FileDataTimestamp {
    database: string;
    lastWatchUnixTime: number;
    lastWatchPageIds: string[];
}
