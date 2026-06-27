import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L01',
  course_id: 'T22',
  title: 'CFOT Overview: Certification Scope & Exam Logistics',
  order: 1,
  lesson_type: 'cert-prep',
  prerequisites: [
    'T01.L01', 'T02.L01', 'T07.L01', 'T11.L01', 'T12.L01', 'T18.L01'
  ],
  learning_objectives: [
    'Understand CFOT (Certified Fiber Optic Technician) scope vs. CFOS-O, CFOS-H, CFOS-T',
    'Know the CFOT written exam format, time limits, passing score, and domains',
    'Identify the 5 major exam domains and their coverage percentages',
    'Learn the retake policy, cost, and credential validity period',
  ],
  estimated_minutes: 18,
  vocabulary_introduced: [
    'CFOT',
    'FOA (Fiber Optic Association)',
    'Domain (exam subject area)',
    'Blueprint (exam scope and weighting)',
    'Pass rate (percentage required to pass)',
    'Credential maintenance (renewal requirements)',
  ],
  vocabulary_assumed: [],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L01_CFOTOverview() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've learned to splice fiber, test cables, install in the field, and work safely around
          electrical hazards. The CFOT (Certified Fiber Optic Technician) credential from the Fiber
          Optic Association (FOA) proves you have technician-level practical knowledge—it's the
          entry-level industry certification that field crews recognize. This lesson explains what
          the CFOT certification covers, how the exam works, what scores you need, and how your
          credential stays valid.
        </p>

        <h3 className="mt-4 font-semibold">Key acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Stands for</th>
              <th className="px-3 py-2 text-left">What it means in CFOT context</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FOA</td>
              <td className="px-3 py-2">Fiber Optic Association</td>
              <td className="px-3 py-2">International nonprofit that develops fiber certifications</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFOT</td>
              <td className="px-3 py-2">Certified Fiber Optic Technician</td>
              <td className="px-3 py-2">Entry-level generalist cert; covers all fiber types, all environments</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFOS</td>
              <td className="px-3 py-2">Certified Fiber Optic Specialist</td>
              <td className="px-3 py-2">Advanced specialties (O=Outside Plant, T=Technician, H=Premises, I=Inside Plant)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MCQ</td>
              <td className="px-3 py-2">Multiple Choice Question</td>
              <td className="px-3 py-2">Written exam format; pick the single best answer from 4 options</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Domain</td>
              <td className="px-3 py-2">Exam subject area</td>
              <td className="px-3 py-2">Five major knowledge areas tested on CFOT (fiber, splicing, testing, installation, safety)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What is CFOT?</h3>
        <p className="mt-2">
          The Certified Fiber Optic Technician (CFOT) credential demonstrates that a field technician
          understands practical fiber fundamentals, splicing, testing, installation, and safety across
          all fiber types and all environments (inside plant, outside plant, campus, data center). It's
          the entry-level FOA certification—technicians pursuing specialist certs (CFOS-O, CFOS-T,
          CFOS-H, CFOS-I) typically start with CFOT to prove the generalist baseline.
        </p>
        <p className="mt-2">
          Who takes CFOT? Field technicians, entry-level installers, test techs, and crew members
          who work across multiple fiber environments and want industry-recognized credentials.
        </p>

        <h3 className="mt-5 font-semibold">CFOT vs. CFOS specialties</h3>
        <p className="mt-2">
          <strong>CFOT (entry-level, generalist):</strong> 75 questions, 60 minutes, ~70% pass.
          Covers all fiber types (single-mode, multimode) in all environments.
        </p>
        <p className="mt-2">
          <strong>CFOS-O (specialist, OSP):</strong> ~100 questions, 90 min. Assumes CFOT knowledge
          + deep OSP design, pole loading, NESC, make-ready.
        </p>
        <p className="mt-2">
          <strong>CFOS-T (specialist, technician):</strong> Advanced hands-on troubleshooting,
          field diagnostics.
        </p>
        <p className="mt-2">
          <strong>CFOS-H (specialist, premises):</strong> Inside-plant structured cabling, TIA-568,
          fiber backbone.
        </p>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>CFOT Exam Format & Domains</h2>
        <p>
          The written CFOT exam is a fixed 75 multiple-choice questions taken within a 60-minute
          window. You need to score approximately 70% (roughly 53 out of 75 correct) to pass.
        </p>

        <h3 className="mt-4 font-semibold">The five major domains</h3>
        <p className="mt-2">
          FOA structures the CFOT exam around five competency domains. Each domain has a percentage
          weight that reflects how many questions you'll see:
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Fiber Basics & Cable Types (13%):</strong> Single-mode vs. multimode, core/cladding,
            fiber types (SMF, MMF, PM), cable jacket materials, outdoor vs. indoor specifications</li>
          <li><strong>Splicing Techniques (27%):</strong> Fusion and mechanical splicing, loss budgeting,
            field practices, quality control, splice loss acceptance</li>
          <li><strong>Testing & Diagnostics (27%):</strong> Power meters, OLTS, OTDR theory + field
            use, acceptance criteria, troubleshooting</li>
          <li><strong>Installation Practices (20%):</strong> Aerial vs. underground cable, pulling tension,
            handling, connectorization, cable routing, environmental protection</li>
          <li><strong>Safety & Workmanship Standards (13%):</strong> Fiber safety (no-look hazards),
            electrical grounding, confined space, PPE, quality standards</li>
        </ul>

        <h3 className="mt-5 font-semibold">What the questions look like</h3>
        <p className="mt-2">
          CFOT questions are scenario-based and practical. Example:
        </p>
        <p className="mt-2 p-3 bg-white/5 border-l-2 border-blue-400 rounded text-slate-200">
          <em>"You're splicing 200 µm core singlemode fiber in the field. The first fusion attempt
          shows 0.2 dB loss on the fusion splicer display. A second attempt drops it to 0.15 dB.
          What is your next action? (A) Accept the 0.15 dB and terminate both sides, (B) Make a
          third attempt to reach 0.10 dB, (C) Report the unspliceable condition to the designer,
          (D) Mechanical splice instead."</em>
        </p>
        <p className="mt-2">
          <strong>Correct answer:</strong> (A). Field splicing accepts losses up to ~0.3 dB;
          repeatedly re-splicing degrades fiber. 0.15 dB is well within tolerance.
        </p>
        <p className="mt-2">
          Questions emphasize practical judgment, not just memorization. You'll see real-world
          trade-offs (speed vs. quality, cost vs. reliability) that field crews face.
        </p>

        <h3 className="mt-5 font-semibold">Exam logistics & retakes</h3>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Where:</strong> Pearson VUE test centers (mostly US, some international)</li>
          <li><strong>Cost:</strong> ~$200–250 USD per attempt</li>
          <li><strong>Retake policy:</strong> Can retake 3 times in 12 months if you fail; pass once = credential valid</li>
          <li><strong>Credential validity:</strong> CFOT is valid for 5 years; must renew with proof of continued practice or retesting</li>
          <li><strong>Results:</strong> Pass/fail determined at test center; detailed score report by domain mailed within 2 weeks</li>
        </ul>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Study Strategy & Time Management on Test Day</h2>
        <p>
          CFOT is 75 questions in 60 minutes = 48 seconds per question. You cannot spend 5 minutes
          on a single hard question; that burns time and costs points elsewhere.
        </p>

        <h3 className="mt-4 font-semibold">Three-pass strategy</h3>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Pass 1 (30 min):</strong> Answer all easy/straightforward questions first. Mark
            hard ones for later. Aim to finish ~50 questions confidently.</li>
          <li><strong>Pass 2 (20 min):</strong> Tackle the harder questions that require deeper thought.
            Flag any you cannot confidently answer.</li>
          <li><strong>Pass 3 (10 min):</strong> Review flagged questions. Check for misreads (read the
            question TWICE before committing to an answer). Guess intelligently on any remaining unknowns
            (eliminate obviously wrong answers first).</li>
        </ul>

        <h3 className="mt-5 font-semibold">Domain-Weighted Study Plan</h3>
        <p className="mt-2">
          Splicing (27%) and Testing (27%) together account for 54% of the exam — about 40 of 75 questions. Study time should match:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Domain</th>
              <th className="px-3 py-2 text-left">Exam weight</th>
              <th className="px-3 py-2 text-left">~Questions</th>
              <th className="px-3 py-2 text-left">Study priority</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Splicing</td>
              <td className="px-3 py-2">27%</td>
              <td className="px-3 py-2">~20</td>
              <td className="px-3 py-2">Priority 1 — highest ROI per study hour</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Testing & OTDR</td>
              <td className="px-3 py-2">27%</td>
              <td className="px-3 py-2">~20</td>
              <td className="px-3 py-2">Priority 1 — equally weighted with Splicing</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Installation</td>
              <td className="px-3 py-2">20%</td>
              <td className="px-3 py-2">~15</td>
              <td className="px-3 py-2">Priority 2 — practical; many questions are scenario-based</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Fiber Basics</td>
              <td className="px-3 py-2">13%</td>
              <td className="px-3 py-2">~10</td>
              <td className="px-3 py-2">Priority 3 — foundational; don't skip the attenuation math</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Safety</td>
              <td className="px-3 py-2">13%</td>
              <td className="px-3 py-2">~10</td>
              <td className="px-3 py-2">Priority 3 — scenario-based; know OSHA 1910.268 and confined-space rules</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Common Wrong-Answer Traps on CFOT</h3>
        <div className="mt-3 space-y-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-red-300">Trap 1: Splicer EL vs. actual splice loss</p>
            <p className="text-slate-300/90 mt-1">The splicer estimates loss (EL) optically — it is an estimate, not a measurement. OTDR measures actual splice loss. They often differ by 0.05–0.15 dB. <strong>OTDR measurement is authoritative.</strong> Exam questions that ask "what is the most accurate measurement of splice loss" → always OTDR.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-red-300">Trap 2: Mixing APC and UPC connectors</p>
            <p className="text-slate-300/90 mt-1">APC (green, 8° angle) mated to UPC (blue, flat) causes ~3–4 dB insertion loss and physically damages the APC face. The exam tests this. Correct answer is always "never mate APC to UPC."</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-red-300">Trap 3: Installation bend radius vs. long-term bend radius</p>
            <p className="text-slate-300/90 mt-1">10× OD applies only during pulling (under tension). At rest, use 20× OD. The exam may describe a cable coiled at 10× OD in storage and ask what is wrong — answer: macrobend loss from too-tight coil.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-red-300">Trap 4: OTDR "gain" event</p>
            <p className="text-slate-300/90 mt-1">An upward step on OTDR is not real gain — it is a backscatter artifact from a change in fiber type, a splice between different fibers, or a directional measurement artifact. Never report "gain" to a customer as meaning better signal.</p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Domain score analysis</h3>
        <p className="mt-2">
          Your detailed score report breaks down performance by domain. If you pass overall but score below 70% in Splicing, you know to deepen that area before pursuing CFOS-O or CFOS-T, which both build on splicing knowledge.
        </p>

        <h3 className="mt-5 font-semibold">Book vs. Field: Exam Standard vs. Field Reality</h3>
        <p className="mt-2">
          The exam tests FOA/NESC/TIA standard practice. Field reality often diverges — study to the exam standard:
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Splice loss acceptance:</strong> Exam = standard 0.1–0.2 dB per splice. Field = negotiated per contract; some jobs accept 0.3 dB. Answer "0.2 dB" on the exam.</li>
          <li><strong>OTDR dead zone:</strong> Exam = assume ~2 m event dead zone for typical instrument. Field = varies by brand and mode.</li>
          <li><strong>Safety (confined space):</strong> Exam = strict OSHA 1910.146 entry procedures. Field = sometimes shortcuts taken. The exam rewards knowing the RIGHT way.</li>
        </ul>
      </section>

      {/* ── TYING IT TOGETHER ───────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Every other T22 lesson is content study — this one is strategy. 75 questions, 60 minutes, ~70% to pass.
          The domain weights (27% Splicing, 27% Testing) tell you where to invest study time.
          The three-pass test strategy prevents time-traps from killing your score.
          The wrong-answer traps (EL vs. OTDR, APC/UPC mismatch, bend radius confusion, OTDR gain artifacts) are the four most common reasons confident technicians fail — knowing the content is not enough if you fall for a well-constructed wrong answer.
          Know your technical content from T22.L02–L07. Know the exam logistics from this lesson. Show up rested. Pass.
        </p>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <h2 className="mt-8">Lesson Quiz</h2>
      <Quiz
        questions={[
          {
            id: 'Q1',
            stem: 'What is the primary difference between CFOT and CFOS-O certifications?',
            options: [
              { text: 'CFOT is generalist (all fiber types, all environments); CFOS-O is specialist (OSP-focused).', correct: true },
              { text: 'CFOT is OSP-only; CFOS-O covers inside plant and data centers.', correct: false },
              { text: 'CFOT requires a practical exam; CFOS-O is written only.', correct: false },
              { text: 'CFOT is for installers; CFOS-O is for designers only.', correct: false },
            ],
            rationale: 'CFOT is the entry-level generalist cert covering all fiber environments. CFOS-O is a specialist cert focused on OSP engineering knowledge. CFOS-O assumes CFOT baseline.'
          },
          {
            id: 'Q2',
            stem: 'How many questions are on the CFOT written exam, and what is the time limit?',
            options: [
              { text: '75 questions, 60 minutes', correct: true },
              { text: '100 questions, 90 minutes', correct: false },
              { text: '50 questions, 45 minutes', correct: false },
              { text: '75 questions, 90 minutes', correct: false },
            ],
            rationale: 'CFOT is 75 MC questions in 60 minutes (48 sec/question). CFOS-O is 100 questions in 90 minutes.'
          },
          {
            id: 'Q3',
            stem: 'What approximate passing score is required for CFOT?',
            options: [
              { text: '60% (~45 questions correct)', correct: false },
              { text: '70% (~53 questions correct)', correct: true },
              { text: '80% (~60 questions correct)', correct: false },
              { text: '90% (~68 questions correct)', correct: false },
            ],
            rationale: 'CFOT requires ~70% to pass, roughly 53 out of 75 questions. Passing once earns a 5-year credential.'
          },
          {
            id: 'Q4',
            stem: 'The five major CFOT exam domains are fiber basics, splicing, testing, installation, and…?',
            options: [
              { text: 'Design principles', correct: false },
              { text: 'Electrical grounding', correct: false },
              { text: 'Safety & workmanship standards', correct: true },
              { text: 'Cable manufacturing', correct: false },
            ],
            rationale: 'The five domains are Fiber Basics (13%), Splicing (27%), Testing (27%), Installation (20%), and Safety/Workmanship (13%). Safety is emphasized heavily because field injuries are real.'
          },
        ]}
      />

      {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
      <h2 className="mt-8">Key Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {key_terms.map((term, idx) => (
          <Flashcard key={idx} question={term} answer={
            term === 'CFOT (Certified Fiber Optic Technician)' ? 'Entry-level FOA certification for field technicians; generalist across all fiber types and environments; 75 MC questions, 60 min, ~70% pass. Valid 5 years.' :
            term === 'FOA (Fiber Optic Association)' ? 'International nonprofit organization that develops and administers fiber optic certifications (CFOT, CFOS-O, CFOS-H, etc.).' :
            term === 'Domain (exam subject area)' ? 'One of the five major knowledge areas tested on CFOT: Fiber Basics, Splicing, Testing, Installation, and Safety. Each domain has a percentage weight.' :
            term === 'Blueprint (exam scope and weighting)' ? 'Official FOA document that defines which topics and skills the exam covers and what percentage of questions each domain represents.' :
            term === 'Pass rate (percentage required to pass)' ? 'The minimum score needed to pass CFOT is approximately 70% (~53 correct out of 75 questions).' :
            'The CFOT credential is valid for 5 years. To renew, you must either retake the exam or provide proof of continued practice in fiber optic work.'
          } />
        ))}
      </div>

    </LessonLayout>
  );
}
