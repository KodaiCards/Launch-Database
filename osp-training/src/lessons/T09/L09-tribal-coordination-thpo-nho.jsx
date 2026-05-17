// T09.L09 — Tribal Coordination — THPO and NHO
// Working lesson: THPO vs. SHPO; NHO consultation; government-to-government protocol
// Sources: M03 §3.3 callout; ACHP Section 106 Tribal Handbook (public); 36 CFR §800.2(c)(2)(ii)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L09',
  course_id: 'T09',
  title: 'Tribal Coordination — THPO and NHO',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T09.L03'],
  learning_objectives: [
    'Explain when a THPO replaces SHPO in the Section 106 consultation process',
    'Identify when NHO consultation applies and why it differs from THPO consultation',
    'Describe why government-to-government consultation can extend the Section 106 timeline beyond 30 days',
    'Apply the THPO vs. SHPO trigger to a given project scenario',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'THPO',
    'NHO (Native Hawaiian Organization)',
    'government-to-government consultation',
    'sacred sites',
    'government-to-government protocol',
    'ACHP Tribal Handbook',
  ],
  vocabulary_assumed: [
    { term: 'NHPA §106', source_lesson_id: 'T09.L03' },
    { term: 'SHPO', source_lesson_id: 'T09.L03' },
    { term: 'APE (Area of Potential Effect)', source_lesson_id: 'T09.L03' },
    { term: 'finding of effect', source_lesson_id: 'T09.L03' },
    { term: '30-day clock', source_lesson_id: 'T09.L03' },
    { term: 'consulting party', source_lesson_id: 'T09.L03' },
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
  ],
  key_terms: [
    {
      term: 'THPO',
      definition:
        'Tribal Historic Preservation Officer — the official designated by a federally recognized tribe to perform functions equivalent to the State Historic Preservation Officer (SHPO) for historic properties on tribal lands or within a tribe\'s area of traditional cultural concern. When a THPO has been designated, the tribe assumes SHPO-equivalent authority for the Section 106 process on their lands.',
    },
    {
      term: 'NHO (Native Hawaiian Organization)',
      definition:
        'An organization that serves and represents the interests of Native Hawaiians, as defined under the National Historic Preservation Act. NHOs are consulting parties in the Section 106 process for undertakings affecting historic properties in Hawaii or affecting Native Hawaiian ancestral, cultural, or religious sites outside Hawaii.',
    },
    {
      term: 'government-to-government consultation',
      definition:
        'A formal consultation process conducted between the federal government (or its delegated lead agency) and a sovereign tribal government or NHO. Reflects the government-to-government relationship between the United States and federally recognized tribes. This protocol is distinct from consulting with a SHPO — tribal governments have nation-to-nation standing, which typically requires more formal communication, dedicated staff time, and longer timelines.',
    },
    {
      term: 'sacred sites',
      definition:
        'Specific geographic locations of established religious or cultural significance to a tribal community, designated under the tribal government\'s own traditional practices and beliefs. Executive Order 13007 (Indian Sacred Sites) directs federal agencies to accommodate access to and ceremonial use of sacred sites, and to avoid adversely affecting their physical integrity. Fiber routes through or near sacred sites can trigger additional consultation beyond the standard Section 106 process.',
    },
    {
      term: 'government-to-government protocol',
      definition:
        'A written or established set of procedures defining how formal government-to-government consultation is conducted between a federal agency and a tribal nation. Typically specifies: who contacts whom (level of federal official required), what documentation is required, timelines for response, and how disagreements are escalated. Many tribes publish their own consultation protocols on tribal government websites.',
    },
    {
      term: 'ACHP Tribal Handbook',
      definition:
        'The Advisory Council on Historic Preservation\'s publication "Consultation with Indian Tribes in the Section 106 Review Process: A Handbook" — a publicly available guidance document explaining tribal consultation requirements, timing, and best practices under Section 106 of the NHPA. Available at achp.gov (verify current edition at time of project execution).',
    },
  ],
};

