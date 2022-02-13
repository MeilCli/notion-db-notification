import { FileStoreProvider } from "../src/file-store-provider";
import { FileStore } from "../src/file-store";
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
    const provider = new FileStoreProvider();
    const store = provider.tryProvide(config.store);

    expect(store).toBeInstanceOf(FileStore);
});

const testNotInclude = `
scheme: 'v0'
notion:
  token: 'notion_token'
  interval: 500
store:
  type: 'unknown'
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
    const config = parser.parseFromText(testNotInclude);
    const provider = new FileStoreProvider();
    const store = provider.tryProvide(config.store);

    expect(store).toBeNull();
});
