import React from 'react';
import CertificationSim from '../components/CertificationSim.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';
import { CERT_BANK, DOMAIN_WEIGHTS } from '../data/cert-sim-bank.js';

/**
 * Module 12 — Final Certification Simulator
 *
 * Editorial posture (per docs/research-logs/module12-cert-sim.md §5):
 *
 *  - Exam structure facts are sourced from BICSI's public certification pages
 *    and the RCDD Certification Handbook (both free). Numbers are tagged per
 *    the platform's three-tier system (VERIFIED-public-source /
 *    VERIFIED-via-secondary-source / UNVERIFIED-needs-paid-doc).
 *
 *  - RCDD domain weights: v15 percentages CONFIRMED by Red Team 2026-05-08 via
 *    web search triangulation. v15 weights are identical to the v14 baseline
 *    (10/63/11/16). No update to DOMAIN_WEIGHTS in cert-sim-bank.js is required.
 *    The CertificationSim component reads weights from that object.
 *
 *  - All questions are platform-original. No dump-site content. See the ethics
 *    disclaimer rendered in section 12.3.
 *
 *  - The platform sim runs 50 items / 75 minutes (half-length study session).
 *    The actual BICSI RCDD exam is 100 items / 150 minutes; that fact is
 *    stated explicitly so students are not misled.
 */

