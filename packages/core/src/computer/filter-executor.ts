import * as vm from "vm";
import { NotificationEvent, DatabasePage } from "../type";

interface FilterContext {
    event: NotificationEvent;
    page: DatabasePage;
}

export class FilterExecutor {
    execute(event: NotificationEvent, page: DatabasePage, filter: string): boolean {
        const script = new vm.Script(filter);
        const context: FilterContext = {
            event,
            page,
        };
        const result = script.runInNewContext(context);
        if (typeof result == "boolean") {
            return result;
        }
        throw Error(`filter must be return boolean. found: ${result}`);
    }
}
