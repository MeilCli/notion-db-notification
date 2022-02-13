import { Store, StoreProvider, ConfigStore } from "notion-db-notification-core";
import { FileStore } from "./file-store";

interface FileConfigStore extends ConfigStore {
    path: string;
}

function isFileConfigStore(store: ConfigStore): store is FileConfigStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return "path" in store && typeof (store as any).path == "string";
}

export class FileStoreProvider implements StoreProvider {
    tryProvide(configStore: ConfigStore): Store | null {
        if (configStore.type != "file") {
            return null;
        }
        if (isFileConfigStore(configStore)) {
            return new FileStore(configStore.path);
        }
        return null;
    }
}
