import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { recordKinds } from "../../app-model";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_records",
  title: "List my health records",
  description: "List the signed-in user's own saved records of one kind (cycle, journal, pregnancy, antenatal, postnatal, child, growth), newest first.",
  inputSchema: {
    kind: z.enum(recordKinds).describe("Which kind of record to list."),
    limit: z.number().int().min(1).max(100).default(30).describe("Maximum records to return."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ kind, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not signed in.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("health_records")
      .select("id, kind, record_date, title, details")
      .eq("user_id", ctx.getUserId()!)
      .eq("kind", kind)
      .order("record_date", { ascending: false })
      .limit(limit);
    if (error) throw new ToolError("Could not load your records.");
    const records = (data ?? []).map((r) => ({
      id: String(r.id), kind: String(r.kind), record_date: String(r.record_date), title: String(r.title),
      details: JSON.parse(JSON.stringify(r.details ?? {})) as Record<string, string | number | boolean | null | string[]>,
    }));
    return { content: [{ type: "text", text: JSON.stringify(records) }], structuredContent: { records } };
  },
});
