import { Store } from "./store";
import { ConfigStore } from "../config";

export interface StoreProvider {
    tryProvide: (configStore: ConfigStore) => Store | null;
}
