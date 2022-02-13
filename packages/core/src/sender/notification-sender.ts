import { Notification } from "../type";
import { NotificationChannel } from "../channel";

export interface NotificationSender {
    hasChannel(channel: NotificationChannel): boolean;
    send: (channel: NotificationChannel, notification: Notification) => Promise<void>;
}
