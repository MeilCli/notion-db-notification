import { GitHubStoreProvider } from "../src/github-store-provider";
import { GitHubStore } from "../src/github-store";
import { ConfigParser } from "notion-db-notification-core";

const testPatInclude = `
scheme: 'v0'
notion:
  token: 'notion_token'
  interval: 500
store:
  type: 'github'
  path: 'path'
  owner: 'MeilCli'
  repository: 'notion-db-notification'
  token: 'token'
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

test("testPatInclude", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testPatInclude);
    const provider = new GitHubStoreProvider();
    const store = provider.tryProvide(config.store);

    expect(store).toBeInstanceOf(GitHubStore);
});

const testAppInclude = `
scheme: 'v0'
notion:
  token: 'notion_token'
  interval: 500
store:
  type: 'github'
  path: 'path'
  owner: 'MeilCli'
  repository: 'notion-db-notification'
  applicationId: 1
  privateKey: 'privateKey'
  installationId: 1
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

test("testAppInclude", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testAppInclude);
    const provider = new GitHubStoreProvider();
    const store = provider.tryProvide(config.store);

    expect(store).toBeInstanceOf(GitHubStore);
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
    const provider = new GitHubStoreProvider();
    const store = provider.tryProvide(config.store);

    expect(store).toBeNull();
});
