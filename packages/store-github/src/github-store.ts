import { Octokit } from "@octokit/rest";
import { Store } from "notion-db-notification-core";
import { GitHubData, equals } from "./github-data";
import { GitHubAuth } from "./github-auth";

export class GitHubStore implements Store {
    private data: GitHubData = { scheme: "v0", timestamps: [] };
    private fileSha: string | undefined = undefined;
    private previousData: GitHubData | undefined = undefined;

    constructor(
        private readonly path: string,
        private readonly owner: string,
        private readonly repository: string,
        private readonly auth: GitHubAuth
    ) {}

    async restore(): Promise<void> {
        const token = await this.auth.getToken();
        const octokit = new Octokit({ auth: token, userAgent: "notion-db-notification" });
        try {
            const response = await octokit.repos.getContent({
                owner: this.owner,
                repo: this.repository,
                path: this.path,
            });
            if (Array.isArray(response.data)) {
                throw Error("path is directory");
            }
            if (response.data.type != "file") {
                throw Error("path is not file");
            }
            if ("content" in response.data) {
                this.fileSha = response.data.sha;
                this.data = JSON.parse(Buffer.from(response.data.content, "base64").toString()) as GitHubData;
                this.previousData = JSON.parse(Buffer.from(response.data.content, "base64").toString()) as GitHubData;
            }
            // eslint-disable-next-line no-empty
        } catch (error) {}
    }

    async save(): Promise<void> {
        const token = await this.auth.getToken();
        const octokit = new Octokit({ auth: token, userAgent: "notion-db-notification" });
        const content = Buffer.from(JSON.stringify(this.data, undefined, 4)).toString("base64");
        if (equals(this.previousData, this.data)) {
            return Promise.resolve();
        }
        await octokit.repos.createOrUpdateFileContents({
            owner: this.owner,
            repo: this.repository,
            path: this.path,
            content: content,
            message: "update state",
            sha: this.fileSha,
        });
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
