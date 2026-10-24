<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the public website separate from the nested /app shell, so guest education and adult personal tools share navigation without changing public URLs.
- Private app mutations use authenticated server functions and owner-scoped RLS; adult profile registration and consent are required by storage policies.
- Keep roles in a read-only-to-users role table; signup assigns only the user role and never reads privileges from editable metadata.
- Use a shared typed record validator for personal logs and owner-linked growth measurements; never report saves before storage confirms them.
- Device-only records use an IndexedDB AES-GCM vault with a PBKDF2-derived, memory-only key; a shared provider owns locking across app navigation so plaintext never enters persistent browser storage.
- Mood check-ins are journal records with a stable reserved title, sharing the existing authenticated record boundary and encrypted guest storage without adding another private-data path.
