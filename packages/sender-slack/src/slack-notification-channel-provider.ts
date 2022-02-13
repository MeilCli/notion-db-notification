import { NotificationChannelProvider, NotificationChannel, ConfigChannel } from "notion-db-notification-core";
import { SlackNotificationChannel } from "./slack-notification-channel";

interface SlackConfigChannel extends ConfigChannel {
    slack_id: string;
}

function isSlackConfigChannel(channel: ConfigChannel): channel is SlackConfigChannel {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return "slack_id" in channel && typeof (channel as any).slack_id == "string";
}

export class SlackNotificationChannelProvider implements NotificationChannelProvider {
    tryProvide(configChannel: ConfigChannel): NotificationChannel | null {
        if (isSlackConfigChannel(configChannel)) {
            return new SlackNotificationChannel(configChannel.name, configChannel.slack_id);
        }
        return null;
    }
}
