import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { SHOW_EXAMPLE_FACILITIES } from "../../feature-flags";

export default defineTool({
  name: "list_facilities",
  title: "Find verified care facilities",
  description: "List verified health facilities, optionally filtered by district and a service such as maternity or antenatal.",
  inputSchema: {
    district: z.string().max(80).optional().describe("District name to filter by."),
    service: z.string().max(40).optional().describe("Service key, e.g. maternity, antenatal, family_planning, child_health."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ district, service }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not signed in.");
    let q = supabaseForUser(ctx).from("facilities").select("id, name, district, region, address, phone, services").eq("verified", true).limit(100);
    if (!SHOW_EXAMPLE_FACILITIES) q = q.eq("is_example", false);
    if (district) q = q.ilike("district", district);
    if (service) q = q.contains("services", [service]);
    const { data, error } = await q;
    if (error) throw new ToolError("Could not load facilities.");
    const facilities = (data ?? []).map((f) => ({
      id: String(f.id), name: String(f.name), district: String(f.district ?? ""), region: String(f.region ?? ""),
      address: String(f.address ?? ""), phone: String(f.phone ?? ""), services: (f.services ?? []).map(String),
    }));
    return { content: [{ type: "text", text: facilities.length ? JSON.stringify(facilities) : "No verified facilities match yet." }], structuredContent: { facilities } };
  },
});
