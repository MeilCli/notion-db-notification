import { NotificationEvent } from "./notification-event";
import { DatabaseProperty } from "./database-property";

export interface Notification {
    title: string;
    url: string;
    properties: Map<string, DatabaseProperty>;
    event: NotificationEvent;
}
