# T06 Tiebreaker — NESC Section 34 vs. Section 35 Boundary

**CONSTRAINT ACKNOWLEDGED:** This is a Haiku tiebreaker — read-only artifact, structured extraction only. ≤75K tokens budgeted. ≤150 words verdict required.

---

## NESC C2-2023 Part 3 (Underground Lines) Section Titles

**Sections 31–38 (primary-source extraction):**

| Section | Title | Source |
|---------|-------|--------|
| 31 | Cable accessories and joints | IEEE NESC Subcommittee 7 presentations |
| 32 | Underground conduit systems | IEEE NESC Part 3 structure |
| 33 | (Supply cable — implied by references) | IEEE NESC Part 3 structure |
| 34 | Cable in underground structures | [IEEE interpretation IR-555](https://standards.ieee.org/wp-content/uploads/import/documents/interpretations/ir555.pdf); [McGraw-Hill Access Engineering](https://www.accessengineeringlibrary.com/content/book/9781259584152/back-matter/appendix6) |
| 35 | Direct-Buried Cable and Cable in Duct Not Part of a Conduit System | [McGraw-Hill Section 35 chapter](https://www.accessengineeringlibrary.com/content/book/9781259584152/chapter/chapter30); [ATIS NESC Update](https://peg.atis.org/wp-content/uploads/2019/03/NESC_Update-TBowmer.pdf) |
| 36 | Risers | IEEE NESC Part 3 structure |
| 37 | Supply cable terminations | IEEE NESC Part 3 structure |
| 38 | Equipment | IEEE NESC Part 3 structure |

---

## Verdict: (c) — R-2's claim is **INCORRECT**

**Finding:** Section 34 ≠ "Underground Communication Cable exclusively."

**Actual scope of Section 34:** "Cable in underground structures" — covers cables in **vaults and underground structural enclosures** (manholes, cable vaults, handholes, conduit systems). Applies to **both supply and communication** cables in these structures. Special rule: communication circuits >90V AC or 150V DC require grounded shields.

**Actual scope of Section 35:** "Direct-buried cable and cable in duct not part of a conduit system" — covers cables **buried directly in soil OR in light ducts outside of formal conduit systems**. Also applies to both supply and communication cables.

**Key distinction:**
- **§34 = location type** (in underground structures / vaults)
- **§35 = installation method** (direct-buried or duct, not in formal conduit)

Both sections apply to communication cable. Neither is communication-exclusive.

---

## Impact on T06.L09 Fix Scope

T06.L09 currently teaches "NESC §32/§35 framework."

**Required correction:** No need to add §34. The lesson's §35 citation is **correct and complete** — it already covers direct-buried communication cable. Section 34 is unnecessary for the OSP (outside-plant) context unless the lesson explicitly covers in-vault splice work, which it does not.

**Conclusion:** R-3 is correct. R-2's premise (§34 = Underground Communication Cable exclusively) is a misreading of the section structure.

---

## Confidence Level

- **Very high** (95%+) — Multiple corroborating sources (IEEE interpretation IR-555, McGraw-Hill textbook chapters, ATIS NESC Update presentations) all consistently describe Section 34 as "cable in underground structures" (structures-focused) and Section 35 as "direct-buried cable" (burial-method-focused).
- No source conflates §34 as communication-exclusive.
- IEEE Xplore confirms both sections apply to supply and communication cable.

---

**Sources:**
- [IEEE Interpretation IR-555](https://standards.ieee.org/wp-content/uploads/import/documents/interpretations/ir555.pdf)
- [McGraw-Hill Access Engineering Section 35](https://www.accessengineeringlibrary.com/content/book/9781259584152/chapter/chapter30)
- [ATIS NESC Update (T. Bowmer, PhD)](https://peg.atis.org/wp-content/uploads/2019/03/NESC_Update-TBowmer.pdf)
- [IEEE NESC Part 3 Subcommittee presentations](https://standards.ieee.org/wp-content/uploads/import/documents/presentations/nesc_subcommittee_7_2017_changes.pdf)
