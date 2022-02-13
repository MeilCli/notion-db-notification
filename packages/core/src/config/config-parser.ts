import * as yaml from "js-yaml";
import * as fs from "fs";
import { Config, ConfigNotion, ConfigStore, ConfigSender, ConfigChannel, ConfigSource } from "./config";

interface YamlRoot {
    scheme: string | undefined;
    notion: YamlNotion | undefined;
    store: YamlStore | undefined;
    senders: YamlSender[] | undefined;
    channels: YamlChannel[] | undefined;
    sources: YamlSource[] | undefined;
}

interface YamlNotion {
    token: string | undefined;
    interval: number | undefined;
}

interface YamlStore {
    type: string | undefined;
}

interface YamlSender {
    type: string | undefined;
}

interface YamlChannel {
    name: string | undefined;
}

interface YamlSource {
    database: string | undefined;
    channel: string | undefined;
    filter: string | undefined;
}

export class ConfigParser {
    parseFromFile(configPath: string): Config {
        return this.parseFromText(fs.readFileSync(configPath).toString());
    }

    parseFromText(text: string): Config {
        const root = yaml.load(text) as YamlRoot;

        if (root.scheme == undefined) {
            throw Error("config of `scheme` is undefined");
        }
        const scheme = root.scheme;

        if (root.notion == undefined) {
            throw Error("config of `notion` is undefined");
        }
        const notion: ConfigNotion = this.parseNotion(root.notion);

        if (root.store == undefined) {
            throw Error("config of `store` is undefined");
        }
        const store: ConfigStore = this.parseStore(root.store);

        if (root.senders == undefined) {
            throw Error("config of `senders` is undefined");
        }
        const senders: ConfigSender[] = [];
        for (const sender of root.senders) {
            senders.push(this.parseSender(sender));
        }

        if (root.channels == undefined) {
            throw Error("config of `channels` is undefined");
        }
        const channels: ConfigChannel[] = [];
        for (const channel of root.channels) {
            channels.push(this.parseChannel(channel));
        }

        if (root.sources == undefined) {
            throw Error("config of `sources` is undefined");
        }
        const sources: ConfigSource[] = [];
        for (const source of root.sources) {
            sources.push(this.parceSource(source));
        }

        return {
            scheme: scheme,
            notion: notion,
            store: store,
            senders: senders,
            channels: channels,
            sources: sources,
        };
    }

    private parseNotion(notion: YamlNotion): ConfigNotion {
        if (notion.token == undefined) {
            throw Error("config of `notion.token` is undefined");
        }
        return {
            token: notion.token,
            interval: notion.interval ?? 1000,
        };
    }

    private parseStore(store: YamlStore): ConfigStore {
        if (store.type == undefined) {
            throw Error("config of `store.type` is undefined");
        }
        return store as ConfigStore;
    }

    private parseSender(sender: YamlSender): ConfigSender {
        if (sender.type == undefined) {
            throw Error("config of `sender.type` is undefined");
        }
        return sender as ConfigSender;
    }

    private parseChannel(channel: YamlChannel): ConfigChannel {
        if (channel.name == undefined) {
            throw Error("config of `channel.channel` is undefined");
        }
        return channel as ConfigChannel;
    }

    private parceSource(source: YamlSource): ConfigSource {
        if (source.database == undefined) {
            throw Error("config of `source.database` is undefined");
        }
        if (source.channel == undefined) {
            throw Error("config of `source.channel` is undefined");
        }
        return {
            database: source.database,
            channel: source.channel,
            filter: source.filter ?? null,
        };
    }
}
