import { ConfigParser } from "../../src/config/config-parser";

const testSimple = `
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

test("testSimple", () => {
    const parser = new ConfigParser();
    const config = parser.parseFromText(testSimple);

    expect(config.scheme).toBe("v0");

    expect(config.notion.token).toBe("notion_token");
    expect(config.notion.interval).toBe(500);

    expect(config.store).toMatchObject({ type: "file", path: "path" });

    expect(config.senders.length).toBe(1);
    expect(config.senders[0]).toMatchObject({ type: "slack", token: "slack_token" });

    expect(config.channels.length).toBe(1);
    expect(config.channels[0]).toMatchObject({ name: "name", slack_id: "slack_id" });

    expect(config.sources.length).toBe(1);
    expect(config.sources[0].database).toBe("database_id");
    expect(config.sources[0].channel).toBe("channel_name");
    expect(config.sources[0].filter).toBe("filter text");
});
