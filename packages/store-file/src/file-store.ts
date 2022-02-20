import * as fs from "fs";
import * as path from "path";
import { Store } from "notion-db-notification-core";
import { FileData } from "./file-data";

export class FileStore implements Store {
    private data: FileData = { scheme: "v0", timestamps: [] };

    constructor(private readonly path: string) {}

    async restore(): Promise<void> {
        if (fs.existsSync(this.path)) {
            this.data = JSON.parse(fs.readFileSync(this.path).toString()) as FileData;
        } else {
            this.data = { scheme: "v0", timestamps: [] };
        }
    }

    async save(): Promise<void> {
        const directory = path.dirname(this.path);
        if (directory.length != 0 && fs.existsSync(directory) == false) {
            fs.mkdirSync(directory, { recursive: true });
        }
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return Promise.resolve();
    }

    putDatabaseLastWatch(databaseId: string, lastWatchUnixTime: number, lastWatchPageIds: string[]): void {
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
    }

    getDatabaseLastWatch(databaseId: string): [number, string[]] | null {
        for (const timestamp of this.data.timestamps) {
            if (timestamp.database == databaseId) {
                return [timestamp.lastWatchUnixTime, timestamp.lastWatchPageIds];
            }
        }
        return null;
    }
}
