import {
    NotificationSenderProvider,
    NotificationSender,
    ConfigSender,
    resolveValue,
} from "notion-db-notification-core";
import { SlackNotificationSender } from "./slack-notification-sender";

interface SlackConfigSender extends ConfigSender {
    token: string;
    api_url: string | undefined;
}

function isSlackConfigSender(sender: ConfigSender): sender is SlackConfigSender {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return "token" in sender && typeof (sender as any).token == "string";
}

export class SlackNotificationSenderProvider implements NotificationSenderProvider {
    tryProvide(configSender: ConfigSender): NotificationSender | null {
        if (configSender.type != "slack") {
            return null;
        }
        if (isSlackConfigSender(configSender)) {
            return new SlackNotificationSender(resolveValue(configSender.token), configSender.api_url);
        }
        throw Error("slack sender must have `token`");
    }
}
