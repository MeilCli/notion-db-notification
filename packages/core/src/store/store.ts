export interface Store {
    restore(): Promise<void>;

    save(): Promise<void>;

    putDatabaseLastWatch(databaseId: string, lastWatchUnixTime: number, lastWatchPageIds: string[]): void;

    getDatabaseLastWatch(databaseId: string): [number, string[]] | null;
}
