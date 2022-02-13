import * as slack from "@slack/web-api";
import { Notification, NotificationChannel, NotificationSender, DatabaseProperty } from "notion-db-notification-core";
import { SlackNotificationChannel } from "./slack-notification-channel";

export class SlackNotificationSender implements NotificationSender {
    constructor(private readonly token: string, private readonly apiUrl: string | undefined) {}

    hasChannel(channel: NotificationChannel): boolean {
        return channel instanceof SlackNotificationChannel;
    }

    async send(channel: NotificationChannel, notification: Notification): Promise<void> {
        if (channel instanceof SlackNotificationChannel) {
            const client = new slack.WebClient(this.token, { slackApiUrl: this.apiUrl });
            const urlText = notification.title.length == 0 ? "empty title" : notification.title;
            const message = `<${notification.url}|${urlText}> was ${notification.event}`;
            const fields = this.getAttachmentFields(notification.properties)?.filter((x) => x.value.length != 0);
            await client.chat.postMessage({
                channel: channel.slackId,
                text: message,
                attachments: [{ fields: fields }],
            });
        } else {
            return Promise.resolve();
        }
    }

    private getAttachmentFields(
        properties: Map<string, DatabaseProperty>
    ): { title: string; value: string; short: boolean }[] | undefined {
        const result: { title: string; value: string; short: boolean }[] = [];
        for (const [name, property] of properties) {
            switch (property.type) {
                case "checkbox":
                    result.push({ title: name, value: property.checkbox ? ":white_check_mark:" : "", short: true });
                    break;
                case "created_by":
                    result.push({
                        title: name,
                        value: "name" in property.created_by ? `@${property.created_by.name}` : "",
                        short: true,
                    });
                    break;
                case "created_time":
                    result.push({ title: name, value: this.toDateText(property.created_time), short: true });
                    break;
                case "date":
                    result.push({
                        title: name,
                        value:
                            property.date != null
                                ? property.date.end == null
                                    ? this.toDateText(property.date.start)
                                    : `${this.toDateText(property.date.start)}~${this.toDateText(property.date.end)}`
                                : "",
                        short: true,
                    });
                    break;
                case "email":
                    result.push({ title: name, value: property.email ?? "", short: true });
                    break;
                case "files": {
                    const urlText = property.files.map((x) =>
                        x.type == "file"
                            ? this.toUrlText(x.file.url)
                            : x.type == "external"
                            ? this.toUrlText(x.external.url)
                            : ""
                    );
                    result.push({ title: name, value: urlText.join("\n"), short: true });
                    break;
                }
                case "formula": {
                    const foumla = property.formula;
                    switch (foumla.type) {
                        case "boolean":
                            result.push({
                                title: name,
                                value: foumla.boolean ? ":white_check_mark:" : "",
                                short: true,
                            });
                            break;
                        case "date":
                            result.push({
                                title: name,
                                value:
                                    foumla.date != null
                                        ? foumla.date.end == null
                                            ? this.toDateText(foumla.date.start)
                                            : `${this.toDateText(foumla.date.start)}~${this.toDateText(
                                                  foumla.date.end
                                              )}`
                                        : "",
                                short: true,
                            });
                            break;
                        case "string":
                            result.push({ title: name, value: foumla.string ?? "", short: true });
                            break;
                        case "number":
                            result.push({ title: name, value: `${foumla.number}`, short: true });
                            break;
                    }
                    break;
                }
                case "last_edited_by":
                    result.push({
                        title: name,
                        value: "name" in property.last_edited_by ? `@${property.last_edited_by.name}` : "",
                        short: true,
                    });
                    break;
                case "last_edited_time":
                    result.push({ title: name, value: this.toDateText(property.last_edited_time), short: true });
                    break;
                case "multi_select":
                    result.push({
                        title: name,
                        value: property.multi_select.map((x) => x.name).join(", "),
                        short: true,
                    });
                    break;
                case "number":
                    result.push({ title: name, value: `${property.number}`, short: true });
                    break;
                case "people":
                    result.push({
                        title: name,
                        value: property.people.map((x) => ("name" in x ? `@${x.name}` : "")).join(", "),
                        short: true,
                    });
                    break;
                case "phone_number":
                    result.push({ title: name, value: `${property.phone_number}`, short: true });
                    break;
                case "relation":
                    // skip because cannot convert readable text
                    break;
                case "rich_text":
                    result.push({
                        title: name,
                        value: property.rich_text.map((x) => x.plain_text).join("\n"),
                        short: true,
                    });
                    break;
                case "rollup":
                    // unsupports
                    break;
                case "select":
                    result.push({ title: name, value: property.select?.name ?? "", short: true });
                    break;
                case "title":
                    // skip
                    break;
                case "url":
                    result.push({ title: name, value: property.url ? this.toUrlText(property.url) : "", short: true });
                    break;
            }
        }
        if (result.length == 0) {
            return undefined;
        }
        return result;
    }

    private toDateText(date: string): string {
        return `<!date^${Date.parse(date) / 1000}^{date} {time}|${date}>`;
    }

    private toUrlText(url: string): string {
        return `<${url}|${url}>`;
    }
}
