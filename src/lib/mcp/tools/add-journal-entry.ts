import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { recordSchema } from "../../app-model";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "add_journal_entry",
  title: "Add a private journal entry",
  description: "Save a private journal entry for the signed-in user. Requires a completed adult profile in the app.",
  inputSchema: {
    record_date: z.string().describe("Date of the entry, YYYY-MM-DD."),
    title: z.string().min(1).max(160).describe("Short title."),
    notes: z.string().max(10000).default("").describe("Entry text."),
    mood: z.string().max(40).optional().describe("Optional mood, e.g. calm, tired, hopeful."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ record_date, title, notes, mood }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not signed in.");
    const parsed = recordSchema.safeParse({ kind: "journal", record_date, title, details: { notes, ...(mood ? { mood } : {}) } });
    if (!parsed.success) throw new ToolError(parsed.error.issues[0]?.message ?? "Invalid entry.");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("health_records")
      .insert({ ...parsed.data, user_id: ctx.getUserId()! })
      .select("id")
      .single();
    if (error) throw new ToolError("Entry not saved. Make sure your adult profile is complete in the app.");
    return { content: [{ type: "text", text: `Saved journal entry ${data.id}.` }], structuredContent: { id: String(data.id) } };
  },
});
