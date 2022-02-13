export function resolveValue(value: string): string {
    if (value.startsWith("env:")) {
        const environmentVariableName = value.substring(4);
        const environmentVariable = process.env[environmentVariableName];
        return environmentVariable ?? "";
    }
    return value;
}
