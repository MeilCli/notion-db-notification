import { DatabasePage } from "../../src/type";
import { FilterExecutor } from "../../src/computer/filter-executor";

const testPage: DatabasePage = {
    parent: { type: "database_id", database_id: "database_id" },
    icon: { type: "external", external: { url: "url" } },
    last_edited_time: "edite_time",
    last_edited_by: {
        id: "last_edited_by_user",
        object: "user",
    },
    created_time: "create_time",
    created_by: {
        id: "created_by_user",
        object: "user",
    },
    cover: { type: "external", external: { url: "url" } },
    url: "url",
    archived: false,
    object: "page",
    properties: {},
    id: "id",
};

test("testLastEvalated", () => {
    const executor = new FilterExecutor();
    expect(executor.execute("Created", testPage, `event == "Created"`)).toBe(true);
    expect(executor.execute("Updated", testPage, `event == "Created"`)).toBe(false);
});

test("testMultiLineLastEvalated", () => {
    const executor = new FilterExecutor();
    expect(executor.execute("Created", testPage, `const e = event;\n e == "Created"`)).toBe(true);
    expect(executor.execute("Updated", testPage, `const e = event;\n e == "Created"`)).toBe(false);
});
