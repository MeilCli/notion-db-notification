import { ConfigSender } from "../config";
import { NotificationSender } from "./notification-sender";

export interface NotificationSenderProvider {
    tryProvide(configSender: ConfigSender): NotificationSender | null;
}
