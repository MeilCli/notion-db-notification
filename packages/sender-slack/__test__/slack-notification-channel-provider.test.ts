import { SlackNotificationChannelProvider } from "../src/slack-notification-channel-provider";
import { SlackNotificationChannel } from "../src/slack-notification-channel";
import { ConfigParser } from "notion-db-notification-core";

const testInclude = `
scheme: 'v0'
notion:
  token: 'notion_token'
  interval: 500
store:
  type: 'file'
  path: 'path'
senders:
  - type: 'slack'
    token: 'slack_token'
channels:
  - name: 'name'
    slack_id: 'slack_id'
sources:
  - database: 'database_id'
    channel: 'channel_name'
    filter: 'filter text'`;

test("testInclude", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testInclude);
    const provider = new SlackNotificationChannelProvider();
    const channels = config.channels.map((x) => provider.tryProvide(x));

    expect(channels.length).toBe(1);
    expect(channels[0]).toBeInstanceOf(SlackNotificationChannel);
});

const testNotInclude = `
scheme: 'v0'
notion:
  token: 'notion_token'
  interval: 500
store:
  type: 'file'
  path: 'path'
senders:
  - type: 'slack'
    token: 'slack_token'
channels:
  - name: 'name'
sources:
  - database: 'database_id'
    channel: 'channel_name'
    filter: 'filter text'`;

test("testNotInclude", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testNotInclude);
    const provider = new SlackNotificationChannelProvider();
    const channels = config.channels.map((x) => provider.tryProvide(x));

    expect(channels.length).toBe(1);
    expect(channels[0]).toBeNull();
});
