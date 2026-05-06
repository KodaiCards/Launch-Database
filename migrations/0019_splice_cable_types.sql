-- Phase 2C polish — extend OSP cable enums + configurable tube size.

-- Wider fiber_count menu. The old set was OSP-classic (12/24/48/96/144/
-- 288/432/864). Add 6 (single-tube subscriber drops), 36 / 72 / 216
-- (common in feeder runs), 576 / 1152 / 1728 / 3456 (modern high-density
-- ribbon backbone).
ALTER TABLE splice_cables DROP CONSTRAINT IF EXISTS splice_cables_fiber_count_check;
ALTER TABLE splice_cables ADD CONSTRAINT splice_cables_fiber_count_check
  CHECK (fiber_count IN (
    6, 12, 24, 36, 48, 72, 96, 144, 216, 288, 432, 576, 864, 1152, 1728, 3456
  ));

-- Wider construction_type menu. ribbon and loose_tube were the original
-- two. Add central_tube (single big tube), micromodule (modern bundled
-- subunits), and rollable_ribbon (recent flexible ribbon).
ALTER TABLE splice_cables DROP CONSTRAINT IF EXISTS splice_cables_construction_type_check;
ALTER TABLE splice_cables ADD CONSTRAINT splice_cables_construction_type_check
  CHECK (construction_type IN (
    'ribbon', 'loose_tube', 'central_tube', 'micromodule', 'rollable_ribbon'
  ));

-- Per-cable tube size. 12 is the OSP default; loose-tube cables can
-- have 6 or 24 fibers per tube depending on subunit count. Existing
-- rows default to 12 to preserve current behavior.
ALTER TABLE splice_cables ADD COLUMN IF NOT EXISTS tube_size_fibers INTEGER NOT NULL DEFAULT 12
  CHECK (tube_size_fibers IN (6, 12, 24));

-- splice_fibers.position was CHECK BETWEEN 1 AND 12 (matched the old
-- one-tube-size assumption). Widen to 1..24 so a 24-fiber tube is
-- representable.
ALTER TABLE splice_fibers DROP CONSTRAINT IF EXISTS splice_fibers_position_check;
ALTER TABLE splice_fibers ADD CONSTRAINT splice_fibers_position_check
  CHECK (position BETWEEN 1 AND 24);