export default function T09L09_TribalCoordinationThpoNho() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>Tribal Coordination — THPO and NHO</h2>
        <p>
          Section 106 of the National Historic Preservation Act (NHPA) — which you covered in L03 —
          requires federal agencies to consult with stakeholders when a federal undertaking (including
          a BEAD-funded or RUS-funded fiber project) could affect historic properties. You learned that
          the SHPO (State Historic Preservation Officer) is the primary consulting party. But there
          are two situations where the SHPO is either replaced or supplemented by different parties:
          when the project affects tribal lands or areas of tribal cultural concern, and when the
          project affects Native Hawaiian interests.
        </p>
        <p className="mt-2">
          Getting these distinctions right isn't just a compliance checkbox — it's a matter of
          respecting sovereign nations and their cultural heritage. Tribal governments have constitutional
          and treaty-based standing that is qualitatively different from a state agency or a local
          historical society. The consultation process reflects that.
        </p>

        <h3 className="mt-4">The Short Version</h3>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>SHPO:</strong> State Historic Preservation Officer. The primary Section 106
            consulting party for most undertakings. State government agency.
          </li>
          <li>
            <strong>THPO:</strong> Tribal Historic Preservation Officer. Replaces the SHPO's role
            when the project is on tribal lands (and the tribe has an approved THPO program).
            Outside tribal lands, THPOs are consulting parties alongside the SHPO.
          </li>
          <li>
            <strong>NHO:</strong> Native Hawaiian Organization. The consulting party for
            undertakings affecting Native Hawaiian cultural heritage — primarily in Hawaii, but
            also for sites in other states that have established Native Hawaiian cultural
            significance.
          </li>
        </ul>

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
              <td className="px-3 py-2 font-mono">THPO</td>
              <td className="px-3 py-2">Tribal Historic Preservation Officer</td>
              <td className="px-3 py-2">The tribal equivalent of the SHPO; assumes SHPO role on tribal lands when an approved program exists</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NHO</td>
              <td className="px-3 py-2">Native Hawaiian Organization</td>
              <td className="px-3 py-2">Representative body for Native Hawaiian interests in NHPA Section 106 consultation</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">BIA</td>
              <td className="px-3 py-2">Bureau of Indian Affairs</td>
              <td className="px-3 py-2">Federal agency maintaining tribal land boundary information and area-of-concern data</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NATHPO</td>
              <td className="px-3 py-2">National Association of Tribal Historic Preservation Officers</td>
              <td className="px-3 py-2">Maintains the THPO directory used to identify which tribes have approved THPO programs</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ACHP</td>
              <td className="px-3 py-2">Advisory Council on Historic Preservation</td>
              <td className="px-3 py-2">Federal agency that publishes the Section 106 Tribal Handbook and oversees NHPA §106 compliance</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FLASHCARDS */}
      <section data-tier="foundations">
        <h3>Key Terms — Flashcards</h3>
        <Flashcard
          deckId="T09-L09"
          cards={[
            {
              id: 'T09-L09-fc-thpo',
              front: 'What is a THPO and when does it replace the SHPO in Section 106?',
              back: 'Tribal Historic Preservation Officer — the official designated by a federally recognized tribe to perform functions equivalent to the SHPO for historic properties on tribal lands or within a tribe\'s area of traditional cultural concern. When a THPO has been designated, the tribe assumes SHPO-equivalent authority for the Section 106 process on their lands.',
            },
            {
              id: 'T09-L09-fc-nho',
              front: 'What is an NHO and when does NHO consultation apply?',
              back: 'Native Hawaiian Organization — an organization that serves and represents the interests of Native Hawaiians under the NHPA. NHOs are consulting parties in the Section 106 process for undertakings affecting historic properties in Hawaii or affecting Native Hawaiian ancestral, cultural, or religious sites outside Hawaii.',
            },
            {
              id: 'T09-L09-fc-g2g',
              front: 'What is government-to-government consultation and why does it differ from SHPO consultation?',
              back: 'A formal consultation process conducted between the federal government and a sovereign tribal government or NHO. Reflects the nation-to-nation relationship between the United States and federally recognized tribes. Distinct from SHPO consultation — tribal governments have sovereign standing that typically requires more formal communication, higher-level federal officials, and longer timelines.',
            },
            {
              id: 'T09-L09-fc-sacred-sites',
              front: 'What are sacred sites and what federal protection applies?',
              back: 'Specific geographic locations of established religious or cultural significance to a tribal community. Executive Order 13007 (Indian Sacred Sites) directs federal agencies to accommodate access to and ceremonial use of sacred sites, and to avoid adversely affecting their physical integrity. Fiber routes through or near sacred sites can trigger additional consultation beyond the standard Section 106 process.',
            },
            {
              id: 'T09-L09-fc-protocol',
              front: 'What is a government-to-government protocol?',
              back: 'A written or established set of procedures defining how formal government-to-government consultation is conducted between a federal agency and a tribal nation. Specifies who contacts whom, what documentation is required, timelines for response, and how disagreements are escalated. Many tribes publish their own consultation protocols on tribal government websites.',
            },
            {
              id: 'T09-L09-fc-achp-handbook',
              front: 'What is the ACHP Tribal Handbook?',
              back: 'The Advisory Council on Historic Preservation\'s publication "Consultation with Indian Tribes in the Section 106 Review Process: A Handbook" — a publicly available guidance document explaining tribal consultation requirements, timing, and best practices under Section 106 of the NHPA. Available at achp.gov (verify current edition at time of project execution).',
            },
          ]}
        />
      </section>

      <section data-tier="working">
        <h3>THPO: When Tribes Replace the SHPO</h3>
        <p>
          Under the NHPA (54 USC § 302702 and § 302706), a federally recognized tribe can establish
          a <strong>Tribal Historic Preservation Office (THPO)</strong> and formally assume the SHPO's
          responsibilities for historic preservation on tribal lands. When a tribe has an approved
          THPO program:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            For undertakings on tribal land: the THPO assumes the SHPO's role as the primary consulting
            party. The SHPO is still notified but the THPO leads the tribal land review.
          </li>
          <li>
            For undertakings OUTSIDE tribal land that may affect tribal cultural interests (ancestral
            sites, traditional cultural properties, areas of tribal historical concern): the THPO is
            an additional consulting party alongside the SHPO — not a replacement.
          </li>
        </ul>
        <p className="mt-2">
          As of the publication of this lesson, approximately 200 tribes have designated THPOs.
          Not all federally recognized tribes (currently 574 recognized tribes) have established
          THPO programs — for tribes without a THPO, the federal lead agency still consults with
          the SHPO, and may additionally consult with the tribe's elected leadership or cultural
          preservation staff directly.
        </p>
        <p className="mt-2">
          <strong>How to find out if a THPO applies to your project area:</strong>
          The National Conference of State Historic Preservation Officers (NCSHPO) and the
          National Association of Tribal Historic Preservation Officers (NATHPO) maintain
          directories of recognized THPOs. The ACHP's "Section 106 Tribal Handbook"
          (available at achp.gov — verify current edition) provides step-by-step guidance on
          identifying and engaging THPOs.
        </p>

        <h3 className="mt-6">NHO: Native Hawaiian Organizations</h3>
        <p>
          For projects in Hawaii, or for projects anywhere in the United States that may affect
          cultural or ancestral sites of significance to Native Hawaiians, the Section 106 process
          requires consultation with <strong>Native Hawaiian Organizations (NHOs)</strong>.
        </p>
        <p className="mt-2">
          Unlike the tribal framework (which applies to federally recognized tribal nations),
          NHO consultation in Hawaii operates under a somewhat different legal framework because
          Native Hawaiians are not organized as federally recognized sovereign tribes. Instead,
          NHOs serve as the representative entities for Native Hawaiian interests in the NHPA
          process. 36 CFR §800.2(c)(2)(ii) defines the NHO consulting party role.
        </p>
        <p className="mt-2">
          <strong>When does NHO consultation apply to a fiber project?</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            Any project in Hawaii with a federal nexus (BEAD, RUS, HUD, FHWA involvement) that
            could affect historic properties — NHOs must be identified and consulted.
          </li>
          <li>
            Projects on the continental U.S. that cross or approach documented sites of Native
            Hawaiian ancestral or cultural significance — relatively uncommon but possible near
            sites like heiau (temples) or burial sites outside Hawaii.
          </li>
          <li>
            Projects in offshore areas (submarine cables) approaching Hawaii — consult the ACHP
            handbook for guidance on offshore federal undertakings.
          </li>
        </ul>

        <h3 className="mt-6">Government-to-Government Consultation: Why It Takes Longer</h3>
        <p>
          The phrase "government-to-government consultation" reflects a constitutional and legal
          reality: federally recognized tribes are sovereign nations, not advocacy groups or
          interest parties. The United States has a trust responsibility to tribal nations derived
          from treaties, federal statutes, and Supreme Court decisions. This means tribal consultation
          in the Section 106 process is not the same as consulting a local historical society.
        </p>
        <p className="mt-2">
          <strong>Practical differences from SHPO consultation:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Level of federal official required.</strong> Some tribes require that the
            federal consultation letter be signed by a specified level of federal official
            (e.g., a Regional Administrator or agency head), not just a staff planner.
            Sending the wrong level of correspondence can trigger a restart.
          </li>
          <li>
            <strong>Formal protocol adherence.</strong> Many tribes publish consultation protocols
            on their websites specifying exactly how they want to be contacted, what information
            they need, and how much time they require to respond. Following the tribe's protocol
            is not optional — it's the procedurally correct approach under federal policy
            (see Presidential Memorandum on Tribal Consultation, January 26, 2021, 86 FR 7491
            — verify current federal guidance at the time of project execution).
          </li>
          <li>
            <strong>Extended timeline for response.</strong> While the SHPO has a defined 30-day
            response window under the standard Section 106 regulations, there is no equivalent
            hard deadline that limits tribal government response time. A tribe may request 60,
            90, or even 180 days to conduct their own cultural assessment of the APE. During
            that time, the clock is effectively paused pending tribal response.
          </li>
          <li>
            <strong>In-person consultation.</strong> Some tribes require or strongly prefer
            face-to-face meetings with federal agency representatives before providing a formal
            response. This adds travel time and scheduling complexity beyond what a written
            SHPO consultation involves.
          </li>
          <li>
            <strong>Cultural privacy considerations.</strong> Tribes may identify sacred sites or
            traditional cultural properties within the APE that they do not wish to disclose
            in a publicly available document. The ACHP has guidance on protecting sensitive
            tribal cultural information in Section 106 records.
          </li>
        </ul>

        <h3 className="mt-6">Book vs. Field: Timeline Reality</h3>
        <p>
          <strong>Book:</strong> Section 106 regulations (36 CFR Part 800) provide a 30-day response
          window for SHPO consultation. The same time frames technically apply to tribal consultation
          for the standard consultation steps. A project can proceed if a tribe does not respond
          within the defined period after proper notification.
        </p>
        <p className="mt-2">
          <strong>Field:</strong> Invoking "the 30-day clock expired" as a basis to proceed without
          tribal concurrence is a legally and politically high-risk move on any project with federal
          funding. Tribal governments have direct access to their Congressional delegations and can
          raise concerns through political channels that can slow or halt a project far more
          effectively than any regulatory clock. The "technical right to proceed" and the "practical
          reality of proceeding" are very different things.
        </p>
        <p className="mt-2">
          Best practice: engage tribes early (during route survey — T04 phase), build 60–120 days
          of buffer into the project schedule for tribal consultation on any route that crosses or
          approaches areas of tribal cultural concern, and maintain respectful ongoing communication.
          A project that finds and avoids a sacred site in the survey phase saves months compared
          to one that discovers it after a ground disturbance order is issued.
        </p>

        <h3 className="mt-6">Identifying Consulting Tribes</h3>
        <p>
          Before drafting any Section 106 initiation letter, the lead agency must identify which
          tribes have a potential interest in the undertaking's APE. The standard approach:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>
            Review the National Register of Historic Places and tribal historic properties
            databases for the project area.
          </li>
          <li>
            Contact the THPO directory (NATHPO.org) to identify tribes with THPOs in or
            near the project state.
          </li>
          <li>
            Contact the Bureau of Indian Affairs (BIA) regional office — BIA maintains
            information on tribal land boundaries and areas of traditional cultural concern.
          </li>
          <li>
            Review the State Historic Preservation Office's consultation list — many SHPOs
            maintain lists of tribes they recommend contacting for projects in their state.
          </li>
          <li>
            For projects in Hawaii or affecting Native Hawaiian interests, consult the Office
            of Hawaiian Affairs (OHA) directory of recognized NHOs.
          </li>
        </ol>
        <p className="mt-2">
          <strong>Important:</strong> The identification process is the lead federal agency's
          responsibility, not the fiber company's. However, as the project proponent (the
          entity applying for federal funding), you are expected to support the federal agency's
          consultation process — providing project information, APE maps, and responding promptly
          to agency requests for supplemental data.
        </p>
      </section>

      {/* QUIZ */}
      <Quiz
        title="L09 Practice Quiz — Tribal Coordination"
        mode="multiple-choice"
        questions={[
          {
            id: 'T09-L09-Q01',
            type: 'mc',
            prompt:
              'A BEAD-funded fiber project crosses tribal land belonging to a federally recognized tribe that has an approved THPO program. Who is the primary Section 106 consulting party for the portion of the route on tribal land?',
            choices: [
              'The State Historic Preservation Officer (SHPO) — Section 106 always goes through the SHPO',
              'The Tribal Historic Preservation Officer (THPO) — for undertakings on tribal land, the THPO assumes the SHPO\'s role as primary consulting party',
              'The Bureau of Indian Affairs (BIA) — BIA speaks for tribes in all federal consultations',
              'The Advisory Council on Historic Preservation (ACHP) — the ACHP leads all tribal consultations',
            ],
            answerIndex: 1,
            explanation:
              'Under the NHPA (54 USC § 302702/§ 302706), a tribe with an approved THPO program assumes the SHPO\'s consulting party role for historic properties on tribal land. The SHPO is still notified, but the THPO leads the tribal land review. For the off-tribal-land portions of the same route, the SHPO remains the primary consulting party — the THPO becomes an additional consulting party for areas of cultural concern. T09.L09.',
          },
          {
            id: 'T09-L09-Q02',
            type: 'mc',
            prompt:
              'Why does government-to-government tribal consultation often extend the Section 106 timeline beyond the standard 30-day SHPO window?',
            choices: [
              'Because federal regulations give tribes unlimited time to respond, with no deadlines',
              'Because tribal governments are sovereign nations with distinct consultation protocols — many require specific levels of federal official to initiate contact, face-to-face meetings, and cultural assessment time that exceeds 30 days',
              'Because the ACHP requires a secondary review after every tribal consultation',
              'Because tribes are always required to conduct archaeological field surveys before responding',
            ],
            answerIndex: 1,
            explanation:
              'Tribes are sovereign nations with formal consultation protocols — not interest groups that respond to a standard letter within 30 days. Many tribes require a specific level of federal official to initiate, request in-person meetings, or need 60–180 days to conduct their own cultural assessment of the APE. While technical 30-day clocks exist in the regulations, invoking them against tribal governments is a high-risk approach that can stall projects through political channels. Build 60–120 days of buffer for routes near tribal cultural areas. T09.L09.',
          },
          {
            id: 'T09-L09-Q03',
            type: 'mc',
            prompt:
              'A fiber project in rural Georgia crosses an area that a federally recognized tribe in Alabama has identified as an ancestral hunting territory (not tribal land). The route has a federal nexus (BEAD funding). How does this affect the Section 106 process?',
            choices: [
              'No effect — the tribe\'s territory is in Alabama; the project is in Georgia',
              'The SHPO handles it and the tribe has no role because they\'re not the SHPO for Georgia',
              'The tribe is an additional consulting party alongside the Georgia SHPO — the area of tribal cultural concern is within the APE even though it\'s not tribal land, and the lead agency must seek tribal input',
              'The tribe can veto the project entirely because ancestral territories have the same protection as tribal land',
            ],
            answerIndex: 2,
            explanation:
              'Section 106 consulting party status is not limited to tribal land. A tribe with cultural connections to an area — ancestral territories, traditional cultural properties, sacred sites — is a consulting party for undertakings within that area, regardless of which state the area is in or whether it\'s currently tribal land. The Georgia SHPO remains the primary consulting party, but the Alabama tribe is an additional consulting party whose concerns about the ancestral territory must be considered. T09.L09.',
          },
          {
            id: 'T09-L09-Q04',
            type: 'mc',
            prompt:
              'When does NHO (Native Hawaiian Organization) consultation apply to a fiber project on the continental United States?',
            choices: [
              'Never — NHO consultation only applies to projects physically in Hawaii',
              'For any project within 100 miles of a Pacific coastline',
              'For projects that may affect documented sites of Native Hawaiian ancestral or cultural significance, even if those sites are outside Hawaii',
              'For any project funded by any federal agency',
            ],
            answerIndex: 2,
            explanation:
              'NHO consultation can apply outside Hawaii when a project may affect documented sites of Native Hawaiian cultural or ancestral significance. This is uncommon on the continental US but is possible — for example, near heiau (temple) sites, burial sites, or other documented cultural properties connected to Native Hawaiian history outside Hawaii. The applicability is tied to the APE and the known cultural properties within it, not to geographic proximity to Hawaii. T09.L09.',
          },
        ]}
        onComplete={(result) => {
          console.info('T09 L09 Quiz complete:', result);
        }}
      />

    </LessonLayout>
  );
}
