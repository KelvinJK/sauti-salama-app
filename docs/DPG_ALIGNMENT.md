# Digital Public Goods Standard alignment

How Sauti Salama maps to the nine indicators of the
[Digital Public Goods Standard](https://digitalpublicgoods.net/standard/), which UNICEF uses for
open-source projects. Status: ✅ met, 🟡 partly met, ⬜ not yet.

| # | Indicator | Status | Evidence |
|---|---|---|---|
| 1 | Relevance to the SDGs | ✅ | SDG 3 (good health and well-being) and SDG 5 (gender equality): maternal, menstrual and child health information and care navigation for Tanzania |
| 2 | Use of an approved open licence | ✅ | [MIT](../LICENSE) (OSI-approved) |
| 3 | Clear ownership | 🟡 | Copyright holder named in the licence; add the owning organisation and contact once confirmed |
| 4 | Platform independence | ✅ | Open-source stack (Supabase/Postgres, Node.js); runs on Vercel or any Docker host; local development needs no proprietary services |
| 5 | Documentation | ✅ | [README](../README.md), [contributing](../CONTRIBUTING.md), [production checklist](PRODUCTION_CHECKLIST.md), SQL migrations |
| 6 | Mechanism for extracting data and content | ✅ | Users can export all their data as JSON; schema and facility data are in plain SQL migrations |
| 7 | Adherence to privacy and applicable laws | 🟡 | [Data protection](DATA_PROTECTION.md); Tanzania PDPA 2022 review still open |
| 8 | Adherence to standards and best practices | 🟡 | Row-level security, typed validation, automated tests; a formal accessibility (WCAG 2.1 AA) audit is still to do |
| 9 | Do no harm by design | 🟡 | Adults only, no diagnosis, quick exit, urgent-help guidance, consent before sharing referrals; content review by clinicians to be documented |

To apply, submit the project at the [DPG Alliance](https://digitalpublicgoods.net/submission-guide/) once
indicators 3, 7, 8 and 9 are complete.
