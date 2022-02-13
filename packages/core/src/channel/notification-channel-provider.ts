import { ConfigChannel } from "../config";
import { NotificationChannel } from "./notification-channel";

export interface NotificationChannelProvider {
    tryProvide: (configChannel: ConfigChannel) => NotificationChannel | null;
}
