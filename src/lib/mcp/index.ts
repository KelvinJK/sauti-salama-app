import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listRecords from "./tools/list-records";
import addJournalEntry from "./tools/add-journal-entry";
import listFacilities from "./tools/list-facilities";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "sauti-salama-app",
  title: "Sauti Salama App",
  version: "0.1.0",
  instructions: "Tools for Sauti Salama, a women's and family health information app. Read the signed-in user's own records, add private journal entries, and find verified facilities. Provides information and care navigation only, never diagnosis or treatment.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listRecords, addJournalEntry, listFacilities],
});
