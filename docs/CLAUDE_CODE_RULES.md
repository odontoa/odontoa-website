# Odontoa — Claude Code Rules (Repo Playbook)

This file is the single source of truth for how we work in this repository.  
Claude Code (and any AI agent) must read and follow these rules before making changes.

## 1) Git workflow (two macOS users, same GitHub account)

- Repo: `odontoa/odontoa-website`
- Never commit directly to `main`. Always use a feature branch.
- Current handoff branch: `ognjen/wip-hero`

### Standard pull on the other macOS user
```bash
cd ~/Dev/odontoa-website-new-2026
git fetch
git checkout ognjen/wip-hero
git pull --rebase
git status
git branch --show-current
```

## 2) Project cleanup decisions (final)

Decision: Sanity Studio only

No custom /admin-panel

No Supabase, no Strapi (no related env vars, migrations, scripts, backups, or auth contexts)

Validation routes (dev):

http://localhost:3003/

http://localhost:3003/blogovi

http://localhost:3003/recnik

http://localhost:3003/studio

## 3) UI Lab sandbox (inside marketing website repo)

Goal: An isolated "app UI sandbox" inside the website repo to redesign UI without touching the real app.

Base route: /ui-lab

Contains mock dashboard + components gallery

Folder: src/ui-lab/**

Any referenced external folder like odontoa-frontend-main/ is only a local reference and must stay in .gitignore.

## 4) V2 Moodify dashboard (Figma → MCP precision)

V2 dashboard route: /ui-lab/figma-dashboard

We use route groups to keep V1 and V2 isolated:

src/app/(v1)/ui-lab/* (legacy UI lab)

src/app/(v2)/ui-lab/figma-dashboard/* (Moodify V2)

## 5) Tokens and styling rules (important)

We use a two-layer token system so future color changes are a swap, not a rewrite:

--moodify-* = raw palette

--v2-* = semantic tokens

Rules:

V2 components must use only var(--v2-*) (never use --moodify-* directly in components).

Keep Tailwind usage consistent with existing patterns in V2.

Urbanist font is enabled in the V2 layout via Next fonts.

## 6) Pixel-pass approach

If the layout does not match Figma, iterate section-by-section using precise nodes/measurements (MCP links if needed).
We already corrected:

Sidebar density (was too wide/bulky)

Chip row (avoid wrapping on 13")

Grid proportions by row (match Moodify):

Row1 ~ 65/35

Row2 50/50

Row3 50/25/25 (Gender largest)

Row4 ~ 76/24 (table dominates)

## 7) Figma MCP notes (Claude CLI)

If MCP is used:

Correct config file is ~/.claude.json (not ~/.claude/settings.json)

Ensure correct transport (avoid wrong sse/http mismatch)

Figma MCP requires OAuth (PAT header alone is not enough)

MCP can read full layer/style data only when the Figma file is editable

## 8) Editing principles

Prefer minimal diffs.

Don't introduce new design tokens unless explicitly requested.

Don't refactor unrelated code while fixing a UI mismatch.

Keep existing chart behavior/styling unless the task requires changes.

## 9) "When you start a task" checklist for Claude Code

Before editing:

Identify the exact file(s) responsible for the UI.

Explain plan briefly.

Make the smallest change that achieves the acceptance criteria.

Confirm responsiveness (desktop + mobile).

Summarize changes.

## 10) Current status

All changes live on: ognjen/wip-hero

Last known commit: 323c05b7 — chore: v2 dashboard layout re-balance (grid + chips + sidebar density)

Working tree should be clean after pulling.
