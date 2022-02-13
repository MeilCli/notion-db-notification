import { NotificationChannel } from "notion-db-notification-core";

export class SlackNotificationChannel implements NotificationChannel {
    constructor(public readonly name: string, public readonly slackId: string) {}
}
