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

        <h3 className="mt-5 font-semibold">Domain score analysis</h3>
        <p className="mt-2">
          Your detailed score report breaks down performance by domain. If you pass the exam overall
          but score below 70% in (say) Splicing, you now know to deepen that study area before
          pursuing a specialist cert that builds on splicing knowledge.
        </p>

        <h3 className="mt-5 font-semibold">Book vs. field divergences (CFOT perspective)</h3>
        <p className="mt-2">
          The exam tests FOA/NESC/TIA standard practice. Field reality often diverges:
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Splice loss acceptance:</strong> Exam = standard 0.1–0.2 dB per splice.
            Field = negotiated per contract; some jobs accept 0.3 dB.</li>
          <li><strong>OTDR dead zone:</strong> Exam = assume ~2 m. Field = 1–5 m depending on
            instrument brand and mode (single-mode shorter dead zone than multimode).</li>
          <li><strong>Cable handling:</strong> Exam emphasizes tension limits (50 lbf for aerial SMF).
            Field crews sometimes exceed limits under time pressure (bad practice, but it happens).</li>
          <li><strong>Safety (confined space):</strong> Exam = strict OSHA 1910.146 entry procedures.
            Field = sometimes shortcuts taken if space is small. (Don't do it; exam tests the RIGHT way.)</li>
        </ul>
        <p className="mt-2">
          <strong>Author's note:</strong> Study to the exam standard. Field reality is messier,
          but the exam rewards knowledge of the RIGHT way to do things.
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
              'CFOT is generalist (all fiber types, all environments); CFOS-O is specialist (OSP-focused).',
              'CFOT is OSP-only; CFOS-O covers inside plant and data centers.',
              'CFOT requires a practical exam; CFOS-O is written only.',
              'CFOT is for installers; CFOS-O is for designers only.',
            ],
            answerIndex: 0,
            explanation: 'CFOT is the entry-level generalist cert covering all fiber environments. CFOS-O is a specialist cert focused on OSP engineering knowledge. CFOS-O assumes CFOT baseline.'
          },
          {
            id: 'Q2',
            stem: 'How many questions are on the CFOT written exam, and what is the time limit?',
            options: [
              '75 questions, 60 minutes',
              '100 questions, 90 minutes',
              '50 questions, 45 minutes',
              '75 questions, 90 minutes',
            ],
            answerIndex: 0,
            explanation: 'CFOT is 75 MC questions in 60 minutes (48 sec/question). CFOS-O is 100 questions in 90 minutes.'
          },
          {
            id: 'Q3',
            stem: 'What approximate passing score is required for CFOT?',
            options: [
              '60% (~45 questions correct)',
              '70% (~53 questions correct)',
              '80% (~60 questions correct)',
              '90% (~68 questions correct)',
            ],
            answerIndex: 1,
            explanation: 'CFOT requires ~70% to pass, roughly 53 out of 75 questions. Passing once earns a 5-year credential.'
          },
          {
            id: 'Q4',
            stem: 'The five major CFOT exam domains are fiber basics, splicing, testing, installation, and…?',
            options: [
              'Design principles',
              'Electrical grounding',
              'Safety & workmanship standards',
              'Cable manufacturing',
            ],
            answerIndex: 2,
            explanation: 'The five domains are Fiber Basics (13%), Splicing (27%), Testing (27%), Installation (20%), and Safety/Workmanship (13%). Safety is emphasized heavily because field injuries are real.'
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
