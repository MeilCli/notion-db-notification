export interface Config {
    scheme: string;
    notion: ConfigNotion;
    store: ConfigStore;
    senders: ConfigSender[];
    channels: ConfigChannel[];
    sources: ConfigSource[];
}

export interface ConfigNotion {
    token: string;
    interval: number | null;
}

export interface ConfigStore {
    type: string;
}

export interface ConfigSender {
    type: string;
}

export interface ConfigChannel {
    name: string;
}

export interface ConfigSource {
    database: string;
    channel: string;
    filter: string | null;
}
