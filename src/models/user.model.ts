import { Tables, TablesInsert } from "@models/database.model";

export type User = Tables<"users"> | null;
export type NewUser = TablesInsert<"users">;
