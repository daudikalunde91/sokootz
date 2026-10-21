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
- All backend access goes through `src/lib/api` (client + services) — keeps web and future mobile app on one contract.
- Never show fake listings or fake success; unbuilt features are labeled Planned/Coming soon.
- Colors only via tokens in `src/styles.css`.
- AI assistant streams via server route src/routes/api/assistant.ts (Lovable AI Gateway); no listing data until the Django API exists.
- Shared account forms enforce deferred access before submission; this prevents credentials being sent while authentication is not available.
- The assistant uses an internally scrolling message list and a viewport-height mobile layout so streaming never scrolls the entire page away from the input.
