import { SlackNotificationSender } from "../src/slack-notification-sender";
import { SlackNotificationSenderProvider } from "../src/slack-notification-sender-provider";
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

test("testNotInclude", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testInclude);
    const provider = new SlackNotificationSenderProvider();
    const senders = config.senders.map((x) => provider.tryProvide(x));

    expect(senders.length).toBe(1);
    expect(senders[0]).toBeInstanceOf(SlackNotificationSender);
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
  - type: 'unknown'
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
    const config = parser.parseFromText(testNotInclude);
    const provider = new SlackNotificationSenderProvider();
    const senders = config.senders.map((x) => provider.tryProvide(x));

    expect(senders.length).toBe(1);
    expect(senders[0]).toBeNull();
});
