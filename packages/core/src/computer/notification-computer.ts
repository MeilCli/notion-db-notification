import { Store } from "../store";
import { NotificationSender } from "../sender";
import { NotionClient } from "../client";
import { Notification, NotificationEvent, DatabasePage } from "../type";
import { NotificationChannel } from "../channel";
import { Source } from "../source";
import { FilterExecutor } from "./filter-executor";

export class NotificationComputer {
    constructor(
        private readonly client: NotionClient,
        private readonly store: Store,
        private readonly senders: NotificationSender[],
        private readonly channels: NotificationChannel[],
        private readonly sources: Source[]
    ) {}

    async init(): Promise<void> {
        this.log("init:");

        await this.store.restore();
        this.log("store: restore");

        const databaseIds = this.getDatabaseIds();
        for (const databaseId of databaseIds) {
            const lastWatch = await this.store.getDatabaseLastWatch(databaseId);
            if (lastWatch != null) {
                continue;
            }
            this.log(`init: database: ${databaseId}`);

            const pages = await this.client.getDatabasePagesWithNoPaging(databaseId);
            if (pages.length == 0) {
                continue;
            }

            const lastEditedUnixTime = Date.parse(pages[0].last_edited_time);
            const lastEditedSameTimePageIds = pages
                .filter((x) => Date.parse(x.last_edited_time) == lastEditedUnixTime)
                .map((x) => x.id);
            this.store.putDatabaseLastWatch(databaseId, lastEditedUnixTime, lastEditedSameTimePageIds);
            this.log(`init: database: ${databaseId} completed`);
        }

        await this.store.save();
        this.log("store: save");
    }

    async run(isDryRun: boolean): Promise<void> {
        this.log(`run: isDryRun: ${isDryRun}`);

        await this.store.restore();
        this.log("store: restore");

        const databaseIds = this.getDatabaseIds();
        const databasePages = new Map<string, DatabasePage[]>();
        const databaseLastWatches = new Map<string, number | null>();
        for (const databaseId of databaseIds) {
            this.log(`getPages: database: ${databaseId}`);

            const lastWatch = await this.store.getDatabaseLastWatch(databaseId);
            const [lastWatchUnixTime, lastWatchPageIds] =
                lastWatch == null ? [null, null] : [lastWatch[0], lastWatch[1]];
            databaseLastWatches.set(databaseId, lastWatchUnixTime);
            if (lastWatchUnixTime != null) {
                this.log(`getPages: database: ${databaseId}, lastWatch: ${new Date(lastWatchUnixTime).toISOString()}`);
            } else {
                this.log(`getPages: database: ${databaseId}, lastWatch: null`);
            }

            const pages = await this.client.getDatabasePages(databaseId, lastWatchUnixTime, lastWatchPageIds);
            databasePages.set(databaseId, pages);
            this.log(`getPages: database: ${databaseId}, updatePages: ${pages.length}`);

            if (0 < pages.length) {
                const newLastWatchUnixTime = Date.parse(pages[0].last_edited_time);
                const newLastWatchPageIds: string[] = [];
                if (lastWatchUnixTime != newLastWatchUnixTime) {
                    newLastWatchPageIds.push(
                        ...pages.filter((x) => newLastWatchUnixTime == Date.parse(x.last_edited_time)).map((x) => x.id)
                    );
                } else if (lastWatchPageIds != null) {
                    // previous execution is same minute
                    newLastWatchPageIds.push(...lastWatchPageIds);
                    newLastWatchPageIds.push(
                        ...pages.filter((x) => newLastWatchUnixTime == Date.parse(x.last_edited_time)).map((x) => x.id)
                    );
                }
                this.store.putDatabaseLastWatch(databaseId, newLastWatchUnixTime, newLastWatchPageIds);
            }
        }

        const filterExecutor = new FilterExecutor();
        for (const source of this.sources) {
            const pages = databasePages.get(source.database);
            if (pages == undefined) {
                continue;
            }
            const lastWatch = databaseLastWatches.get(source.database);
            for (const page of pages) {
                const lastEditedUnixTime = Date.parse(page.last_edited_time);
                const createdUnixTime = Date.parse(page.created_time);
                const event: NotificationEvent =
                    lastWatch != null &&
                    lastWatch != undefined &&
                    lastWatch <= lastEditedUnixTime &&
                    createdUnixTime < lastWatch
                        ? "Updated"
                        : "Created";
                this.log(`foundPages: database: ${source.database}, page: ${page.id} event: ${event}`);

                if (source.filter != null && filterExecutor.execute(event, page, source.filter) == false) {
                    this.log(`foundPages: database: ${source.database}, page: ${page.id}, filtered`);
                    continue;
                }

                const notification: Notification = {
                    title: this.findTitle(page),
                    url: page.url,
                    properties: new Map(Object.entries(page.properties)),
                    event: event,
                };

                await this.sendNotification(source.channel, notification, isDryRun);
            }
        }

        if (isDryRun == false) {
            await this.store.save();
            this.log("store: save");
        } else {
            this.log("store: save: dryRun");
        }
    }

    private log(text: string) {
        console.log(`NotificationComputer: ${text}`);
    }

    private getDatabaseIds(): Set<string> {
        const result = new Set<string>();
        for (const source of this.sources) {
            result.add(source.database);
        }
        return result;
    }

    private findTitle(page: DatabasePage): string {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, property] of Object.entries(page.properties)) {
            if (property.type == "title") {
                if (property.title.length == 0) {
                    return "";
                }
                return property.title[0].plain_text;
            }
        }
        return "";
    }

    private async sendNotification(channel: string, notification: Notification, isDryRun: boolean): Promise<void> {
        const targetChannels = this.channels.filter((x) => x.name == channel);
        for (const targetChannel of targetChannels) {
            for (const sender of this.senders) {
                if (sender.hasChannel(targetChannel)) {
                    if (isDryRun) {
                        this.log(`send(dryRun): channel: ${targetChannel.name}, notification: ${notification.url}`);
                    } else {
                        await sender.send(targetChannel, notification);
                        this.log(`send: channel: ${targetChannel.name}, notification: ${notification.url}`);
                    }
                }
            }
        }
    }
}
