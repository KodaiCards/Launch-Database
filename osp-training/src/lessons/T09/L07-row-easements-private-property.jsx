// T09.L07 — ROW, Easements, and Private Property
// Working lesson: private-property access instruments — easements, licenses, fee-simple, dedication
// Sources: M02 §2.7 (ROW/easements); net-new (express easement, fee-simple, dedication)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L07',
  course_id: 'T09',
  title: 'ROW, Easements, and Private Property',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T09.L01', 'T04.L01', 'T04.L03'],
  learning_objectives: [
    'Distinguish the four private-property access instruments by enforceability and recordability',
    'Explain why prescriptive easements are a legal risk on legacy OSP routes',
    'Identify the key elements of a recorded express easement document',
    'Apply the correct instrument choice to a given field scenario',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'prescriptive easement',
    'express easement',
    'license',
    'fee-simple acquisition',
    'dedication',
    'grantor',
    'grantee',
    'recording',
  ],
  vocabulary_assumed: [
    { term: 'ROW (right-of-way)', source_lesson_id: 'T09.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'landbase', source_lesson_id: 'T04.L03' },
    { term: 'GIS', source_lesson_id: 'T04.L03' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
  ],
  key_terms: [
    {
      term: 'prescriptive easement',
      definition:
        'A property right arising from continuous, open, and hostile use of someone else\'s land over a statutory period (commonly 10 years, varies by state). Not recorded at time of creation — emerges over time and is recorded after the fact or confirmed by court order.',
    },
    {
      term: 'express easement',
      definition:
        'A written, signed, and legally recorded agreement granting a specific party the right to use a defined strip of private land for a stated purpose (such as installing and maintaining fiber optic cable). Express easements are the gold standard for fiber routes across private property.',
    },
    {
      term: 'license',
      definition:
        'A revocable permission granted by a property owner allowing a specific party to use the property for a limited purpose. Unlike an easement, a license is personal, generally not recorded, and can be revoked at will by the property owner — making it a high-risk long-term access instrument.',
    },
    {
      term: 'fee-simple acquisition',
      definition:
        'The purchase of full ownership of a parcel or strip of land, conveying all property rights to the buyer. Fee-simple gives the acquirer absolute ownership and control, including the right to exclude others. Used for major OSP facilities (equipment buildings, splice vaults) where permanent exclusive use is required.',
    },
    {
      term: 'dedication',
      definition:
        'The voluntary transfer of private land to the public (city, county, state) for public use — typically as part of a subdivision or development approval. Dedicated ROW becomes public right-of-way, meaning fiber installers can use it under a standard encroachment permit rather than acquiring a private easement.',
    },
    {
      term: 'grantor',
      definition:
        'The property owner who grants the easement right to another party. The grantor signs the easement document and retains ownership of the underlying land while giving up specific use rights over the easement strip.',
    },
    {
      term: 'grantee',
      definition:
        'The party receiving the easement right — typically the telecommunications company or utility. The grantee gains the right to use, access, and maintain the easement strip for the stated purpose.',
    },
    {
      term: 'recording',
      definition:
        'The official filing of a signed easement document with the county recorder\'s office (or equivalent jurisdiction), creating a public record. Once recorded, the easement "runs with the land," meaning it survives property sales and binds future owners — the new owner cannot invalidate it.',
    },
  ],
};

export default function T09L07_RowEasementsPrivateProperty() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>ROW, Easements, and Private Property</h2>
        <p>
          Here's the situation every fiber project hits eventually: your designed route crosses someone's
          private land. Maybe it's a farm field, a parking lot, or the backyard of a subdivision. Before
          any crew touches a shovel, you need the legal right to be there — and the right instrument for
          that access matters enormously. Pick the wrong one and the property owner can throw you off the
          land mid-build, or worse, 15 years later after you've buried $2M of fiber under their pasture.
        </p>
        <p className="mt-2">
          This lesson covers the four instruments that create legal access to private land for OSP
          fiber projects: <strong>express easements</strong>, <strong>prescriptive easements</strong>,
          <strong>licenses</strong>, and <strong>fee-simple acquisitions</strong>. We'll also cover
          <strong> dedications</strong> — the mechanism that converts private land into public right-of-way.
          Each has different levels of enforceability, recordability, and risk.
        </p>

        <h3 className="mt-4">Plain English: What's the Difference?</h3>
        <p>
          Think of it like parking on someone's property:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            <strong>License:</strong> They tell you verbally "park here whenever you want." Works fine —
            until they change their mind and put up a fence. No paperwork, no protection.
          </li>
          <li>
            <strong>Express easement:</strong> You both sign a contract filed with the county that says
            "Fiber Corp has the right to park in spots 3–5 forever, or until the agreement expires."
            The new owner who buys the property in 10 years is bound by it too.
          </li>
          <li>
            <strong>Prescriptive easement:</strong> You park there every day for 10 years without
            permission. Eventually, a court says you've earned the right to keep parking there — even
            though you never had permission. This is a risky way to establish a route and a legal
            headache for everyone involved.
          </li>
          <li>
            <strong>Fee-simple:</strong> You buy the parking spots outright. You own them. Nobody
            can take them away.
          </li>
        </ul>
      </section>

      {/* FLASHCARDS */}
      <section data-tier="foundations">
        <h3>Key Terms — Flashcards</h3>
        <p>Review each term before continuing. These are the building blocks for the rest of this lesson.</p>
        {meta.key_terms.map(({ term, definition }) => (
          <Flashcard key={term} term={term} definition={definition} />
        ))}
      </section>

      <section data-tier="working">
        <h3>The Four Access Instruments in Detail</h3>

        <h4 className="mt-4 font-semibold">1. Express Easement — The Gold Standard</h4>
        <p>
          An <strong>express easement</strong> is a written, signed agreement between the property owner
          (the <em>grantor</em>) and the fiber company (the <em>grantee</em>) that describes exactly
          what land is being used, for what purpose, and for how long. It is signed, notarized, and
          <strong> recorded</strong> at the county recorder's office (or equivalent local government
          office in your jurisdiction — confirm your state's recording requirements with your attorney).
        </p>
        <p className="mt-2">
          Recording is the critical step. Once filed, the easement becomes part of the public land
          record. It "runs with the land" — when the property sells, the new owner is legally bound
          by the easement, even if they didn't know about it when they bought. This is what gives
          the fiber company long-term route security.
        </p>
        <p className="mt-2">
          A standard OSP fiber express easement document includes:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Grantor block:</strong> property owner's full legal name, address, and signature</li>
          <li><strong>Grantee block:</strong> fiber company's legal name (or its successors and assigns)</li>
          <li><strong>Legal description:</strong> the specific strip of land being granted, described by
            metes and bounds (compass bearings and distances), a recorded plat reference, or a
            surveyed centerline description — vague descriptions are a common source of later disputes</li>
          <li><strong>Purpose clause:</strong> what the easement is for ("for the installation,
            operation, maintenance, replacement, and removal of fiber optic cable and associated
            infrastructure")</li>
          <li><strong>Term:</strong> perpetual (most common for fiber routes) or term-limited (e.g.,
            30 years with renewal option)</li>
          <li><strong>Compensation:</strong> what the grantor is paid (often a one-time lump sum;
            nominal $1 is legally sufficient but typically replaced by fair market compensation for
            the land encumbrance)</li>
          <li><strong>Recording reference:</strong> the document/instrument number assigned when
            filed with the recorder</li>
        </ul>

        <p className="mt-4">
          <strong>Book vs. field practice:</strong> The textbook says "always obtain a recorded express
          easement before construction." In the field, small rural projects sometimes start with just
          a signed landowner permission letter (effectively a license) with the recorded easement
          to follow. This creates risk — if the landowner sells before the easement is recorded,
          the new owner may not honor the letter. The safest practice is to complete recording
          before any dirt moves.
        </p>

        <h4 className="mt-6 font-semibold">2. Prescriptive Easement — The Risky Legacy</h4>
        <p>
          A <strong>prescriptive easement</strong> arises not from a signed agreement but from behavior:
          a party has used someone else's land continuously, openly, and without permission for the
          period of time required by state law (commonly 10 years, but verify — this varies by state
          and you must confirm the statutory period with legal counsel or the relevant state code
          before relying on it).
        </p>
        <p className="mt-2">
          The critical word is <em>hostile</em> — meaning without the owner's permission.
          If the owner gave permission (even informally), the use is a license, not prescriptive.
        </p>
        <p className="mt-2">
          <strong>Why this matters for OSP engineers:</strong> Many older telephone and cable TV companies
          installed cables in the 1970s–1990s with nothing more than a handshake. Routes that have
          been in continuous operation for decades may rely on prescriptive easements that were never
          formally recorded. When you're doing a route survey for a new fiber overlay, and you find
          existing cables with no recorded easement documentation, you're looking at a prescriptive
          easement risk. The original installer may have assumed the prescriptive right — but if the
          property has changed hands, if there was a gap in continuous use, or if the use wasn't
          sufficiently "open and hostile," the right may not hold up.
        </p>
        <p className="mt-2">
          <strong>The practical problem:</strong> Prescriptive easements are not recorded automatically.
          They must be either confirmed by a court order (quiet title action) or consensually recorded
          after-the-fact through a separate agreement with the current landowner. Neither is cheap
          or fast.
        </p>
        <p className="mt-2">
          <strong>Action for engineers:</strong> When a route survey reveals cables with no easement
          documentation, flag it immediately. The project legal team needs to determine whether a
          prescriptive right exists, whether it's enforceable, and what steps are needed to either
          record it or replace it with a new express easement.
        </p>

        <h4 className="mt-6 font-semibold">3. License — Convenient but Risky</h4>
        <p>
          A <strong>license</strong> is a revocable permission from the property owner. Unlike an
          easement, it is:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Personal — it only binds the original owner, not future buyers</li>
          <li>Revocable — the property owner can withdraw it at any time (sometimes with notice,
            sometimes without)</li>
          <li>Generally not recorded — it may exist as a letter, an email, or a verbal agreement</li>
        </ul>
        <p className="mt-2">
          Licenses have legitimate uses: temporary access during a construction phase (e.g., a staging
          area license for the duration of the build), or access for a short-term evaluation (a test
          bore to evaluate soil conditions). They are not appropriate as the permanent access instrument
          for a fiber route that will be in service for 20–40 years.
        </p>

        <h4 className="mt-6 font-semibold">4. Fee-Simple Acquisition — Full Ownership</h4>
        <p>
          <strong>Fee-simple acquisition</strong> means purchasing the property outright. The fiber
          company becomes the fee owner — they own the land, not just the right to use it.
          This is used for:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Fiber huts, equipment buildings, and remote powered shelters where the company needs
            exclusive, permanent control</li>
          <li>Fiber splice vaults or amplifier sites in locations where an easement's "use rights"
            are insufficient for the operational footprint needed</li>
          <li>Situations where the landowner will not grant an easement and insists on a full sale</li>
        </ul>
        <p className="mt-2">
          Fee-simple is expensive (you're buying property, not just access rights) and is almost
          never used for linear route right-of-way. An easement accomplishes the same route-security
          goal at a fraction of the cost.
        </p>

        <h4 className="mt-6 font-semibold">5. Dedication — Private Land Becoming Public ROW</h4>
        <p>
          <strong>Dedication</strong> is what happens when a developer voluntarily gives land to the
          public as part of getting a subdivision or development approved. The streets, sidewalks,
          and utility corridors in a new subdivision are typically on dedicated ROW — the developer
          handed them over to the city or county as a condition of the plat approval.
        </p>
        <p className="mt-2">
          Once dedicated, the land becomes public ROW, and fiber installers access it through the
          normal municipal encroachment permitting process (covered in L06) rather than negotiating
          private easements. This simplifies the permitting layer for build-outs in new subdivisions.
        </p>
      </section>

      {/* ANNOTATED DIAGRAM: recorded express easement document */}
      <section data-tier="working">
        <h3>Reading a Recorded Easement Document</h3>
        <p>
          The annotated diagram below shows the key sections of a typical recorded express easement
          document for a fiber optic route. Click each labeled section to see what it means and
          what to look for when reviewing one in the field.
        </p>
        <AnnotatedDiagram
          id="T09L07-easement-doc"
          title="Recorded Express Easement Document — Key Sections"
          description="An express easement document filed with the county recorder. Click each labeled area to understand the purpose and what problems to look for."
          width={700}
          height={520}
          imageAlt="Schematic diagram of a recorded express easement document for fiber optic cable"
          svgContent={
            <g>
              {/* Document background */}
              <rect x={20} y={10} width={660} height={500} rx={6} fill="#fafaf8" stroke="#c8c0a8" strokeWidth={1.5} />
              {/* Title bar */}
              <rect x={20} y={10} width={660} height={40} rx={6} fill="#d4c9a8" />
              <text x={350} y={36} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#2d2a1e">EASEMENT FOR FIBER OPTIC CABLE INSTALLATION AND MAINTENANCE</text>
              {/* Grantor block */}
              <rect x={40} y={65} width={300} height={90} rx={4} fill="#e8f0e8" stroke="#7aaa7a" strokeWidth={1.2} />
              <text x={50} y={85} fontSize={11} fontWeight="bold" fill="#1a4a1a">GRANTOR:</text>
              <text x={50} y={102} fontSize={10} fill="#333">John A. Smith and Mary B. Smith,</text>
              <text x={50} y={117} fontSize={10} fill="#333">husband and wife, as joint tenants</text>
              <text x={50} y={132} fontSize={10} fill="#333">1234 County Road 40</text>
              <text x={50} y={147} fontSize={10} fill="#333">Macon, GA 31201</text>
              {/* Grantor label */}
              <circle cx={200} cy={110} r={10} fill="#2d7a2d" opacity={0.9} />
              <text x={200} y={114} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">1</text>

              {/* Grantee block */}
              <rect x={360} y={65} width={300} height={90} rx={4} fill="#e8eef8" stroke="#7a8aaa" strokeWidth={1.2} />
              <text x={370} y={85} fontSize={11} fontWeight="bold" fill="#1a1a4a">GRANTEE:</text>
              <text x={370} y={102} fontSize={10} fill="#333">Launch Fiber Services, LLC,</text>
              <text x={370} y={117} fontSize={10} fill="#333">a Georgia limited liability company,</text>
              <text x={370} y={132} fontSize={10} fill="#333">its successors and assigns</text>
              <circle cx={510} cy={110} r={10} fill="#2d4a8a" opacity={0.9} />
              <text x={510} y={114} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">2</text>

              {/* Purpose clause */}
              <rect x={40} y={170} width={620} height={55} rx={4} fill="#f8f0e8" stroke="#aa8a4a" strokeWidth={1.2} />
              <text x={50} y={188} fontSize={11} fontWeight="bold" fill="#4a3a1a">PURPOSE:</text>
              <text x={50} y={203} fontSize={10} fill="#333">For the installation, operation, maintenance, replacement, repair, inspection, and removal of fiber optic</text>
              <text x={50} y={218} fontSize={10} fill="#333">cable, conduit, handholes, splice enclosures, and associated infrastructure, including the right to access</text>
              <circle cx={648} cy={197} r={10} fill="#8a6a2a" opacity={0.9} />
              <text x={648} y={201} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">3</text>

              {/* Legal description */}
              <rect x={40} y={240} width={620} height={80} rx={4} fill="#f0e8f8" stroke="#8a5aaa" strokeWidth={1.2} />
              <text x={50} y={258} fontSize={11} fontWeight="bold" fill="#3a1a5a">LEGAL DESCRIPTION OF EASEMENT STRIP:</text>
              <text x={50} y={274} fontSize={10} fill="#333">A strip of land ten (10) feet in width, five (5) feet on each side of the following described centerline:</text>
              <text x={50} y={289} fontSize={10} fill="#333">Commencing at a point on the north property line of the above parcel, said point being 150 feet west of the</text>
              <text x={50} y={304} fontSize={10} fill="#333">northeast corner; thence S 12°30'15" W a distance of 412.7 feet to the south property line...</text>
              <circle cx={648} cy={272} r={10} fill="#6a2a9a" opacity={0.9} />
              <text x={648} y={276} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">4</text>

              {/* Term and compensation */}
              <rect x={40} y={335} width={295} height={65} rx={4} fill="#f8e8e8" stroke="#aa4a4a" strokeWidth={1.2} />
              <text x={50} y={353} fontSize={11} fontWeight="bold" fill="#5a1a1a">TERM:</text>
              <text x={50} y={370} fontSize={10} fill="#333">Perpetual, running with the land,</text>
              <text x={50} y={385} fontSize={10} fill="#333">and binding on all future owners</text>
              <text x={50} y={395} fontSize={10} fill="#444">Compensation: $1,500.00 (one-time)</text>
              <circle cx={200} cy={365} r={10} fill="#9a2a2a" opacity={0.9} />
              <text x={200} y={369} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">5</text>

              {/* Recording reference */}
              <rect x={355} y={335} width={305} height={65} rx={4} fill="#e8f8f0" stroke="#4aaa6a" strokeWidth={1.2} />
              <text x={365} y={353} fontSize={11} fontWeight="bold" fill="#1a5a3a">RECORDING REFERENCE:</text>
              <text x={365} y={370} fontSize={10} fill="#333">Filed: Bibb County, GA Deed Book 4817</text>
              <text x={365} y={385} fontSize={10} fill="#333">Page 332 — Instrument No. 2024-014752</text>
              <text x={365} y={395} fontSize={10} fill="#444">Recorded: March 14, 2024</text>
              <circle cx={540} cy={365} r={10} fill="#2a8a5a" opacity={0.9} />
              <text x={540} y={369} textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">6</text>

              {/* Signature line */}
              <rect x={40} y={415} width={620} height={80} rx={4} fill="#f5f5f5" stroke="#aaaaaa" strokeWidth={1} />
              <text x={50} y={435} fontSize={10} fill="#555">GRANTOR SIGNATURE: _____________________________ Date: _____________</text>
              <text x={50} y={455} fontSize={10} fill="#555">NOTARIZED BY: __________________________________ Date: _____________</text>
              <text x={50} y={475} fontSize={10} fill="#555">GRANTEE REPRESENTATIVE: _______________________ Title: ______________</text>
            </g>
          }
          hotspots={[
            {
              id: 'hs-grantor',
              x: 190,
              y: 100,
              label: '1',
              title: 'Grantor Block',
              description:
                'The grantor is the property owner giving up the use right. Both spouses must sign if both hold ownership. "Joint tenants" means they both own it equally and both must consent — if only one signs, the easement may be voidable. Always verify the county property records to confirm who actually holds title before drafting the easement.',
            },
            {
              id: 'hs-grantee',
              x: 500,
              y: 100,
              label: '2',
              title: 'Grantee Block',
              description:
                '"Its successors and assigns" is critical. This language means the easement right passes to any company that acquires Launch Fiber Services, LLC in the future — through a sale, merger, or restructuring. Without it, the easement right might die with the original grantee entity, forcing a new negotiation every time the company structure changes.',
            },
            {
              id: 'hs-purpose',
              x: 638,
              y: 187,
              label: '3',
              title: 'Purpose Clause',
              description:
                'The purpose clause defines exactly what the grantee can do on the easement strip. Note it includes "replacement" and "removal" — without these, the company might lack the legal right to upgrade the cable or pull it out at end of life. Field practice note: some older easements say only "for communications purposes" without listing specific infrastructure. When the company installs a new fiber type or adds a handhole, does the old language cover it? Often unclear. Modern easements enumerate the infrastructure explicitly.',
            },
            {
              id: 'hs-legal-desc',
              x: 638,
              y: 262,
              label: '4',
              title: 'Legal Description of Easement Strip',
              description:
                'This is the most technically precise part of the document — and the most common source of disputes. "10 feet wide, 5 feet on each side of the centerline" is the easement strip. The metes-and-bounds description (compass bearings and distances) must be survey-accurate. If the description is vague ("along the east fence line") and the fence moves, the easement location becomes disputed. For RUS-funded projects, a licensed surveyor typically prepares the legal description. For smaller projects, a GPS-coordinate-based centerline description may be acceptable — confirm with your state\'s recording requirements.',
            },
            {
              id: 'hs-term',
              x: 190,
              y: 355,
              label: '5',
              title: 'Term and Compensation',
              description:
                '"Perpetual, running with the land" is the standard language for fiber routes. It means the easement has no expiration date and transfers to every subsequent property owner. Compensation is a one-time payment to the grantor for encumbering the property. $1,500 is representative for a residential parcel; commercial or agricultural parcels with significant acreage may command more. The one-time payment is not a rent — the grantee does not pay again when the cable is replaced or the company is sold.',
            },
            {
              id: 'hs-recording',
              x: 530,
              y: 355,
              label: '6',
              title: 'Recording Reference',
              description:
                'The recording reference (Deed Book + Page + Instrument Number + Date) is the key to finding this easement in the public record. This number appears in the county\'s GIS land records, title searches, and any future easement amendments. File this number in your project documentation immediately after recording — it\'s how you prove the easement exists if the original document is lost. The Bibb County, GA example is illustrative; recording fees, office names, and reference formats vary by jurisdiction.',
            },
          ]}
        />
      </section>

      <section data-tier="advanced">
        <h3>Enforceability Comparison Table</h3>
        <p>
          Use this table when evaluating what access instrument is appropriate for a given scenario.
          "Runs with land" means future property owners are bound by it even if they didn't sign it.
        </p>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2">Instrument</th>
                <th className="border border-gray-300 px-3 py-2">Recorded?</th>
                <th className="border border-gray-300 px-3 py-2">Runs with land?</th>
                <th className="border border-gray-300 px-3 py-2">Revocable?</th>
                <th className="border border-gray-300 px-3 py-2">Best used for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">Express easement</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">No (unless term-limited)</td>
                <td className="border border-gray-300 px-3 py-2">Permanent fiber routes</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-medium">Prescriptive easement</td>
                <td className="border border-gray-300 px-3 py-2 text-yellow-700">No (until court confirms)</td>
                <td className="border border-gray-300 px-3 py-2 text-yellow-700">Disputed</td>
                <td className="border border-gray-300 px-3 py-2 text-yellow-700">Disputed</td>
                <td className="border border-gray-300 px-3 py-2">Legacy audits only — not a design tool</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">License</td>
                <td className="border border-gray-300 px-3 py-2 text-red-700">Generally no</td>
                <td className="border border-gray-300 px-3 py-2 text-red-700">No</td>
                <td className="border border-gray-300 px-3 py-2 text-red-700">Yes — at will</td>
                <td className="border border-gray-300 px-3 py-2">Temporary construction access only</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-medium">Fee-simple</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes (deed)</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes (you own it)</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">No</td>
                <td className="border border-gray-300 px-3 py-2">Equipment buildings, node sites</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">Dedication</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes (plat)</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">Yes (public ROW)</td>
                <td className="border border-gray-300 px-3 py-2 text-green-700">No</td>
                <td className="border border-gray-300 px-3 py-2">New subdivisions — encroachment permit replaces easement</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Book vs. Field: The Prescriptive Easement Problem on Legacy Routes</h3>
        <p>
          <strong>Book:</strong> A prescriptive easement arises automatically after the statutory period
          (commonly 10 years — confirm your state's specific period with legal counsel before relying on
          any specific number) of continuous, open, hostile, and actual use. It is a legally recognized
          property right.
        </p>
        <p className="mt-2">
          <strong>Field:</strong> In practice, prescriptive easements on legacy OSP routes are a
          legal liability that experienced project managers flag immediately. Here's why:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Not recorded = no public notice.</strong> A title search won't reveal a prescriptive
            easement unless it's been confirmed by court order and recorded afterward. Buyers of the
            property may not know it exists.
          </li>
          <li>
            <strong>The "hostile use" element is contested.</strong> If the original cable installation
            had any permission — verbal, handshake, anything — the use was licensed, not hostile.
            Many old installations had at least informal permission, which kills the prescriptive
            easement theory entirely.
          </li>
          <li>
            <strong>Gap in use resets the clock.</strong> If the cable was cut, abandoned, or the
            company didn't maintain the route continuously, the prescriptive period may need to
            restart. A 5-year gap in active use in a 12-year-old cable route? The prescriptive
            right may not have matured.
          </li>
          <li>
            <strong>Property sales don't transfer disputed rights.</strong> When a prescriptive
            easement hasn't been recorded, the new owner can dispute it — sometimes successfully,
            leaving the fiber company with a cable in the ground and no legal right to maintain it.
          </li>
        </ul>
        <p className="mt-2">
          <strong>The right action:</strong> When route survey reveals cables with no recorded easements,
          the project team should work with legal counsel to either (a) negotiate a new express easement
          with the current landowner, (b) pursue a quiet title action to formally establish and record
          the prescriptive right, or (c) reroute to avoid the unprotected segment. Do not assume the
          prescriptive right is solid until an attorney has reviewed the specific facts.
        </p>
      </section>

      {/* QUIZ */}
      <Quiz
        title="L07 Practice Quiz — ROW, Easements, and Private Property"
        mode="multiple-choice"
        questions={[
          {
            id: 'T09-L07-Q01',
            type: 'mc',
            prompt:
              'A fiber company wants to build a route across a farmer\'s field. The farmer agrees verbally to let them cross his land "anytime." The project manager treats this as the permanent legal instrument for the route. What is the primary risk?',
            choices: [
              'None — verbal agreements are legally binding in all states for real property access',
              'A verbal license is revocable at will and does not bind future property owners. If the farmer sells the land or changes his mind, the fiber company has no enforceable right to maintain the cable',
              'The risk is only that the company cannot charge the farmer for using his land',
              'Verbal agreements are sufficient for routes under 1 mile in length',
            ],
            answerIndex: 1,
            explanation:
              'A verbal permission is a license — revocable at will and personal to the original owner. When the farmer dies, sells, or simply changes his mind, the fiber company has no recorded instrument to enforce. The correct approach is a signed, notarized, and recorded express easement before construction begins. T09.L07.',
          },
          {
            id: 'T09-L07-Q02',
            type: 'dragdrop',
            prompt:
              'Match each access instrument to its most accurate description.',
            items: [
              { id: 'express', label: 'Express easement' },
              { id: 'prescriptive', label: 'Prescriptive easement' },
              { id: 'license', label: 'License' },
              { id: 'fee-simple', label: 'Fee-simple acquisition' },
            ],
            targets: [
              {
                id: 'tgold',
                label:
                  'Recorded, perpetual use right — the gold standard for permanent fiber routes',
              },
              {
                id: 'tlegacy',
                label:
                  'Arises from long-term hostile use without permission; not recorded at creation; a legal risk on legacy routes',
              },
              {
                id: 'ttemp',
                label:
                  'Revocable permission, personal to the original owner, not recorded — appropriate for temporary construction access only',
              },
              {
                id: 'towned',
                label:
                  'Full ownership of the land conveyed by deed — used for equipment buildings and node sites',
              },
            ],
            correctMap: {
              tgold: 'express',
              tlegacy: 'prescriptive',
              ttemp: 'license',
              towned: 'fee-simple',
            },
            explanation:
              'Express easement = recorded, perpetual, runs with land — the standard instrument for fiber routes. Prescriptive = hostile long-term use, not recorded, legally risky on legacy routes. License = revocable at will, personal, temporary access only. Fee-simple = full ownership, used for major facilities. T09.L07.',
          },
          {
            id: 'T09-L07-Q03',
            type: 'mc',
            prompt:
              'A route survey reveals an 18-year-old coaxial cable buried across private farmland with no recorded easement. The property has changed ownership twice since the cable was installed. What should the project team do FIRST?',
            choices: [
              'Proceed with the fiber installation since the cable has been there long enough to establish a prescriptive easement',
              'Flag the unrecorded segment to legal counsel for evaluation — the prescriptive right may or may not exist depending on the original installation circumstances, and the property sales may have complicated the claim',
              'Contact the original cable installer and ask them to sign a retroactive easement',
              'Install the fiber using the existing cable trench and rely on the "shared conduit" exception to easement requirements',
            ],
            answerIndex: 1,
            explanation:
              '18 years may exceed a state\'s prescriptive period, but that\'s not enough on its own. The original installation may have had permission (making it a license, not prescriptive), there may have been gaps in continuous use, and two property sales may have complicated the chain. Legal counsel must evaluate the specific facts before the team relies on a prescriptive right. Do not assume it exists. T09.L07.',
          },
          {
            id: 'T09-L07-Q04',
            type: 'mc',
            prompt:
              'On a recorded express easement document, what does the phrase "its successors and assigns" in the grantee block accomplish?',
            choices: [
              'It requires the fiber company to notify the grantor before selling the cable',
              'It ensures the easement right passes to any future owner or acquirer of the fiber company, rather than dying with the original legal entity that signed the agreement',
              'It allows the grantor to assign the easement to a third party',
              'It requires the fiber company to pay the grantor every time the cable is upgraded',
            ],
            answerIndex: 1,
            explanation:
              '"Successors and assigns" means the easement right travels with the grantee company through any sale, merger, or restructuring — the new owner of the fiber company inherits the easement automatically. Without this language, the easement might only belong to the exact legal entity that signed it. T09.L07.',
          },
          {
            id: 'T09-L07-Q05',
            type: 'mc',
            prompt:
              'A fiber company needs to install a remote power node shelter (10 ft × 12 ft permanent building with utility service) in a rural area. A landowner agrees to allow it. Which access instrument is most appropriate?',
            choices: [
              'Express easement over a 10 ft × 12 ft footprint — same as a linear cable route',
              'License — a building permit from the county is sufficient without a property agreement',
              'Fee-simple acquisition of the parcel footprint, or a long-term recorded easement with exclusive occupancy rights, since the company needs permanent exclusive control of that space',
              'Prescriptive easement — the company will be there long enough to establish one',
            ],
            answerIndex: 2,
            explanation:
              'A permanent equipment building requires exclusive, long-term control. A standard cable-route easement grants "use rights" for a linear corridor — it may not give exclusive occupancy rights for a building footprint. Fee-simple acquisition (full ownership) is the cleanest solution. An easement with explicit exclusive occupancy and building rights is an acceptable alternative if the landowner will not sell. A license is revocable and unacceptable for a permanent structure. T09.L07.',
          },
        ]}
        onComplete={(result) => {
          console.info('T09 L07 Quiz complete:', result);
        }}
      />

    </LessonLayout>
  );
}
