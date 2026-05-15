// T07.L08 — Katapult and GIS-Based Staking Tools
// Paper staking vs. digital tools: Katapult, FieldCom, GPS accuracy, real-time sync.
// Sources: RUS Form 740 (public USDA); Katapult/FieldCom vendor documentation; field practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L08',
  course_id: 'T07',
  title: 'Katapult and GIS-Based Staking Tools',
  order: 8,
  lesson_type: 'working',
  prerequisites: [
    'T07.L01', 'T07.L02', 'T07.L03', 'T07.L04', 'T07.L05', 'T07.L06', 'T07.L07',
  ],
  learning_objectives: [
    'Describe the workflow for digital staking using Katapult or a comparable tool',
    'Compare paper staking (RUS Form 740) vs. digital staking on key dimensions: accuracy, sync, cost, connectivity needs',
    'Identify the GPS accuracy tradeoffs between phone GNSS, handheld GPS, and RTK',
    'Choose the right tool for a given staking scenario based on route type, connectivity, and crew size',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'Katapult',
    'FieldCom',
    'digital staking',
    'photo-attach',
    'GPS accuracy',
    'field-to-office real-time sync',
  ],
  key_terms: [
    {
      term: 'Katapult',
      definition: 'A cloud-based utility mapping and staking platform used by OSP engineering firms and crews to document poles, attachments, and route surveys on a mobile device (tablet or smartphone). Katapult imports design geometry (pole locations, route lines) from the engineering office, allows field crews to navigate to each pole, capture photos, record attachment heights and conditions, and sync data back to the office in real time over a cellular connection. Katapult is widely used in RUS-program staking because it directly generates the data formats used in pole-loading software and make-ready engineering.',
    },
    {
      term: 'FieldCom',
      definition: 'A field data collection platform used for utility asset management, pole inspection, and staking. Similar in purpose to Katapult but with a broader asset management scope. FieldCom integrates with GIS databases, allowing field crews to update pole records directly in the utility\'s asset management system. The name may refer to different vendor implementations; the underlying concept — mobile field data collection with real-time sync — is the same.',
    },
    {
      term: 'digital staking',
      definition: 'A staking method in which measurements, photos, GPS coordinates, and condition notes are captured on a mobile device (tablet or phone) using a specialized application, rather than written by hand on paper staking sheets. Digital staking produces structured data that can be directly imported into design, engineering, and billing workflows — eliminating the transcription step required with paper staking (and the associated transcription errors).',
    },
    {
      term: 'photo-attach',
      definition: 'A digital staking workflow step in which a photograph captured in the field is directly linked to a specific pole record in the staking application. The photo-attach creates a permanent association between the image and the pole\'s data record — so when an engineer opens the pole record in the office, they see the field photo alongside the measurements and notes. In Katapult, a photo-attach at a pole typically includes: the pole tag photograph, one or more attachment-height photographs (showing the laser measurement display), and a condition overview photo.',
    },
    {
      term: 'GPS accuracy',
      definition: 'The precision with which a GPS or GNSS receiver can determine a geographic location. Accuracy depends on the receiver technology: smartphone GNSS (built-in phone) typically achieves ±5–10 meters in open sky. Handheld GPS devices (Garmin, Trimble consumer units) typically achieve ±3–5 meters. Survey-grade RTK (Real-Time Kinematic) GPS achieves ±2–5 centimeters with a ground-base station. For staking purposes — matching a pole to a design location and creating GIS records — handheld GPS accuracy of ±3–5 meters is generally sufficient. RTK is required for high-precision work (property boundary, road centerline survey, cadastral mapping).',
    },
    {
      term: 'field-to-office real-time sync',
      definition: 'The automatic transfer of field-collected data (photos, measurements, GPS coordinates, condition notes) from a field device to a cloud database accessible in the engineering office, occurring via cellular data connection while the staker is still in the field. Real-time sync means the office engineer can review a pole\'s data while the staker is still two poles away — allowing real-time QA questions ("can you re-photograph pole 47? the photo is blurry") without requiring a separate re-stake visit.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const vocabulary_assumed = [
  { term: 'staker', source_lesson_id: 'T07.L01' },
  { term: 'RUS Form 740', source_lesson_id: 'T07.L05' },
  { term: 'attachment height measurement', source_lesson_id: 'T07.L04' },
  { term: 'SCID', source_lesson_id: 'T07.L03' },
  { term: 'GIS', source_lesson_id: 'T04.L01' },
  { term: 'pole tag', source_lesson_id: 'T07.L03' },
  { term: 'make-ready flag', source_lesson_id: 'T07.L06' },
];

export const key_terms = meta.key_terms;

export default function T07L08_KatapultAndGISStakingTools() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          For decades, staking meant walking a route with a clipboard, paper forms, and a
          tape measure. You wrote down measurements by hand, drew sketches of poles, filled
          out RUS Form 740 rows one at a time, and brought the forms back to the office where
          someone typed the data into a computer. The chain from field measurement to design
          software had multiple transcription steps — and every transcription step was a
          chance for an error.
        </p>
        <p className="mt-2">
          Today, most OSP engineering firms use digital staking tools. The most common one
          in RUS-program work is <strong>Katapult</strong>. Instead of paper, the staker
          carries a tablet. Instead of writing, they tap a pole icon on the screen, photograph
          the pole tag, type or voice-record measurements, and hit "sync." By the time they
          walk to the next pole, the office engineer can already see the previous pole's data.
        </p>
        <p className="mt-2">
          But digital tools are not magic — they have their own failure modes. A dead tablet
          battery in a rural pasture means no staking. No cellular signal means no sync.
          A staker who doesn't know the tool's GPS accuracy limitation can create a pole
          record that's 30 feet from the actual pole location. Understanding what digital
          tools do well and where they fall short is the key skill for this lesson.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Relevance</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GNSS</td>
              <td className="px-3 py-2">Global Navigation Satellite System</td>
              <td className="px-3 py-2">The umbrella term for satellite positioning systems (GPS is the US system; GLONASS is Russian; Galileo is European). "GNSS" covers all of them.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RTK</td>
              <td className="px-3 py-2">Real-Time Kinematic</td>
              <td className="px-3 py-2">Survey-grade GPS technique using a base station to achieve ±2–5 cm accuracy. Rarely needed for staking; used for cadastral and property surveys.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Database of geographic features (poles, routes, parcels) that Katapult/FieldCom push data into.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">QA</td>
              <td className="px-3 py-2">Quality Assurance</td>
              <td className="px-3 py-2">The review process an engineer runs on a staking package — checking completeness, photo quality, measurement consistency.</td>
            </tr>
          </tbody>
        </table>

        {/* Flashcards */}
        <Flashcard
          deckId="T07-L08"
          cards={[
            {
              id: 'T07-L08-fc-katapult',
              front: 'What is Katapult in OSP staking?',
              back: 'A cloud-based utility mapping and staking platform used by OSP engineering firms and crews to document poles, attachments, and route surveys on a mobile device (tablet or smartphone). Katapult imports design geometry (pole locations, route lines) from the engineering office, allows field crews to navigate to each pole, capture photos, record attachment heights and conditions, and sync data back to the office in real time over a cellular connection.',
            },
            {
              id: 'T07-L08-fc-digital',
              front: 'What is digital staking?',
              back: 'A staking method in which measurements, photos, GPS coordinates, and condition notes are captured on a mobile device (tablet or phone) using a specialized application, rather than written by hand on paper staking sheets. Digital staking produces structured data that can be directly imported into design, engineering, and billing workflows — eliminating the transcription step required with paper staking.',
            },
            {
              id: 'T07-L08-fc-photo',
              front: 'What is photo-attach in a digital staking workflow?',
              back: 'A digital staking workflow step in which a photograph captured in the field is directly linked to a specific pole record in the staking application. The photo-attach creates a permanent association between the image and the pole\'s data record — so when an engineer opens the pole record in the office, they see the field photo alongside the measurements and notes.',
            },
            {
              id: 'T07-L08-fc-gps',
              front: 'What GPS accuracy can a staker expect from different devices?',
              back: 'Smartphone GNSS (built-in phone): ±5–10 meters in open sky. Handheld GPS devices (Garmin, consumer Trimble): ±3–5 meters. Survey-grade RTK GPS: ±2–5 centimeters with a ground-base station. For staking purposes, handheld GPS accuracy of ±3–5 meters is generally sufficient for pole record creation and design validation.',
            },
            {
              id: 'T07-L08-fc-sync',
              front: 'What is field-to-office real-time sync?',
              back: 'The automatic transfer of field-collected data (photos, measurements, GPS coordinates, condition notes) from a field device to a cloud database accessible in the engineering office, occurring via cellular data connection while the staker is still in the field. Real-time sync means the office engineer can review a pole\'s data while the staker is still two poles away.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Katapult Workflow — How Digital Staking Works End to End</h2>

        <h3 className="mt-4 font-semibold">The five steps of a Katapult staking workflow</h3>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90">
          <li>
            <strong>Import the design.</strong> The office engineer uploads the design — pole
            locations, route geometry, design attachment heights, span lengths — into the
            Katapult project. The staker downloads the project to their tablet before
            leaving the office (or pulls it over cellular in the field). The tablet now shows
            a map with each pole location and any available design data for that pole.
          </li>
          <li>
            <strong>Navigate to the pole.</strong> The app shows the staker's GPS location
            relative to the nearest design pole. Walk to the pole, tap it on the map to open
            the pole record. GPS should put you within 5–10 meters of the design pole
            location if using phone GNSS.
          </li>
          <li>
            <strong>Photograph and record.</strong> For each pole: photograph the pole tag
            (SCID scan or photo-attach), photograph each attachment from below (showing the
            measurement display of your laser), photograph the overall pole condition. Enter
            measurements into the record fields. Flag any make-ready issues directly in the
            app — the flag links to this pole's record and shows on the office engineer's
            dashboard.
          </li>
          <li>
            <strong>Sync to cloud.</strong> On cellular: data syncs automatically every
            few minutes. On no-signal routes: the app stores data locally; it syncs when
            the tablet reconnects. The staker must verify sync has completed before closing
            the project — data that exists only on the tablet and not in the cloud is at
            risk of loss if the tablet battery dies or is damaged.
          </li>
          <li>
            <strong>Office QA.</strong> The engineer reviews the project in real time
            (on cellular routes) or after the staker returns (on offline routes). They
            check: all poles visited, all photos attached, measurements complete,
            make-ready flags documented. QA comments go back to the staker if anything
            needs to be corrected — on a cellular route, the staker may still be close
            enough to re-photograph a pole that day rather than scheduling a re-stake visit.
          </li>
        </ol>

        {/* Annotated Diagram */}
        <AnnotatedDiagram
          title="Katapult Digital Staking Workflow"
          description="End-to-end view of a Katapult staking job: from design import in the office through field data collection to real-time sync and office QA. Click each stage to see what happens."
          src="/img/diagrams/t07-katapult-workflow.svg"
          fallbackDescription={`
            Diagram description (use when image is unavailable):

            A horizontal flow diagram with five stages, left to right:

            STAGE 1 — OFFICE: "Design Import"
            Box showing a laptop with the Katapult web interface. Icons: route line imported
            from design software, pole symbols placed along route, attachment heights loaded.
            Arrow pointing right labeled "Downloaded to tablet."

            STAGE 2 — FIELD: "Navigate to Pole"
            Tablet screen showing a satellite map with a blue dot (staker GPS position)
            and a pole icon (design pole location). Distance shown: "23 ft." Arrow pointing
            to pole icon. Label: "GPS accuracy: ±5 m smartphone, ±3 m handheld device."

            STAGE 3 — FIELD: "Photograph and Record"
            Tablet screen split view: camera app (live photo of pole tag being photographed)
            and data entry form (attachment height field showing "27.2 ft", condition dropdown
            showing "Burn scar — flag for replacement", make-ready flag checkbox checked).
            Label: "All data linked to this pole's record."

            STAGE 4 — FIELD/CLOUD: "Sync"
            Tablet with a sync arrow pointing to a cloud icon. Three sub-labels:
            "Cellular route: syncs every 2–3 min automatically."
            "No-signal route: syncs when reconnected. Verify sync before leaving area."
            "Local storage backup: photos stored locally even without sync."

            STAGE 5 — OFFICE: "QA and Review"
            Laptop showing the engineer's dashboard. Pole list with green checkmarks (complete)
            and yellow flags (make-ready). One pole has a red "! Incomplete photo" flag.
            Arrow from office back to field labeled "QA comment → staker phone: re-photograph
            pole 47 (blurry image)."

            Below the flow, a comparison table:
            Paper (Form 740) vs. Digital (Katapult):
            Connectivity: Paper = none needed | Digital = cellular preferred
            Sync: Paper = end of day (bring to office) | Digital = real-time
            Photo attach: Paper = separate envelope | Digital = automatic link to pole record
            Transcription error risk: Paper = high (handwriting → data entry) | Digital = low (typed at pole)
            Battery dependency: Paper = none | Digital = critical (10-hour field day needs external battery)
          `}
          annotations={[
            {
              id: 'ann-import',
              label: 'Design Import',
              x: 5,
              y: 40,
              description: 'Office engineer uploads the design to Katapult: pole locations, route geometry, design attachment heights. Staker downloads to tablet before leaving office or via cellular in the field.',
            },
            {
              id: 'ann-navigate',
              label: 'Navigate to Pole',
              x: 25,
              y: 40,
              description: 'App shows staker GPS position vs. design pole location. Phone GNSS places staker ±5–10 m from design pole; handheld GPS ±3–5 m. Walk to the physical pole and tap it on the map to open the record.',
            },
            {
              id: 'ann-record',
              label: 'Photo + Record',
              x: 50,
              y: 40,
              description: 'For each pole: photograph tag (for SCID), photograph each attachment (laser measurement visible in frame), photograph overall condition. Enter measurements and make-ready flags directly in the app. All data links to this pole record.',
            },
            {
              id: 'ann-sync',
              label: 'Sync to Cloud',
              x: 75,
              y: 40,
              description: 'Cellular: syncs automatically every few minutes. No signal: data stored locally; syncs when reconnected. Always verify sync completed before closing project — local-only data is at risk.',
            },
            {
              id: 'ann-qa',
              label: 'Office QA',
              x: 93,
              y: 40,
              description: 'Engineer reviews poles in real time on cellular routes. Flags incomplete photos or missing measurements. Comment goes back to staker\'s device. On a cellular route, the staker may still be close enough to re-photograph the same day.',
            },
          ]}
        />

        <h3 className="mt-6 font-semibold">Paper staking vs. digital staking — when to use each</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Dimension</th>
              <th className="px-3 py-2 text-left">Paper (RUS Form 740)</th>
              <th className="px-3 py-2 text-left">Digital (Katapult/FieldCom)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Connectivity required</td>
              <td className="px-3 py-2">None</td>
              <td className="px-3 py-2">Cellular preferred; offline mode available</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Data sync to office</td>
              <td className="px-3 py-2">End of day (physical forms returned)</td>
              <td className="px-3 py-2">Real-time (on cellular) or batch (on return)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Transcription errors</td>
              <td className="px-3 py-2">High risk (hand → typed into system)</td>
              <td className="px-3 py-2">Low (typed or tapped directly at pole)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Photo attachment</td>
              <td className="px-3 py-2">Separate (photos must be matched to forms manually)</td>
              <td className="px-3 py-2">Automatic (photo links directly to pole record)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Battery dependency</td>
              <td className="px-3 py-2">None</td>
              <td className="px-3 py-2">Critical — 10-hour field day requires external battery</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Suitability for large routes (&gt;100 poles)</td>
              <td className="px-3 py-2">Manageable but slow to process</td>
              <td className="px-3 py-2">Strong — bulk data in structured format</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Works when tablet breaks</td>
              <td className="px-3 py-2">Yes — clipboard always works</td>
              <td className="px-3 py-2">No — must fall back to paper backup forms</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — GPS Accuracy for Staking</p>
          <p className="text-slate-300/90">
            <strong>Book (GNSS specification):</strong> GPS receiver datasheets often specify
            accuracy as "sub-meter with WAAS" or "±3 m typical." These specs assume open sky,
            no nearby obstructions, strong satellite geometry. Smartphone GNSS manufacturers
            publish ±5 m as typical for open-area consumer use.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Trees, buildings, and terrain reduce satellite
            sky view and increase multipath error (the signal bouncing off surfaces before
            reaching the receiver). In dense rural tree cover or near buildings, a phone GNSS
            may show ±15–30 m of error — placing a pole record 30 feet from the actual pole
            location. That's enough to place the GIS record in the wrong ROW parcel or
            attribute the pole to the wrong landowner.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field mitigation:</strong> Most stakers using Katapult photograph the
            pole tag (which includes the SCID/pole ID) as the primary record anchor, not
            the GPS coordinate. The GPS gives a rough location; the photo and SCID give the
            definitive identification. Engineers know to use GPS as "find the area on the map"
            and SCID as "confirm this is the exact pole." For projects that require
            high-precision GIS records (utility easement documentation, property-boundary
            adjacent work), the staker must note GPS accuracy on each record or use a
            handheld GPS device with WAAS.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Devices and expected accuracy:</strong>
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-300/90">
            <li>Smartphone GNSS (built-in): ±5–15 m typical in open sky; up to ±30 m in tree cover</li>
            <li>Handheld GPS (Garmin eTrex, Trimble Juno): ±3–5 m with WAAS/EGNOS; ±8–12 m in tree cover</li>
            <li>Survey-grade RTK (Trimble R10, Leica GS18): ±2–5 cm with active base station; ±1–2 m without base</li>
          </ul>
          <p className="text-slate-300/90 mt-2">
            (Source: GPS.gov consumer accuracy data; Garmin/Trimble device specifications;
            field experience on RUS-program staking projects.)
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: When Digital Staking Fails — Offline and Battery Scenarios</h2>
        <p>
          A good staker always carries a paper backup. Digital tools fail in the field
          in ways that paper never does:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Battery death mid-route.</strong> A 10-hour staking day in summer heat
            (tablet screen on, GPS active, photos every 2 minutes) can drain even a fully
            charged iPad in 6–7 hours. External battery packs (20,000+ mAh) extend runtime
            significantly. Best practice: carry the external battery, charge the tablet
            in the truck between sections.
          </li>
          <li>
            <strong>Cellular signal loss — sync failure.</strong> Rural RUS routes often
            have no cellular coverage for miles. Katapult stores data locally when offline.
            However: if the tablet is damaged (drop, vehicle incident) before returning to
            cellular range, locally-stored data that was never synced may be partially or
            fully lost. For no-signal sections, some stakers photograph every form on their
            phone (which they always have charged) as a secondary backup.
          </li>
          <li>
            <strong>App crashes or version conflicts.</strong> An app update in the field
            can break compatibility with a project created in an older version. Stakers
            should disable auto-update on their field tablet for the duration of a project.
            Lock app version at the start of each project; update between projects, not
            during.
          </li>
          <li>
            <strong>What to do when the tablet fails:</strong> Switch to paper. Carry blank
            RUS Form 740 sheets, a pencil (works wet; pens fail in rain), and a tape
            measure. Record pole ID, measurements, and make-ready flags by hand. Photograph
            with your phone. Reunite the paper notes and phone photos with the digital
            project record when back in coverage.
          </li>
        </ul>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T07.L08 Check — Katapult and GIS Staking Tools"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L08-Q1',
            type: 'mc',
            prompt: 'A staker is assigned to a 150-pole aerial route in a rural area with no cellular coverage for the first 80 miles. What is the most critical precaution for digital staking on this route?',
            choices: [
              'Switch to paper staking for the entire route — Katapult only works with cellular',
              'Verify that Katapult has downloaded the project to local storage before leaving coverage, carry a fully charged external battery, and verify sync when cellular is restored at the end of the section',
              'Use RTK GPS for all pole records since phone GNSS won\'t work without cellular',
              'Ask the engineer to drive along in the office truck with a Wi-Fi hotspot',
            ],
            answerIndex: 1,
            explanation: 'Katapult (and most field staking apps) have an offline mode that stores data locally when cellular is unavailable. The critical steps are: (1) pre-download the project to the device before losing coverage, (2) carry adequate battery for the full field day, and (3) verify that data synced to the cloud when coverage is restored. Phone GNSS does not require cellular — it uses satellite signals independently of the cell network. (Source: Katapult documentation; field practice on RUS routes.)',
          },
          {
            id: 'T07-L08-Q2',
            type: 'mc',
            prompt: 'In a Katapult digital staking workflow, what does "photo-attach" accomplish that paper staking cannot do automatically?',
            choices: [
              'Photo-attach compresses photos to save storage space on the tablet',
              'Photo-attach sends the photo to the local 811 center for locate verification',
              'Photo-attach directly links the field photograph to the specific pole record in the cloud database, so the engineer sees photo and data together without a manual matching step',
              'Photo-attach converts the pole tag QR code into a measurement data entry',
            ],
            answerIndex: 2,
            explanation: 'With paper staking, photos are taken separately (camera or phone) and must be manually matched to each pole\'s form — a time-consuming and error-prone step. Photo-attach in Katapult creates an automatic association between the photo and the pole record at the moment the photo is taken, so the data and image are always together in the database without any post-processing matching. (Source: Katapult documentation; OSP engineering field practice.)',
          },
          {
            id: 'T07-L08-Q3',
            type: 'mc',
            prompt: 'A staker uses their smartphone for GPS in Katapult. In a heavily treed rural area, the phone is showing ±15 m GPS accuracy. The engineer needs the pole GIS records to be reliable enough to match poles to property parcels. What should the staker do?',
            choices: [
              'Accept the ±15 m accuracy — it\'s within the NESC clearance tolerance',
              'Photograph each pole\'s tag (SCID) as the primary identification anchor and note "GPS: low accuracy, high tree cover" in each pole record. Escalate to engineer if property-boundary precision is required — that may require a handheld GPS or an RTK device.',
              'Stop staking until better weather improves satellite reception',
              'Use the design plan coordinates instead of field GPS for each pole record',
            ],
            answerIndex: 1,
            explanation: 'The correct response is to document the GPS limitation, use the pole tag (SCID) as the primary record anchor (not the GPS coordinate), and flag the accuracy issue for the engineer. Property-parcel matching may require a handheld GPS (±3–5 m) or RTK (±2–5 cm) — a staking decision that should be escalated to the engineer if the project requires it, not a field judgment call. Accepting ±15 m without flagging it leaves the engineer unaware of the data quality limitation. (Source: GPS.gov accuracy data; Katapult field practice.)',
          },
          {
            id: 'T07-L08-Q4',
            type: 'dragdrop',
            prompt: 'Match each staking scenario to the better method: paper (RUS Form 740) or digital (Katapult).',
            items: [
              { id: 'item-a', label: 'Single-crew, 15-pole drop route in a cellular dead zone, one-day job' },
              { id: 'item-b', label: '250-pole route with real-time QA by the office engineer, cellular coverage throughout' },
              { id: 'item-c', label: 'Tablet battery died mid-route, 30 poles remaining' },
              { id: 'item-d', label: '80-pole route where the engineer needs GIS records imported directly into the pole-loading model' },
            ],
            targets: [
              { id: 'tgt-paper', label: 'Paper staking (RUS Form 740)' },
              { id: 'tgt-digital', label: 'Digital staking (Katapult)' },
            ],
            correctMap: {
              'tgt-paper': ['item-a', 'item-c'],
              'tgt-digital': ['item-b', 'item-d'],
            },
            explanation: 'Paper wins on: (a) cellular dead zones for small jobs where offline sync is too risky for a one-day project; (c) battery failure — always have paper backup. Digital wins on: (b) large routes with real-time QA — the engineer sees data immediately and can request same-day corrections; (d) routes where data must import directly into pole-loading software — digital structured data eliminates transcription. Both methods are valid; the choice is driven by connectivity, crew size, project scale, and downstream data needs.',
          },
        ]}
      />

    </LessonLayout>
  );
}
