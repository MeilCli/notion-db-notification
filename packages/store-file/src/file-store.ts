import * as fs from "fs";
import { Store } from "notion-db-notification-core";
import { FileData } from "./file-data";

export class FileStore implements Store {
    private readonly data: FileData;

    constructor(private readonly path: string) {
        if (fs.existsSync(path)) {
            this.data = JSON.parse(fs.readFileSync(path).toString()) as FileData;
        } else {
            this.data = { scheme: "v0", timestamps: [] };
        }
    }

    saveDatabaseLastWatch(databaseId: string, lastWatchUnixTime: number, lastWatchPageIds: string[]): Promise<void> {
        if (this.data.timestamps.map((x) => x.database).includes(databaseId)) {
            for (const timestamp of this.data.timestamps) {
                timestamp.lastWatchUnixTime = lastWatchUnixTime;
                timestamp.lastWatchPageIds = lastWatchPageIds;
            }
        } else {
            this.data.timestamps.push({
                database: databaseId,
                lastWatchUnixTime: lastWatchUnixTime,
                lastWatchPageIds: lastWatchPageIds,
            });
        }
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return Promise.resolve();
    }

    getDatabaseLastWatch(databaseId: string): Promise<[number, string[]] | null> {
        for (const timestamp of this.data.timestamps) {
            if (timestamp.database == databaseId) {
                return Promise.resolve([timestamp.lastWatchUnixTime, timestamp.lastWatchPageIds]);
            }
        }
        return Promise.resolve(null);
    }
}
