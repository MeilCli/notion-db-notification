#!/usr/bin/env node

import {
    StoreProvider,
    NotificationSenderProvider,
    NotificationChannelProvider,
    NotificationComputerProvider,
} from "notion-db-notification-core";
import { SlackNotificationSenderProvider, SlackNotificationChannelProvider } from "notion-db-notification-sender-slack";
import { FileStoreProvider } from "notion-db-notification-store-file";
import * as process from "process";

const storeProviders: StoreProvider[] = [new FileStoreProvider()];
const notificationSenderProviders: NotificationSenderProvider[] = [new SlackNotificationSenderProvider()];
const notificationChannelProviders: NotificationChannelProvider[] = [new SlackNotificationChannelProvider()];

async function main() {
    if (process.argv.length < 3) {
        console.log("must have argument");
        return;
    }
    const [, , configPath] = process.argv;
    const isDryRun = process.argv.includes("-d");
    const notificationComputerProvider = new NotificationComputerProvider(
        storeProviders,
        notificationSenderProviders,
        notificationChannelProviders
    );
    const notificationComputer = notificationComputerProvider.provide(configPath);
    await notificationComputer.run(isDryRun);
}

main();
