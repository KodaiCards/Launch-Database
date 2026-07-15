// T09.L07 — ROW, Easements, and Private Property
// Working lesson: private-property access instruments — easements, licenses, fee-simple, dedication
// Sources: M02 §2.7 (ROW/easements); net-new (express easement, fee-simple, dedication)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
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
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'landbase', source_lesson_id: 'T04.L03' },
    { term: 'GIS', source_lesson_id: 'T01.L08' },
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

export const vocabulary_introduced = meta.vocabulary_introduced;

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
        <Flashcard
          deckId="T09-L07"
          cards={[
            {
              id: 'T09-L07-fc-prescriptive',
              front: 'What is a prescriptive easement and why is it risky for OSP routes?',
              back: 'A property right arising from continuous, open, and hostile use of someone else\'s land over a statutory period (commonly 10 years, varies by state). Not recorded at time of creation — emerges over time and is recorded after the fact or confirmed by court order. Risky because it relies on historical use rather than documented agreement.',
            },
            {
              id: 'T09-L07-fc-express',
              front: 'What is an express easement and why is it the gold standard for fiber routes?',
              back: 'A written, signed, and legally recorded agreement granting a specific party the right to use a defined strip of private land for a stated purpose (such as installing and maintaining fiber optic cable). Express easements are the gold standard for fiber routes across private property because they are recorded and bind future property owners.',
            },
            {
              id: 'T09-L07-fc-license',
              front: 'What is a license (property access) and what makes it high-risk for long-term OSP?',
              back: 'A revocable permission granted by a property owner allowing a specific party to use the property for a limited purpose. Unlike an easement, a license is personal, generally not recorded, and can be revoked at will by the property owner — making it a high-risk long-term access instrument.',
            },
            {
              id: 'T09-L07-fc-fee-simple',
              front: 'What is fee-simple acquisition and when is it used in OSP?',
              back: 'The purchase of full ownership of a parcel or strip of land, conveying all property rights to the buyer. Fee-simple gives the acquirer absolute ownership and control, including the right to exclude others. Used for major OSP facilities (equipment buildings, splice vaults) where permanent exclusive use is required.',
            },
            {
              id: 'T09-L07-fc-dedication',
              front: 'What is dedication and how does it relate to public ROW?',
              back: 'The voluntary transfer of private land to the public (city, county, state) for public use — typically as part of a subdivision or development approval. Dedicated ROW becomes public right-of-way, meaning fiber installers can use it under a standard encroachment permit rather than acquiring a private easement.',
            },
            {
              id: 'T09-L07-fc-grantor',
              front: 'In an easement, who is the grantor?',
              back: 'The property owner who grants the easement right to another party. The grantor signs the easement document and retains ownership of the underlying land while giving up specific use rights over the easement strip.',
            },
            {
              id: 'T09-L07-fc-grantee',
              front: 'In an easement, who is the grantee?',
              back: 'The party receiving the easement right — typically the telecommunications company or utility. The grantee gains the right to use, access, and maintain the easement strip for the stated purpose.',
            },
            {
              id: 'T09-L07-fc-recording',
              front: 'What does "recording" an easement mean and why does it matter?',
              back: 'The official filing of a signed easement document with the county recorder\'s office (or equivalent jurisdiction), creating a public record. Once recorded, the easement "runs with the land," meaning it survives property sales and binds future owners — the new owner cannot invalidate it.',
            },
          ]}
        />
      </section>

      <section data-tier="foundations">
        <h3>Check Your Understanding</h3>
        <Quiz
          questions={[
            {
              id: 'T09-L07-Q1',
              question: 'Which access instrument is the gold standard for long-term fiber routes across private property because it is recorded and binds future owners?',
              options: [
                'License',
                'Express easement',
                'Prescriptive easement',
                'Fee-simple acquisition',
              ],
              answerIndex: 1,
            },
            {
              id: 'T09-L07-Q2',
              question: 'What makes a prescriptive easement risky for OSP engineers to rely on when they find existing cables with no recorded easement documentation?',
              options: [
                'It is always illegal in all states',
                'It was never formally recorded, relied on historical use, and may not hold up if property changed hands or continuous use was interrupted',
                'It requires payment to the county',
                'It only lasts 5 years',
              ],
              answerIndex: 1,
            },
            {
              id: 'T09-L07-Q3',
              question: 'What is the critical difference between an easement and a license?',
              options: [
                'An easement is personal and revocable; a license runs with the land',
                'A license is recorded; an easement is not recorded',
                'An easement is recorded and runs with the land; a license is revocable and personal to the owner',
                'There is no difference',
              ],
              answerIndex: 2,
            },
            {
              id: 'T09-L07-Q4',
              question: 'When is fee-simple acquisition typically used in OSP projects?',
              options: [
                'For all linear route right-of-way because it provides the most security',
                'For fiber huts, equipment buildings, and splice vaults where exclusive control is needed',
                'Never — it is not a valid access instrument',
                'Only for temporary construction access',
              ],
              answerIndex: 1,
            },
            {
              id: 'T09-L07-Q5',
              question: 'What does it mean for an easement to "run with the land"?',
              options: [
                'It must be physically located on a road',
                'It survives property sales and binds future owners to the same terms',
                'It expires after the current property owner sells',
                'It requires annual renewal',
              ],
              answerIndex: 1,
            },
          ]}
        />
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

      </LessonLayout>
  );
}
