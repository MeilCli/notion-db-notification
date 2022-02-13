import { Client } from "@notionhq/client";

type DataBaseQueryResponse = ReturnType<Client["databases"]["query"]> extends Promise<infer T> ? T : never;
export type DatabasePage = Extract<DataBaseQueryResponse["results"][number], { last_edited_time: string }>;
