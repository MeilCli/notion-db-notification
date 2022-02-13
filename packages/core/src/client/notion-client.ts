import { Client } from "@notionhq/client";
import { DatabasePage } from "../type";
import { ApiPoller } from "./api-poller";

type DataBaseQueryResponse = ReturnType<Client["databases"]["query"]> extends Promise<infer T> ? T : never;

export class NotionClient {
    private readonly client: Client;

    constructor(private readonly apiPoller: ApiPoller, token: string) {
        this.client = new Client({ auth: token });
    }

    async getDatabasePagesWithNoPaging(databaseId: string): Promise<DatabasePage[]> {
        const response = await this.apiPoller.callApi(() =>
            this.client.databases.query({
                database_id: databaseId,
                page_size: 100,
                sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
            })
        );

        const result: DatabasePage[] = [];
        for (const value of response.results) {
            if ("last_edited_time" in value) {
                result.push(value);
            }
        }
        return result;
    }

    /**
     * getDatabasePages with paging
     * @param sinceUnixTime get pages since time
     * @param sincePageIds get pages since page, this parameter is used at same time. Because Notion may return time that exclude information of secounds.
     */
    async getDatabasePages(
        databaseId: string,
        sinceUnixTime: number | null,
        sincePageIds: string[] | null
    ): Promise<DatabasePage[]> {
        let response: DataBaseQueryResponse | null = await this.apiPoller.callApi(() =>
            this.client.databases.query({
                database_id: databaseId,
                page_size: 100,
                sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
            })
        );

        const result: DatabasePage[] = [];

        while (response != null) {
            if (sinceUnixTime == null) {
                for (const value of response.results) {
                    if ("last_edited_time" in value) {
                        result.push(value);
                    }
                }
            } else {
                for (const value of response.results) {
                    if ("last_edited_time" in value) {
                        const editedUnixTime = Date.parse(value.last_edited_time);
                        if (sinceUnixTime < editedUnixTime) {
                            result.push(value);
                        } else if (
                            sinceUnixTime == editedUnixTime &&
                            sincePageIds != null &&
                            sincePageIds.includes(value.id) == false
                        ) {
                            result.push(value);
                        } else if (sinceUnixTime != editedUnixTime) {
                            return result;
                        }
                    }
                }
            }
            const nextCursor: string | null = response.next_cursor;
            if (response.has_more && nextCursor != null) {
                response = await this.apiPoller.callApi(() =>
                    this.client.databases.query({
                        database_id: databaseId,
                        start_cursor: nextCursor,
                        page_size: 100,
                        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
                    })
                );
            } else {
                response = null;
            }
        }

        return result;
    }
}
