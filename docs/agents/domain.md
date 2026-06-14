# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repo root.
- Relevant accepted ADRs in `docs/adr/`.
- `CONTEXT-MAP.md` if it is ever added later.

If a referenced file does not exist, proceed silently.

## File structure

This is currently a single-context repo:

```text
/
|-- CONTEXT.md
|-- docs/adr/
|-- tracks/
`-- templates/
```

## Use the glossary vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If a concept is missing, either reconsider the term or note it as a glossary gap.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it.
