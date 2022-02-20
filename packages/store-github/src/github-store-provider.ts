import { Store, StoreProvider, ConfigStore, resolveValue } from "notion-db-notification-core";
import { GitHubStore } from "./github-store";
import { GitHubAuthByPat, GitHubAuthByApp } from "./github-auth";

interface GitHubConfigStore extends ConfigStore {
    path: string;
    owner: string;
    repository: string;
}

interface GitHubPatConfigStore extends GitHubConfigStore {
    token: string;
}

interface GitHubAppConfigStore extends GitHubConfigStore {
    applicationId: number;
    privateKey: string;
    installationId: number;
}

function isGitHubConfigStore(store: ConfigStore): store is GitHubConfigStore {
    return (
        "path" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).path == "string" &&
        "owner" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).owner == "string" &&
        "repository" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).repository == "string"
    );
}

function isGitHubPatConfigStore(store: GitHubConfigStore): store is GitHubPatConfigStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return "token" in store && typeof (store as any).token == "string";
}

function isGitHubAppConfigStore(store: GitHubConfigStore): store is GitHubAppConfigStore {
    return (
        "applicationId" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).applicationId == "number" &&
        "privateKey" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).privateKey == "string" &&
        "installationId" in store &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (store as any).installationId == "number"
    );
}

export class GitHubStoreProvider implements StoreProvider {
    tryProvide(configStore: ConfigStore): Store | null {
        if (configStore.type != "github") {
            return null;
        }
        if (isGitHubConfigStore(configStore)) {
            if (isGitHubPatConfigStore(configStore)) {
                return new GitHubStore(
                    configStore.path,
                    configStore.owner,
                    configStore.repository,
                    new GitHubAuthByPat(resolveValue(configStore.token))
                );
            }
            if (isGitHubAppConfigStore(configStore)) {
                return new GitHubStore(
                    configStore.path,
                    configStore.owner,
                    configStore.repository,
                    new GitHubAuthByApp(
                        configStore.applicationId,
                        configStore.installationId,
                        resolveValue(configStore.privateKey)
                    )
                );
            }
        }
        return null;
    }
}