export default function Module12_CertificationSim() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={12}
        title="Final Certification Simulator"
        intro="A randomised practice exam modelled on the publicly published BICSI RCDD, BICSI OSP Designer, and FOA CFOS/S blueprints. All questions are platform-original. This is a study tool, not the actual exam."
      />

      {/* ============================================================
       * 12.1 — Exam Structure: What You Are Preparing For
       * ============================================================ */}
      <Section title="12.1 Exam Structures — What You Are Actually Preparing For">
        <p>
          Before you sit a practice exam, know the target. Each certification has
          a publicly published structure; the numbers below are sourced from BICSI
          and FOA public pages and tagged accordingly.
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">BICSI RCDD</h3>
        <Table
          headers={['Parameter', 'Value', 'Source tag']}
          rows={[
            ['Items',         '100 scored items',            'VERIFIED-public-source'],
            ['Time',          '2.5 hours (150 min)',          'VERIFIED-public-source'],
            ['Passing score', '70%',                          'VERIFIED-public-source'],
            ['Item types',    'MC, multiple-response, enhanced matching', 'VERIFIED-public-source'],
            ['Primary ref.',  'TDMM 15th edition',            'VERIFIED-public-source'],
            ['Credential body', 'BICSI (Building Industry Consulting Service International)', 'VERIFIED-public-source'],
          ]}
        />
        <Callout kind="book" title="v15 domain weights — CONFIRMED by Red Team 2026-05-08">
          The domain weight table below uses the <strong>v15 RCDD blueprint</strong> percentages,
          which Red Team independently confirmed via web search triangulation on 2026-05-08.
          The v15 weights are <strong>identical to the v14 baseline</strong>: Define Scope ~10%,
          Design ~63%, Bid/Tender ~11%, Installation ~16%. No update to{' '}
          <code>DOMAIN_WEIGHTS</code> in <code>src/data/cert-sim-bank.js</code> is required.
        </Callout>
        <Callout kind="field" title="What r/RCDD says about the v15 shift">
          Multiple 2024–2025 posts on r/RCDD report that v15 includes more
          scenario-based items and fewer pure-recall questions than v14. A candidate
          who studied to v14 by memorizing table values may be surprised. The
          platform&rsquo;s editorial posture — teaching <em>why</em> a rule exists,
          not just the number — is precisely the right preparation for a
          scenario-heavy exam.
        </Callout>

        <Table
          headers={['RCDD Domain', 'Blueprint weight (v15 — CONFIRMED)', 'Approximate item count at 100']}
          rows={[
            ['Define Scope of ICT Design',     '~10%', '~10'],
            ['Design ICT Solutions',           '~63%', '~63'],
            ['Support ICT Bid/Tender Process', '~11%', '~11'],
            ['Support ICT Installation',       '~16%', '~16'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          v15 percentages — CONFIRMED via Red Team web search triangulation 2026-05-08.
          Weights are identical to the v14 baseline (10/63/11/16). No curriculum update required.
        </p>

        <h3 className="text-base font-semibold mt-5 mb-2">BICSI OSP Designer</h3>
        <Table
          headers={['Parameter', 'Value', 'Source tag']}
          rows={[
            ['Items',         '100 scored items',      'VERIFIED-public-source'],
            ['Time',          '2 hours (120 min)',      'VERIFIED-public-source'],
            ['Passing score', '70%',                    'VERIFIED-via-secondary-source'],
            ['Primary ref.',  'OSPDRM 6th edition',     'VERIFIED-public-source'],
            ['Eligibility',   '2 yrs verifiable OSP exp. + qualifying BICSI credential or accepted alternative', 'VERIFIED-via-secondary-source'],
          ]}
        />

        <h3 className="text-base font-semibold mt-5 mb-2">FOA CFOS/S (Certified Fiber Optic Specialist — Splicing)</h3>
        <Table
          headers={['Parameter', 'Value', 'Source tag']}
          rows={[
            ['Written exam',    'Closed-book; 70% pass threshold',          'VERIFIED-via-secondary-source'],
            ['Practical',       'Hands-on component at FOA-approved school',  'VERIFIED-via-secondary-source'],
            ['Pass condition',  'Written AND practical BOTH required',        'VERIFIED-via-secondary-source'],
            ['Primary ref.',    'FOA Reference Guide for Splicing Specialists', 'VERIFIED-public-source'],
          ]}
        />
        <Callout kind="warn" title="Written-only score is not enough for CFOS/S">
          A passing written score is necessary but <strong>not sufficient</strong> for the
          CFOS/S credential. The hands-on practical component is administered separately
          by an FOA-approved instructor or school. This platform&rsquo;s cert-sim covers
          written-exam concepts only. Plan the practical component through an FOA-approved
          school, such as FOA Fiber U
          (<a href="https://www.fiberu.org/" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">fiberu.org</a>).
        </Callout>
      </Section>

      {/* ============================================================
       * 12.2 — Study Strategy
       * ============================================================ */}
      <Section title="12.2 Study Strategy — How the Top Scorers Prepare">
        <p>
          Community data from r/RCDD, engineerboards.com, Mike Holt forums, and the
          BICSI Study Group converges on a consistent preparation pattern for the RCDD.
          The notes below synthesise that consensus with the platform&rsquo;s own
          editorial posture.
        </p>

        <h3 className="text-base font-semibold mt-4 mb-1">For the RCDD</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-200">
          <li>
            <strong>80–150 hours of study time</strong> is the practitioner consensus
            on r/RCDD for candidates without recent formal training. The most-cited
            strategy is TDMM 15th edition, cover-to-cover, twice — once for comprehension,
            once for review.
            {' '}<span className="text-[11px] text-slate-400">[VERIFIED-via-secondary-source: r/RCDD, engineerboards.com, Mike Holt forum threads]</span>
          </li>
          <li>
            <strong>Study like a designer, not a memoriser.</strong> Scenario questions
            (which v15 reportedly emphasises more than v14) require you to reason from
            principles — "why does this rule exist?" — not to recall a table value you
            have seen before.
            {' '}<span className="text-[11px] text-slate-400">[VERIFIED-via-secondary-source: engineerboards.com RCDD thread — senior posters&rsquo; consistent advice]</span>
          </li>
          <li>
            <strong>Know the enhanced-matching item type.</strong> Multiple candidate
            reports describe enhanced matching as harder than multiple-choice because
            you must correctly map every option to its target — partial credit is
            non-obvious. Practice that format, not just single-best-answer.
            {' '}<span className="text-[11px] text-slate-400">[VERIFIED-via-secondary-source: r/RCDD 2024–2025 posts]</span>
          </li>
          <li>
            <strong>Time budget: 1.5 min per item</strong> (100 items / 150 min). Flag
            items you are unsure of, complete the exam in a first pass, then return.
            Do not leave any item blank if there is no penalty for guessing — confirm
            current no-penalty policy in the BICSI Candidate Handbook before exam day.
          </li>
          <li>
            <strong>Paid prep resources</strong> most-cited in the community: BICSI
            Online Study Group
            (<a href="https://shop.bicsi.org/rcdd-online-study-group" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">shop.bicsi.org</a>)
            and Chuck Bowser&rsquo;s Let&rsquo;s Talk Cabling RCDD Study Group
            (<a href="https://letstalkcabling.com/rcdd-study-group-249-00/" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">letstalkcabling.com</a>).
            {' '}<span className="text-[11px] text-slate-400">[VERIFIED-public-source: both program pages are public]</span>
          </li>
        </ul>

        <h3 className="text-base font-semibold mt-5 mb-1">For the BICSI OSP Designer</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-200">
          <li>
            Primary reference is <strong>OSPDRM 6th edition</strong>. Community reports
            (r/cabling, r/telecom) describe the OSP exam as easier on generic cabling
            theory than RCDD but harder on right-of-way, grounding/bonding, and aerial
            hardware identification.
          </li>
          <li>
            The OSP exam is shorter (2 hours vs. 2.5 hours), but scenario-density
            is reportedly high around grounding/bonding topics and pathway selection.
          </li>
        </ul>

        <h3 className="text-base font-semibold mt-5 mb-1">For FOA CFOS/S</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-200">
          <li>
            FOA Fiber U (<a href="https://www.fiberu.org/" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">fiberu.org</a>)
            is the free self-study program; completing the splicing lesson set before
            the exam is the most-cited preparation path.
            {' '}<span className="text-[11px] text-slate-400">[VERIFIED-public-source: FOA website; community consensus from r/fiberoptics]</span>
          </li>
          <li>
            The written exam is <strong>closed-book</strong>. You must memorise
            splice-loss values, acceptance thresholds, arc-test cadence, and closure
            types — you cannot look them up during the exam.
          </li>
          <li>
            <strong>The practical is where many candidates burn extra time.</strong> Book
            the practical component with an FOA-approved school well in advance; instructor
            availability limits scheduling flexibility.
          </li>
        </ul>

        <Callout kind="book" title="Domain-to-module cross-reference">
          If you miss questions in a particular domain in the practice sim below, here
          is where to review in this platform:
          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sm">
            <li><strong>Define Scope</strong> — Modules 3, 5, 10, 11</li>
            <li><strong>Design ICT Solutions</strong> — Modules 1, 2, 4, 5, 6, 7, 8, 9, 10</li>
            <li><strong>Bid / Tender</strong> — Modules 3, 11</li>
            <li><strong>Installation</strong> — Modules 2, 3, 4, 8, 9, 11</li>
          </ul>
        </Callout>
      </Section>

      {/* ============================================================
       * 12.3 — Ethics Disclaimer
       * ============================================================ */}
      <Section title="12.3 Ethics of Exam Preparation">
        <Callout kind="warn" title="Dump sites violate the BICSI and FOA codes of conduct">
          <p>
            Sites such as ITExams, ExamTopics, dumpsarena, SPOTO, Killtest,
            Lead2Pass, and Pass4Success distribute leaked or reverse-engineered
            exam questions. <strong>Using them is a violation</strong> of the BICSI
            and FOA codes of conduct and may result in revocation of your
            certification. Some sites paraphrase; others host verbatim leaks. In
            either case, the ethical and legal risk is the same.
          </p>
          <p className="mt-2">
            Beyond the ethics: studying from dumps teaches <em>pattern recognition
            of specific questions</em>, not understanding of the underlying concepts.
            You may pass the exam and still be unable to apply the standard on a
            real job — which is the scenario-based v15 exam is specifically designed
            to detect.
          </p>
        </Callout>
        <Callout kind="book" title="What this simulator is (and is not)">
          This simulator is <strong>independent platform content</strong> modelled on
          the publicly published BICSI RCDD, BICSI OSP, and FOA CFOT/CFOS blueprints.
          Every question is platform-original, authored from public standards, agency
          documents, vendor whitepapers, and the FOA reference materials listed in
          this module&rsquo;s reference list. It is not, and does not contain, any
          portion of the actual BICSI or FOA examinations.
        </Callout>
      </Section>

      {/* ============================================================
       * 12.4 — The Practice Sim (50 items / 75 minutes)
       * ============================================================ */}
      <Section title="12.4 Practice Simulation — 50 Items / 75 Minutes">
        <p>
          The simulator below runs a <strong>50-item, 75-minute</strong> practice
          session — a half-length study run. Questions are drawn randomly from the
          bank and weighted by domain to mirror the published RCDD blueprint. Each
          run produces a different item set.
        </p>
        <Callout kind="verify" title="This is a half-length session — the actual RCDD is twice as long">
          The real BICSI RCDD exam is <strong>100 items / 150 minutes</strong>. This
          50-item / 75-minute default is intentionally sized for a focused study
          session rather than a full-length simulation. To run a full-length session,
          use <code>count=100</code> and <code>minutes=150</code> in a custom
          configuration, or simply run the 50-item sim twice in succession.
        </Callout>
        <Callout kind="field" title="How to use your results">
          After submitting, review the domain-by-domain breakdown. If you score below
          70% in any domain, return to the relevant modules (see cross-reference in
          §12.2) before your next practice run. The 70% threshold is the BICSI passing
          standard — treating it as your floor, not your ceiling, leaves margin for
          exam-day variance.
        </Callout>

        <div className="mt-4">
          <CertificationSim
            bank={CERT_BANK}
            domainWeights={DOMAIN_WEIGHTS}
            count={50}
            minutes={75}
          />
        </div>
      </Section>

      {/* ============================================================
       * 12.5 — What to Do After Passing the Practice Sim
       * ============================================================ */}
      <Section title="12.5 Next Steps — From Practice Score to Credential">
        <p>
          A strong practice score is encouraging but is not a pass prediction. Use the
          following checklist before scheduling your actual exam.
        </p>
        <ul className="list-decimal pl-5 space-y-2 mt-2 text-slate-200">
          <li>
            <strong>Verify current exam eligibility requirements</strong> on the BICSI
            certification page at the time you apply. Eligibility (experience hours,
            prior credentials) is subject to change between RCDD versions.
          </li>
          <li>
            <strong>Obtain the current RCDD Candidate Handbook</strong> (free PDF from
            BICSI). Confirm item count, time, passing score, and any no-penalty-for-guessing
            policy for the v15 exam specifically.
          </li>
          <li>
            <strong>Confirm TDMM 15th edition coverage</strong>. If a 16th edition is
            published by your exam date, verify which edition the exam is currently
            keyed to on the BICSI preparation page.
          </li>
          <li>
            <strong>Schedule Pearson VUE or BICSI testing center</strong> well in advance
            — popular time slots fill quickly in metropolitan areas.
          </li>
          <li>
            <strong>For CFOS/S candidates</strong>: schedule the practical component
            with an FOA-approved school before paying the exam fee. Practical slots are
            capacity-limited by instructor availability.
          </li>
          <li>
            <strong>Re-run this sim at full length</strong> (100 items, use count=100 in
            the component if your platform configuration allows it) at least twice in
            the week before the exam. The goal is fluency with the item format and the
            time discipline, not just content coverage.
          </li>
        </ul>
        <Callout kind="book" title="Official registration links (BICSI and FOA)">
          <ul className="space-y-1 text-sm">
            <li>
              BICSI RCDD exam:{' '}
              <a href="https://www.bicsi.org/education-certification/certification/rcdd" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">bicsi.org/education-certification/certification/rcdd</a>
              {' '}<span className="text-slate-400">[VERIFIED-public-source]</span>
            </li>
            <li>
              BICSI OSP Designer exam:{' '}
              <a href="https://www.bicsi.org/education-certification/certification/osp" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">bicsi.org/education-certification/certification/osp</a>
              {' '}<span className="text-slate-400">[VERIFIED-public-source]</span>
            </li>
            <li>
              FOA certifications index:{' '}
              <a href="https://www.thefoa.org/Certs.htm" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">thefoa.org/Certs.htm</a>
              {' '}<span className="text-slate-400">[VERIFIED-public-source]</span>
            </li>
            <li>
              FOA Fiber U (free self-study):{' '}
              <a href="https://www.fiberu.org/" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">fiberu.org</a>
              {' '}<span className="text-slate-400">[VERIFIED-public-source]</span>
            </li>
          </ul>
        </Callout>
      </Section>

      {/* ============================================================
       * Reference List
       * ============================================================ */}
      <RefList items={[
        {
          tag: 'book',
          text: 'BICSI RCDD Certification page (100 items / 2.5 hr / 70% pass / TDMM 15)',
          url: 'https://www.bicsi.org/education-certification/certification/rcdd',
        },
        {
          tag: 'book',
          text: 'BICSI RCDD How to Prepare page (official BICSI study guidance)',
          url: 'https://www.bicsi.org/education-certification/certification/rcdd/how-to-prepare-for-the-rcdd-exam',
        },
        {
          tag: 'book',
          text: 'BICSI RCDD Certification Handbook PDF (free, BICSI-hosted)',
          url: 'https://www.bicsi.org/docs/default-source/certification-section-files/rcdd-certification-handbook_updated.pdf',
        },
        {
          tag: 'book',
          text: 'BICSI RCDD Exam Blueprint PDF (v15 current) — v15 domain weights CONFIRMED by Red Team 2026-05-08 via web search triangulation; weights identical to v14 (10/63/11/16)',
          url: 'https://www.bicsi.org/docs/default-source/default-document-library/rcdd-exam-blueprint.pdf',
        },
        {
          tag: 'book',
          text: 'BICSI OSP Designer Certification page',
          url: 'https://www.bicsi.org/education-certification/certification/osp',
        },
        {
          tag: 'book',
          text: 'BICSI OSP Certification Handbook PDF (free, BICSI-hosted)',
          url: 'https://www.bicsi.org/docs/default-source/handbooks/osp_cred_handbook_09102025_1147.pdf',
        },
        {
          tag: 'book',
          text: 'FOA Certifications Index (CFOT, CFOS/S, CFOS/T, CFOS/O, CFOS/D, CFOS/H)',
          url: 'https://www.thefoa.org/Certs.htm',
        },
        {
          tag: 'book',
          text: 'FOA Fiber U — free self-study prep for all FOA certifications',
          url: 'https://www.fiberu.org/',
        },
        {
          tag: 'book',
          text: 'BICSI RCDD Online Study Group (official paid program)',
          url: 'https://shop.bicsi.org/rcdd-online-study-group',
        },
        {
          tag: 'forum',
          text: 'Let\'s Talk Cabling — RCDD Study Group (Chuck Bowser, RCDD)',
          url: 'https://letstalkcabling.com/rcdd-study-group-249-00/',
        },
        {
          tag: 'forum',
          text: 'engineerboards.com RCDD thread — multi-year practitioner discussion',
          url: 'https://engineerboards.com/threads/rcdd-registered-communication-distribution-designer.10568/',
        },
        {
          tag: 'forum',
          text: 'Mike Holt forum — BICSI RCDD exam and study guides thread',
          url: 'https://forums.mikeholt.com/threads/info-on-the-bicsi-rcdd-exam-and-study-quides.77209/',
        },
        {
          tag: 'book',
          text: 'RCDD v15 vs v14 domain weights: CONFIRMED identical (10/63/11/16) by Red Team 2026-05-08. DOMAIN_WEIGHTS in cert-sim-bank.js requires no update.',
        },
        {
          tag: 'verify',
          text: 'BICSI no-penalty-for-guessing policy: confirm in current BICSI Candidate Handbook before exam day — policies can change between exam versions.',
        },
        {
          tag: 'verify',
          text: 'FOA CFOS/S practical acceptance threshold (0.15 dB or 0.10 dB per splice): FOA curriculum is member-only; the platform teaches 0.15 dB as the planning value pending FOA member confirmation.',
        },
      ]} />
    </article>
  );
}
