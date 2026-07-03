# Service-area delete needs the undo bar (rescued: O14, pre-canon, schema-verified)
SA hard-delete = config loss + hours orphaning with no undo (jobs/routes/materials CASCADE; hours SET NULL; billed SAs FK-protected). Small fix: wire the existing saveUndoBucket + showUndoBar pattern. Slot: cutover (2.3) — before anyone relies on SA delete.
