import { createAppAuth } from "@octokit/auth-app";

export interface GitHubAuth {
    getToken(): Promise<string>;
}

export class GitHubAuthByPat implements GitHubAuth {
    constructor(private readonly token: string) {}

    getToken(): Promise<string> {
        return Promise.resolve(this.token);
    }
}

export class GitHubAuthByApp implements GitHubAuth {
    constructor(
        private readonly applicationId: number,
        private readonly installationId: number,
        private readonly privateKey: string,
    ) {}

    async getToken(): Promise<string> {
        const appAuth = createAppAuth({ appId: this.applicationId, privateKey: this.privateKey });
        const result = await appAuth({ type: "installation", installationId: this.installationId });
        return result.token;
    }
}
