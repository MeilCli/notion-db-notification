#!/usr/bin/env node

import {
    StoreProvider,
    NotificationSenderProvider,
    NotificationChannelProvider,
    NotificationComputerProvider,
} from "notion-db-notification-core";
import { SlackNotificationSenderProvider, SlackNotificationChannelProvider } from "notion-db-notification-sender-slack";
import { FileStoreProvider } from "notion-db-notification-store-file";
import { GitHubStoreProvider } from "notion-db-notification-store-github";
import * as process from "process";

const storeProviders: StoreProvider[] = [new FileStoreProvider(), new GitHubStoreProvider()];
const notificationSenderProviders: NotificationSenderProvider[] = [new SlackNotificationSenderProvider()];
const notificationChannelProviders: NotificationChannelProvider[] = [new SlackNotificationChannelProvider()];

async function main() {
    if (process.argv.length < 3) {
        console.log("must have argument");
        return;
    }
    const [, , configPath] = process.argv;
    const isDryRun = process.argv.includes("-d");
    const isInit = process.argv.includes("-i");
    const notificationComputerProvider = new NotificationComputerProvider(
        storeProviders,
        notificationSenderProviders,
        notificationChannelProviders,
    );
    const notificationComputer = notificationComputerProvider.provide(configPath);
    if (isInit) {
        await notificationComputer.init();
    } else {
        await notificationComputer.run(isDryRun);
    }
}

main();
