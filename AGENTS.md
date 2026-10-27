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

## SokoTZ rules
- Product docs live in `docs/`; read them before changing features (docs/AGENTS.source.md is the original agent guide).
- The shared backend is the Android app's Firebase project and named Firestore DB (docs/FIREBASE_SETUP.md); never use the "(default)" DB or add a second data store, because Android reads the same documents.
- All data access goes through `src/lib/api` (services + mappers); Firestore field names/enums follow Android `MarketplaceModels.kt` so both clients stay compatible.
- Writes are built by `src/lib/api/mappers.ts` from the Auth UID and never send privileged fields; firestore.rules (Android repo, mirrored in `firebase/firestore.rules`) is the enforcement, so rule changes need emulator tests in `tests/rules`.
- Public views show only PUBLISHED listings; the Assistant receives only those, retrieved per question in the browser.
- Never show fake listings, ratings or success; unbuilt features are labeled Planned/Coming soon.
- Colors only via tokens in `src/styles.css`.
- AI assistant streams via server route src/routes/api/assistant.ts (Lovable AI Gateway); AI credentials never reach browser code.
- The assistant uses an internally scrolling message list and a viewport-height mobile layout so streaming never scrolls the entire page away from the input.
