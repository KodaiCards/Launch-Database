// test/week_window.test.js
// Unit tests for the Monday-start week-window date math used in
//   GET /api/my/hours  (routes/my_work.js)
//
// The production code:
//   const now = new Date();
//   const dow = (now.getDay() + 6) % 7;   // 0 = Monday … 6 = Sunday
//   const monday = new Date(now);
//   monday.setDate(now.getDate() - dow);
//   monday.setHours(0, 0, 0, 0);
//   const nextMonday = new Date(monday);
//   nextMonday.setDate(monday.getDate() + 7);
//
// We replicate the pure date math here and drive it with fixed "now" values so
// tests don't depend on the system clock.  No DB / no deps — runs with:
//   node --test test/

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of the week-window logic from routes/my_work.js ---
function weekWindow(now) {
  const dow = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const iso = d => d.toISOString().slice(0, 10);
  return { week_start: iso(monday), week_end: iso(nextMonday), dow };
}

// Helper: build a UTC Date from a date string so tests aren't timezone-skewed.
// We do local midnight (same behaviour as the production setHours(0,0,0,0)).
function localDate(yyyy, mm, dd) {
  return new Date(yyyy, mm - 1, dd, 12, 0, 0); // noon to avoid DST edge cases
}

// --- Tests ---

describe('(now.getDay() + 6) % 7  — Monday-index formula for all 7 weekdays', () => {
  // JS getDay(): 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  // Expected dow:  6    0    1    2    3    4    5
  const cases = [
    { name: 'Monday',    jsDay: 1, expected: 0 },
    { name: 'Tuesday',   jsDay: 2, expected: 1 },
    { name: 'Wednesday', jsDay: 3, expected: 2 },
    { name: 'Thursday',  jsDay: 4, expected: 3 },
    { name: 'Friday',    jsDay: 5, expected: 4 },
    { name: 'Saturday',  jsDay: 6, expected: 5 },
    { name: 'Sunday',    jsDay: 0, expected: 6 },
  ];
  for (const { name, jsDay, expected } of cases) {
    it(`${name} (getDay=${jsDay}) → dow ${expected}`, () => {
      assert.equal((jsDay + 6) % 7, expected);
    });
  }
});

describe('weekWindow — week_start is always the preceding (or same) Monday', () => {
  it('Monday 2024-06-17: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 17));
    assert.equal(week_start, '2024-06-17');
  });

  it('Tuesday 2024-06-18: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 18));
    assert.equal(week_start, '2024-06-17');
  });

  it('Wednesday 2024-06-19: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 19));
    assert.equal(week_start, '2024-06-17');
  });

  it('Thursday 2024-06-20: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 20));
    assert.equal(week_start, '2024-06-17');
  });

  it('Friday 2024-06-21: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 21));
    assert.equal(week_start, '2024-06-17');
  });

  it('Saturday 2024-06-22: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 22));
    assert.equal(week_start, '2024-06-17');
  });

  it('Sunday 2024-06-23: week_start = 2024-06-17', () => {
    const { week_start } = weekWindow(localDate(2024, 6, 23));
    assert.equal(week_start, '2024-06-17');
  });
});

describe('weekWindow — week_end is always exactly 7 days after week_start', () => {
  it('Monday 2024-06-17: week_end = 2024-06-24', () => {
    const { week_end } = weekWindow(localDate(2024, 6, 17));
    assert.equal(week_end, '2024-06-24');
  });

  it('Sunday 2024-06-23: week_end = 2024-06-24', () => {
    const { week_end } = weekWindow(localDate(2024, 6, 23));
    assert.equal(week_end, '2024-06-24');
  });
});

describe('weekWindow — month and year boundary crossing', () => {
  it('Friday 2024-11-29 (pre-month boundary): week_start = 2024-11-25', () => {
    const { week_start, week_end } = weekWindow(localDate(2024, 11, 29));
    assert.equal(week_start, '2024-11-25');
    assert.equal(week_end, '2024-12-02');
  });

  it('Sunday 2024-12-29 (pre-year boundary): week_start = 2024-12-23', () => {
    const { week_start, week_end } = weekWindow(localDate(2024, 12, 29));
    assert.equal(week_start, '2024-12-23');
    assert.equal(week_end, '2024-12-30');
  });

  it('Wednesday 2025-01-01 (new year): week_start = 2024-12-30', () => {
    const { week_start, week_end } = weekWindow(localDate(2025, 1, 1));
    assert.equal(week_start, '2024-12-30');
    assert.equal(week_end, '2025-01-06');
  });
});

describe('weekWindow — week_start and week_end are valid ISO date strings', () => {
  it('both values match YYYY-MM-DD format', () => {
    const { week_start, week_end } = weekWindow(localDate(2024, 6, 20));
    assert.match(week_start, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(week_end,   /^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('weekWindow — week_end is exactly 7 days after week_start (parse check)', () => {
  it('difference is 7 calendar days', () => {
    const { week_start, week_end } = weekWindow(localDate(2024, 3, 15));
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = (new Date(week_end) - new Date(week_start)) / msPerDay;
    assert.equal(diff, 7);
  });
});
