// T07.L03 — Photographing and Coding Pole Tags
// Working lesson: GPS tagging, SCID coding, consistent pole photography
// Sources: Industry practice (Katapult, FieldCom), OSHA 1910.268, RUS Bulletin 1751F-630 §7

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L03',
  course_id: 'T07',
  title: 'Photographing and Coding Pole Tags',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T07.L01', 'T07.L02'],
  learning_objectives: [
    'Photograph a pole consistently: correct angle, lighting conditions, and field of view to show all attachments',
    'Record GPS coordinates to the accuracy appropriate for staking (handheld GNSS ±3–10 m) and know what that accuracy means downstream',
    'Decode a SCID tag structure and cross-reference it with the design',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: ['pole tag', 'SCID', 'GPS coordinate', 'attachment photo', 'GNSS'],
  vocabulary_assumed: [
    { term: 'call-out', source_lesson_id: 'T07.L01' },
    { term: 'stake', source_lesson_id: 'T07.L01' },
    { term: 'field verification', source_lesson_id: 'T07.L01' },
    { term: 'measurement tolerance', source_lesson_id: 'T07.L01' },
    { term: 'design intent mark', source_lesson_id: 'T07.L02' },
    { term: 'stationing', source_lesson_id: 'T07.L02' },
  ],
  key_terms: [
    {
      term: 'pole tag',
      definition:
        'A physical label or marker attached to a utility pole that identifies it. A pole tag typically contains a pole number (often assigned by the pole owner), a structure or circuit identifier, sometimes GPS coordinates, and often a QR code that links to a digital record. Stakers read and photograph pole tags to confirm they\'ve found the correct pole and to cross-reference the pole ID with their design.',
    },
    {
      term: 'SCID',
      definition:
        'Structure Coordinate ID — a unique identifier combining pole number, location code, and GPS coordinates used to tag and cross-reference poles in survey and GIS databases. SCIDs appear in digital staking tools (like Katapult) and in RUS-program GIS layers, allowing every pole to be unambiguously identified across design, staking, construction, and inspection records.',
    },
    {
      term: 'GPS coordinate',
      definition:
        'A latitude and longitude pair (and optional elevation) that specifies a precise point on the Earth\'s surface. Stakers record GPS coordinates at each pole to support GIS mapping, as-built records, and cross-referencing between field photos and design data. Accuracy varies by device: handheld Garmin ±3 meters, smartphone GNSS ±5–10 meters, RTK (Real-Time Kinematic) ±2 centimeters.',
    },
    {
      term: 'attachment photo',
      definition:
        'A photograph of a pole\'s existing wires and equipment taken from a specific angle (typically downline, looking along the route) to show all attachments and their vertical spacing. Attachment photos are the primary visual evidence that the staker observed the pole and recorded its condition accurately.',
    },
    {
      term: 'GNSS',
      definition:
        'Global Navigation Satellite System — the family of satellite-based positioning systems that includes GPS (US), GLONASS (Russia), Galileo (EU), and BeiDou (China). A device that receives multiple GNSS constellations is more accurate and more reliable than one that only receives GPS. Most modern smartphones and handheld units receive multiple GNSS signals.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T07L03_PhotographingAndCodingPoleTags() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every pole you stake needs to be documented with two things: a photograph that
          proves you were there and shows the existing conditions, and a GPS coordinate that
          places that photo on a map. Do both consistently across every pole on the route,
          and the engineer, make-ready crew, and construction crew have a clear visual record
          to work from — without having to revisit every pole themselves.
        </p>
        <p className="mt-2">
          Think of it like a real estate inspection. The inspector walks every room, takes
          photos from the same angle in each room, and notes the address and room number
          on each photo. You could hand that photo package to anyone and they'd know exactly
          what they're looking at and where. That's what consistent staking photos do for
          a utility route.
        </p>
        <p className="mt-2">
          The other piece is reading the physical marker on each existing pole — the{' '}
          <strong>pole tag</strong>. Tags tell you who owns the pole, how old it is,
          its class, and its identifier. Cross-referencing the tag ID with your design
          confirms you're at the right pole before you measure anything.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SCID</td>
              <td className="px-3 py-2">Structure Coordinate ID</td>
              <td className="px-3 py-2">Unique pole ID used in GIS and digital staking tools to track poles across all project phases</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GNSS</td>
              <td className="px-3 py-2">Global Navigation Satellite System</td>
              <td className="px-3 py-2">Family of satellite systems (GPS, GLONASS, Galileo) that provide location data; modern devices receive multiple</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RTK</td>
              <td className="px-3 py-2">Real-Time Kinematic</td>
              <td className="px-3 py-2">High-accuracy GPS technique (±2 cm) using a fixed ground station as reference — used in survey, rarely in routine staking</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Software that places data on maps — GPS coordinates from staking populate GIS layers used by engineers and make-ready crews</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">GPS accuracy — what the numbers mean</h3>
        <p className="mt-2">
          Not all GPS is equal. Here's what you're working with in the field:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Device type</th>
              <th className="px-3 py-2 text-left">Typical accuracy</th>
              <th className="px-3 py-2 text-left">Good enough for staking?</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Smartphone GNSS (open sky)</td>
              <td className="px-3 py-2">±5–10 meters</td>
              <td className="px-3 py-2">Yes — for pole tagging and photo geo-reference</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Handheld Garmin (multi-constellation)</td>
              <td className="px-3 py-2">±3 meters</td>
              <td className="px-3 py-2">Yes — preferred for staking; better satellite lock</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">RTK GPS (with base station)</td>
              <td className="px-3 py-2">±2 centimeters</td>
              <td className="px-3 py-2">Yes — overkill for most staking; used in precise survey</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Smartphone under tree canopy</td>
              <td className="px-3 py-2">±15–30 meters</td>
              <td className="px-3 py-2">Marginal — note in staking record that accuracy was reduced</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: Device accuracy specifications from Garmin and Apple documentation; RTK accuracy
          from industry GNSS vendor specifications.
        </p>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T07-L03"
          cards={[
            {
              id: 'T07-L03-fc-pole-tag',
              front: 'What is a pole tag?',
              back: 'A physical label or marker attached to a utility pole that identifies it. A pole tag typically contains a pole number, structure or circuit identifier, sometimes GPS coordinates, and often a QR code linking to a digital record. Stakers read and photograph pole tags to confirm they\'ve found the correct pole.',
            },
            {
              id: 'T07-L03-fc-scid',
              front: 'What is a SCID?',
              back: 'Structure Coordinate ID — a unique identifier combining pole number, location code, and GPS coordinates used to tag and cross-reference poles in survey and GIS databases. SCIDs appear in digital staking tools and RUS-program GIS layers.',
            },
            {
              id: 'T07-L03-fc-gps',
              front: 'What is a GPS coordinate in staking?',
              back: 'A latitude and longitude pair that specifies a precise point on the Earth\'s surface. Stakers record GPS coordinates at each pole for GIS mapping and as-built records. Accuracy varies: handheld Garmin ±3 meters, smartphone GNSS ±5–10 meters, RTK ±2 centimeters.',
            },
            {
              id: 'T07-L03-fc-attachment-photo',
              front: 'What is an attachment photo?',
              back: 'A photograph of a pole\'s existing wires and equipment taken from a specific angle (typically downline, looking along the route) to show all attachments and their vertical spacing. Attachment photos are the primary visual evidence that the staker observed the pole and recorded its condition.',
            },
            {
              id: 'T07-L03-fc-gnss',
              front: 'What is GNSS?',
              back: 'Global Navigation Satellite System — the family of satellite-based positioning systems including GPS (US), GLONASS (Russia), Galileo (EU), and BeiDou (China). A device receiving multiple GNSS constellations is more accurate and reliable than one receiving only GPS.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Photography Protocol</h2>

        <h3 className="mt-4 font-semibold">Why consistency matters more than quality</h3>
        <p>
          A staking photo package may contain 200–1,000 photos across a single project.
          The engineer reviewing those photos isn't admiring composition — they're checking
          specific things: can I see all the attachments? Is the ground condition visible?
          Can I read the pole tag? Does this match the staking note?
        </p>
        <p className="mt-2">
          If every photo is taken from a slightly different angle, at different zoom levels,
          in different lighting, the review becomes tedious and error-prone. Consistent angle
          and framing lets the reviewer scan photos rapidly, flagging only the ones that need
          attention.
        </p>

        <h3 className="mt-5 font-semibold">The two required photos per pole</h3>
        <p className="mt-2">
          Standard practice on most RUS-funded routes requires <strong>two photos per
          existing pole</strong>:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-sm">
          <li>
            <strong>Downline attachment photo</strong> — stand about 20–30 feet from the
            pole, looking along the route direction (toward the next pole). Frame the photo
            so the full pole height is visible, all wires are visible, and the pole tag
            is legible. This is the primary record photo.
          </li>
          <li>
            <strong>Crossline ground-level photo</strong> — step 15–20 feet perpendicular
            to the route and photograph the pole from the side. This shows the lean (if any),
            the pole base condition, and any ground-level obstructions (guy wires, signs,
            landscaping) that the downline photo doesn't capture.
          </li>
        </ol>
        <p className="mt-2 text-sm">
          For new pole locations (no existing pole), photograph the ground at the stake
          location from both the downline and crossline angles to document the terrain,
          soil type, and any obstacles.
        </p>

        <h3 className="mt-5 font-semibold">Common photography mistakes — and their consequences</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Mistake</th>
              <th className="px-3 py-2 text-left">Consequence</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Photo taken at noon directly beneath the pole (sun above, all wires backlit)</td>
              <td className="px-3 py-2">Wires appear as dark silhouettes; can't count attachments or read heights. Engineer has to revisit.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Photo taken from too far away — pole is a toothpick</td>
              <td className="px-3 py-2">Pole tag unreadable; attachment count uncertain. Photo is effectively useless.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Only one angle photographed (downline only, no crossline)</td>
              <td className="px-3 py-2">Pole lean, base condition, and side-clearance issues invisible. Make-ready crew gets a surprise.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">GPS coordinates not recorded before moving to next pole</td>
              <td className="px-3 py-2">Photo is unlocated on the GIS map. Either it gets dropped from the record or forces a return visit.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Reading and coding a SCID</h3>
        <p className="mt-2">
          On projects using digital staking tools (Katapult, FieldCom, Datafield), each pole
          gets a <strong>SCID</strong> (Structure Coordinate ID) — a unique identifier that
          follows the pole through design, staking, make-ready, construction, and inspection.
        </p>
        <p className="mt-2">
          A typical SCID format looks like: <code className="bg-black/30 px-1 rounded">PSC-RUS-2024-SA4-0047</code>
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li><code className="bg-black/30 px-1 rounded">PSC</code> — client code (PSC = project sponsor)</li>
          <li><code className="bg-black/30 px-1 rounded">RUS</code> — program code (RUS-funded project)</li>
          <li><code className="bg-black/30 px-1 rounded">2024</code> — project year</li>
          <li><code className="bg-black/30 px-1 rounded">SA4</code> — service area 4</li>
          <li><code className="bg-black/30 px-1 rounded">0047</code> — pole 47 in sequence</li>
        </ul>
        <p className="mt-2 text-sm">
          When you find a pole with an existing tag in the field, photograph the tag as part
          of your downline photo, then enter its identifier in your staking tool or staking
          note as the <em>existing pole owner's ID</em>. Cross-reference it with the design's
          pole ID at that station to confirm they match. A mismatch (wrong pole, wrong station)
          is a call-out.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — GPS Accuracy</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> GPS accuracy for surveying is often specified at ±0.5 meter
            (RTK) or ±5 meters (handheld). Design plans show poles located to sub-foot precision.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Most stakers use phone GNSS or a handheld Garmin — both
            accurate to ±3–10 meters. That's not as precise as the design, but it's acceptable
            for pole tagging and photo geo-referencing. The key is to <em>note what device you
            used</em> in the staking record, so the GIS analyst knows the accuracy class of each
            coordinate. A phone coordinate under tree canopy might be ±20 meters — record it that
            way and let the GIS analyst decide whether to field-verify it.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Recording phone GNSS coordinates as if they're survey-grade
            without noting the accuracy can lead to GIS maps that look precise but aren't.
            A make-ready estimator who trusts a bad GPS point may quote a wrong utility location.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Photo Quality Control and Chain of Evidence</h2>

        <h3 className="mt-4 font-semibold">The staking photo as legal evidence</h3>
        <p>
          On RUS-funded projects, staking documentation is submitted as part of the
          engineering package that justifies program funds. If a dispute arises — "the
          make-ready crew caused that pole to lean," "the attachment was already at that
          height before we touched it" — the staking photos are the chain of evidence.
        </p>
        <p className="mt-2">
          This is why photo metadata matters: the GNSS coordinates embedded in the image
          file (EXIF data), the timestamp, the device ID. Most modern smartphones write
          all of this automatically as long as "location services" is enabled for the camera.
          Handheld GPS units like the Garmin eTrex series require manually entering the
          coordinate before taking the photo, or using a linked photo app.
        </p>
        <p className="mt-2">
          Habit: check the first photo of each day in your phone's photo app to confirm
          location is showing correctly. One missing "allow location" permission can produce
          a whole day of unlocated photos.
        </p>

        <h3 className="mt-5 font-semibold">When to take additional photos</h3>
        <p>
          Two photos is the minimum. Take more when:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Pole is leaning more than 5° — take a photo from each cardinal direction to document the lean axis</li>
          <li>Existing equipment (transformer, switch, streetlight) on the pole — take a close-up</li>
          <li>Ground condition at the pole base is unusual (erosion, flooding history, standing water, pavement breaking up)</li>
          <li>Property or ROW boundary is within 5 feet of the pole — document with a wide angle</li>
          <li>There's a conflict between two existing utilities on the pole that may affect your attachment — document the crowding</li>
        </ul>
      </section>

      {/* ── LABELED LIST — pole tag elements ─────────────────────────────── */}
      <div className="lesson-callout">
        <h4>Pole Tag Anatomy — What You're Reading and Photographing</h4>
        <ol>
          <li>
            <strong>QR code</strong> — Links to the pole's digital record when scanned with a
            smartphone. Typically retrieves: pole class, height, installation year, inspection
            history, and any existing joint-use attachments on file. Scan it if your staking tool
            supports QR import; photograph it as part of the downline photo.
          </li>
          <li>
            <strong>Manual pole number</strong> — A stamped or engraved number that the pole owner
            uses to identify this specific pole in their records. This is NOT the same as your
            project's SCID — it's the owner's ID. Record both: "Owner tag: [number], Project SCID:
            [SCID]" in your staking notes. They must match the design record.
          </li>
          <li>
            <strong>GPS on tag</strong> — Some modern pole tags (especially on digital-staking
            projects using Katapult or FieldCom) are pre-printed with a GPS coordinate from the
            survey. Cross-reference with your handheld or phone reading. Within 10 meters = right
            pole. Difference over 30 meters = you may be at the wrong pole.
          </li>
          <li>
            <strong>Pole owner code</strong> — A two- or three-letter code identifying the pole
            owner (e.g., "GPC" for Georgia Power, "SECO" for South Electric Cooperative). The
            owner code matters for make-ready permitting — you need different attachment
            applications depending on who owns the pole.
          </li>
          <li>
            <strong>Recommended photo angle</strong> — Stand 20–30 feet downline (looking toward
            the next pole in the route direction). Frame the shot so the full pole height is
            visible from ground to top. The pole tag should be readable. All wire attachments
            should be visible and distinct. Avoid shooting into direct sun.
          </li>
        </ol>
      </div>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="Field Scenario: Poor Photo Quality — Re-Shoot or Accept?"
        description="You've just photographed Pole 23 of a 60-pole route. Looking at the photo on your phone, the downline shot is blurry — you moved the camera as you took it. The crossline shot is clear. Your GPS coordinate is recorded. You're 0.5 miles from this pole now, walking the next section. Do you go back?"
        initialNode="start"
        nodes={{
          start: {
            text: 'Pole 23 downline photo is blurry. The crossline photo is clear. GPS coordinate was recorded. The attachment heights were entered in your staking notes from field measurement. You\'re 0.5 miles away and moving forward. Options?',
            choices: [
              { label: 'Keep both photos — the crossline shot is clear, and the measurements are in the notes.', next: 'keep-both' },
              { label: 'Delete the blurry downline photo and keep only the crossline photo. Note "no downline photo available" in staking notes.', next: 'delete-downline' },
              { label: 'Walk back 0.5 miles to re-shoot the downline photo while conditions and your setup are fresh.', next: 'reshoot' },
            ],
          },
          'keep-both': {
            text: 'You submit both photos. The engineer reviewing the package flags Pole 23: "Downline photo blurry — can\'t confirm attachment count from photo." They request a return visit. Because you\'ve moved on and the route is now partially staked with new markers, the return visit takes 45 minutes and disrupts staking flow for the next section. Total cost: ~2 hours of productivity. The issue: a blurry photo wasn\'t worth keeping — it just delayed the inevitable.',
            choices: [
              { label: 'See the better options.', next: 'reshoot' },
            ],
          },
          'delete-downline': {
            text: 'You delete the blurry photo and note "no downline photo — crossline clear, measurements verified in staking notes." The engineer sees the note and accepts it for this one pole, since the measurements are documented. This is an acceptable resolution when returning is impractical (weather change, route locked down, access restricted). The key: you documented the absence honestly rather than submitting a photo that misrepresents the quality.',
            choices: [
              { label: 'See what the return-and-reshoot approach looks like.', next: 'reshoot' },
            ],
            isEnd: false,
          },
          reshoot: {
            text: 'You walk back 0.5 miles and re-shoot the downline photo in the same lighting, from the same angle, with the camera locked stable. Five minutes of effort. The photo is clear, shows all four attachments, pole tag readable. You continue staking. The engineer\'s review of Pole 23 takes 30 seconds. No return visit required. Total cost of the re-shoot: 20 minutes of time. Total cost of the alternative (return visit on engineer review): 2 hours. This is the right trade-off calculation when you\'re within reasonable walking distance. The rule of thumb: if you can reshoot in under 30 minutes round-trip, go back.',
            choices: [],
            isEnd: true,
            feedback: 'Photo quality is worth the walk-back when the round-trip is under 30 minutes. A blurry photo costs more later than a clean re-shoot costs now. The key exception: document the absence honestly (delete + note in staking record) when returning is genuinely impractical.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ─────────────────────────────────────────────── */}
      <Quiz
        title="T07.L03 Check — Photographing and Coding Pole Tags"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L03-Q1',
            type: 'mc',
            prompt: 'What is the standard downline attachment photo taken from?',
            choices: [
              'Directly beneath the pole, pointing straight up to capture all attachments from below',
              'From 20–30 feet away, looking along the route direction toward the next pole, with the full pole height visible',
              'From the adjacent roadway, using maximum zoom to capture the pole tag',
              'From 100 feet away to capture both the pole and the surrounding terrain in one frame',
            ],
            answerIndex: 1,
            explanation:
              'The downline attachment photo is taken from 20–30 feet away, looking toward the next pole in the route direction. This angle shows the full pole height, all attachments, and makes the pole tag legible. Shooting from directly below creates backlighting problems and distorts the perspective.',
          },
          {
            id: 'T07-L03-Q2',
            type: 'mc',
            prompt: 'A staker uses a smartphone in open-sky conditions to record GPS coordinates at each pole. What is the typical accuracy, and is it sufficient for staking?',
            choices: [
              '±2 centimeters — yes, survey-grade accuracy',
              '±3 meters — yes, handheld Garmin grade',
              '±5–10 meters — yes, sufficient for pole tagging and photo geo-referencing, but must be noted in the record',
              '±50 meters — no, not usable for staking',
            ],
            answerIndex: 2,
            explanation:
              'Smartphone GNSS in open sky typically provides ±5–10 meter accuracy. This is sufficient for pole tagging and photo geo-referencing on most RUS staking projects. The key requirement is noting the device type and accuracy class in the staking record so the GIS analyst knows the precision of each coordinate.',
          },
          {
            id: 'T07-L03-Q3',
            type: 'mc',
            prompt:
              'What does a SCID (Structure Coordinate ID) enable that a simple pole number alone does not?',
            choices: [
              'A SCID tells you the pole\'s material (wood vs. steel vs. concrete)',
              'A SCID provides a unique identifier that follows the pole across design, staking, make-ready, construction, and inspection records in GIS databases',
              'A SCID replaces the need for GPS coordinates',
              'A SCID is required by OSHA 1910.268 for all pole work',
            ],
            answerIndex: 1,
            explanation:
              'A SCID is a unique GIS-linked identifier that tracks the pole through every phase of the project — design, staking, make-ready, construction, inspection, and as-built records. A simple pole number may be local to one system; a SCID is system-wide and allows cross-referencing between all project databases.',
          },
          {
            id: 'T07-L03-Q4',
            type: 'fill-in-blank',
            prompt:
              'A photograph of a pole\'s existing wires and equipment taken from a specific angle to show all attachments and their vertical spacing is called an ____ photo.',
            answer: 'attachment',
            answerDisplay: 'attachment',
            explanation:
              'An attachment photo is the primary evidence that the staker observed the pole and recorded its condition. It should show all wires, their approximate heights, the pole tag, and the general condition of the pole. The downline angle (looking along the route) is the standard for attachment photos.',
          },
          {
            id: 'T07-L03-Q5',
            type: 'mc',
            prompt:
              'You record GPS coordinates for Pole 47 with your smartphone under dense tree canopy. The phone shows ±15–20 meter estimated accuracy. What should you do?',
            choices: [
              'Record the coordinate as normal — GPS accuracy variance is not worth documenting',
              'Skip GPS for this pole and note "no GPS recorded"',
              'Record the coordinate and note in the staking record that accuracy was reduced due to tree canopy (±15–20 m)',
              'Wait under the trees until GPS accuracy improves to ±3 meters',
            ],
            answerIndex: 2,
            explanation:
              'Record the coordinate and note the reduced accuracy. The GIS analyst and engineer need to know the accuracy class of each coordinate — a ±15-meter coordinate is still useful for approximate location but shouldn\'t be trusted for precision placement. Transparency in the record beats a missing coordinate, and it gives the reviewer the information to decide whether a more accurate re-measurement is warranted.',
          },
        ]}
      />

    </LessonLayout>
  );
}
