export class ApiPoller {
    private lastCallingUnixTime: number | null = null;

    constructor(private readonly pollingIntervalMilliSecconds: number) {}

    async callApi<T>(request: () => Promise<T>): Promise<T> {
        if (this.lastCallingUnixTime == null) {
            const result = await request();
            this.lastCallingUnixTime = this.getCurrentUnixTime();
            return result;
        } else {
            const currentUnixTime = this.getCurrentUnixTime();
            const interval = this.pollingIntervalMilliSecconds - (currentUnixTime - this.lastCallingUnixTime);
            if (0 <= interval) {
                await this.sleep(interval);
            }
            const result = await request();
            this.lastCallingUnixTime = this.getCurrentUnixTime();
            return result;
        }
    }

    private getCurrentUnixTime(): number {
        return new Date().getTime();
    }

    private async sleep(milliSecounds: number): Promise<NodeJS.Timeout> {
        return await new Promise((resolve) => setTimeout(resolve, milliSecounds));
    }
}
