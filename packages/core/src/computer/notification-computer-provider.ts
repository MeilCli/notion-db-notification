import { NotificationComputer } from "./notification-computer";
import { NotionClient, ApiPoller } from "../client";
import { ConfigParser, resolveValue } from "../config";
import { Store, StoreProvider } from "../store";
import { NotificationSender, NotificationSenderProvider } from "../sender";
import { NotificationChannel, NotificationChannelProvider } from "../channel";

const defaultInterval = 1000;

export class NotificationComputerProvider {
    constructor(
        private readonly storeProviders: StoreProvider[],
        private readonly notificationSenderProviders: NotificationSenderProvider[],
        private readonly notificationChannelProviders: NotificationChannelProvider[]
    ) {}

    provide(configPath: string): NotificationComputer {
        const config = new ConfigParser().parseFromFile(configPath);

        const apiPoller = new ApiPoller(config.notion.interval ?? defaultInterval);
        const client = new NotionClient(apiPoller, resolveValue(config.notion.token));

        let store: Store | null = null;
        for (const storeProvider of this.storeProviders) {
            store = storeProvider.tryProvide(config.store);
            if (store != null) {
                break;
            }
        }
        if (store == null) {
            throw Error("unknown store");
        }

        const notificationSenders: NotificationSender[] = [];
        for (const configSender of config.senders) {
            for (const nofiticationSenderProvider of this.notificationSenderProviders) {
                const notificationSender = nofiticationSenderProvider.tryProvide(configSender);
                if (notificationSender != null) {
                    notificationSenders.push(notificationSender);
                }
            }
        }

        const notificationChannels: NotificationChannel[] = [];
        for (const configChannel of config.channels) {
            for (const notificationChannelProvider of this.notificationChannelProviders) {
                const notificationChannel = notificationChannelProvider.tryProvide(configChannel);
                if (notificationChannel != null) {
                    notificationChannels.push(notificationChannel);
                }
            }
        }

        return new NotificationComputer(client, store, notificationSenders, notificationChannels, config.sources);
    }
}
