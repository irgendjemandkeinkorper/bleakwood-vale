# Codex action plan — bleakwood-vale (art maintenance)

Written 2026-10-02 by Claude (Fable 5.1) as architect. Executor: Codex CLI on **Sol 6.1** (pick it in the model picker). Nobody monitors sessions live. Every milestone ends in a PR for review.

## Read first

1. `CONTRIBUTING.md` (the `window` bridge, `esc()` escaping, art script order, tagging). There is no `AGENTS.md` yet.
2. `README.md`, sections "Status" and "License".
3. `art/IMAGE_PROMPTS.md`, `scripts/gen-prompts.mjs`, `scripts/gen-manifest.mjs`, `generate.py`, `scripts/convert-to-jpeg.py`.
4. Issues #35, #32, #41.

## Goal

Maintenance of the 2D art pipeline only. **No 3D, no Meshy, no new art generated.** Budget: about one session.

## Status on 2026-10-02 (verify before relying on it)

- Static web/JS card game with Firebase/Firestore. A gothic murder-mystery re-skin of *Tall Pines*. Hotseat and online play both work.
- On `main`, clean. Last meaningful commit 2026-08-12.
- 364 images in `art/images/{painterly,tarot}/…`, all generated with Gemini; the vault records 200/200 complete.
- `art/images/backup-pre-paired-cards-2026-08-03/` is retired art still in the shipped tree.
- `art/IMAGE_PROMPTS.md` still has "Blackwood" in its header.
- No roadmap in the repo. The README points to a plan outside it: `~/.claude/plans/flickering-dreaming-puppy.md`.
- CI runs a smoke test and a type check. No art or manifest check runs.
- `generate.py` writes image URLs back into `../bleakwood-vault`, and `gen-manifest` overwrites them.
- 20 open issues; 12 are delegated to Jules.
- Rights to the base game are unresolved.

## Decisions

| Decision | Answer | Source |
|---|---|---|
| Scope | Maintenance only. No 3D, no new art | Owner |
| Git | Commit, push, open PR; never merge | Owner |
| Art issues to take | #35, #32, #41. Not #19 (ambient loops) | Owner |
| Backup art folder | Move it out of the shipped tree | Owner |
| Bring the roadmap into the repo | Yes | Owner |

## Milestones

**B0 — `AGENTS.md`.** Add one that points to `CONTRIBUTING.md` and this plan. No new rules. Before starting B1–B3, check each issue is not already assigned to Jules; skip any that is and say so.

**B1 — #35: stale-prompt check in CI.** Fail the build when `art/IMAGE_PROMPTS.md` or the manifest is out of date with the data. Fix the "Blackwood" header in the generator, not by hand in the output.

**B2 — #32: `generate.py` error handling.** Do not call the image API to test it; mock it.

**B3 — #41: document `scripts/convert-to-jpeg.py`.**

**B4 — Backup folder.** Move `art/images/backup-pre-paired-cards-2026-08-03/` out of what the site ships. Confirm nothing references it first.

**B5 — Roadmap in the repo.** Read `~/.claude/plans/flickering-dreaming-puppy.md`. Copy it into `docs/` only after checking it holds nothing private or unrelated to this project; if unsure, stop and ask. Update the README link.

## Rules

1. Branch `codex/<topic>`; commit, push, open a PR. Never merge, never force-push, never change issue labels, milestones or assignees.
2. Do not take issues labelled for Jules.
3. Do not run `generate.py` against the real API, and do not run anything that writes into `../bleakwood-vault`.
4. Follow `CONTRIBUTING.md` for the `window` bridge and `esc()` escaping.
5. Do not decide art direction or scope. Never commit `.env` or any credential.

## Verification

- `python3 scripts/smoke.py`
- The type-check workflow's command, run locally.
- The new B1 check, shown failing on a deliberately stale file and passing on a fresh one.

## Stop and ask

- A change would alter what the live site shows.
- The external plan file contains anything that should not be in a repo.

## Handoff

In each PR body: what changed, changed files, checks run with results, risks, open questions.
