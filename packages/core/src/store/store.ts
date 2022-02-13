export interface Store {
    saveDatabaseLastWatch: (databaseId: string, lastWatchUnixTime: number, lastWatchPageIds: string[]) => Promise<void>;

    getDatabaseLastWatch: (databaseId: string) => Promise<[number, string[]] | null>;
}
