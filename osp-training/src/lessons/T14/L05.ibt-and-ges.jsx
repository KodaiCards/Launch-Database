// T14.L05 — IBT and GES: What They Are
// Working lesson: intersystem bonding termination, grounding electrode system, PBB/SBB hierarchy

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L05',
  course_id: 'T14',
  title: 'IBT and GES — What They Are',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T14.L04'],
  vocabulary_introduced: [
    'PBB',
    'SBB',
    'bonding conductor',
  ],
  key_terms: [
    {
      term: 'PBB',
      definition:
        'Primary Bonding Busbar — the main bonding conductor assembly at the service entrance or main communications room. All bonding conductors (grounding electrode conductor, equipment grounding conductors, bonding jumpers) originate here. In a telecom context, the PBB is the main bus that bonds the power system ground to all communication service grounds. (Source: TIA-607-D §4.)',
    },
    {
      term: 'SBB',
      definition:
        'Secondary Bonding Busbar — a supplementary bonding point that connects equipment in a specific room or zone back to the PBB via a telecommunications bonding backbone conductor. Used in buildings with multiple telecom rooms. In OSP context, an FDH cabinet may have an SBB connecting all internal hardware (splitter shelf, OLT optics, patch panels) to the main building GES.',
    },
    {
      term: 'bonding conductor',
      definition:
        'The conductor that connects two components (or a component to the GES/IBT) to equalize their voltage. At building entry, the bonding conductor connects the primary protector bonding screw to the IBT, which ties to the GES. Sized per NEC §250.66 for the service entrance conductor, or per TIA-607-D for telecom-specific runs.',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'bonding', source_lesson_id: 'T14.L01' },
    { term: 'ground potential rise', source_lesson_id: 'T14.L01' },
    { term: 'IBT', source_lesson_id: 'T01.L08' },
    { term: 'GES', source_lesson_id: 'T01.L08' },
    { term: 'ground rod', source_lesson_id: 'T14.L04' },
    { term: 'concrete-encased electrode (Ufer)', source_lesson_id: 'T14.L04' },
    { term: 'ring electrode', source_lesson_id: 'T14.L04' },
    { term: 'supplemental electrode', source_lesson_id: 'T14.L04' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'headend', source_lesson_id: 'T01.L01' },
  ],
  learning_objectives: [
    'Explain what the IBT is, where it lives at building entry, and which NEC section requires it',
    'Describe why all communication services must bond to the same GES at a building entry',
    'Distinguish PBB from SBB and explain where each appears in an OSP/telecom context',
    'Trace the bonding conductor path from a fiber cable primary protector to the building GES',
  ],
  estimated_minutes: 20,
};

export default function T14L05_IBTandGES() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Imagine a customer building where three services enter: a fiber line, a cable TV coax,
          and a telephone line. Each one has a surge protector at the entry point to clamp voltage
          spikes before they reach the equipment. Each surge protector also needs a ground — a
          path to drain the spike energy into.
        </p>
        <p className="mt-2">
          Here's the problem: if each protector grounds to a <em>different</em> electrode —
          fiber protector to one rod, cable TV to a separate rod, telephone to a third — and a
          lightning strike hits the power line during a storm, the power-system ground electrode
          might momentarily sit at 5,000 V above earth (GPR) while the fiber protector's separate
          rod stays at 0 V. That 5,000 V difference appears across the telecom equipment between
          the two services. Equipment fails. Sometimes, if a technician is touching both at the
          same time, it's worse than equipment failure.
        </p>
        <p className="mt-2">
          The solution is simple: bond every incoming service to the SAME ground electrode system.
          One common ground. When GPR hits, everything rises together and there's no dangerous
          difference between services. NEC §250.94 requires a device called the IBT —
          intersystem bonding termination — to make that common bond point happen at every
          building entry. (Source: NEC NFPA 70-2023 §250.94.)
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L04 NEC §250 Electrodes</strong> — electrode types are the hardware. <strong>T14.L01 Why We Ground</strong> — grounding provides a path for fault current + GPR. This lesson explains why all incoming services (fiber, power, cable TV, etc.) must bond to ONE common electrode system (GES), and how the IBT device makes that bonding connection at every building entry.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
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
              <td className="px-3 py-2 font-mono">IBT</td>
              <td className="px-3 py-2">Intersystem Bonding Termination</td>
              <td className="px-3 py-2">The hardware "meeting point" where all comm-service protectors bond to the building GES</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GES</td>
              <td className="px-3 py-2">Grounding Electrode System</td>
              <td className="px-3 py-2">All the electrodes at a site bonded together — defined in this lesson</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PBB</td>
              <td className="px-3 py-2">Primary Bonding Busbar</td>
              <td className="px-3 py-2">The main bonding conductor assembly; the central hub of the GES in telecom contexts</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SBB</td>
              <td className="px-3 py-2">Secondary Bonding Busbar</td>
              <td className="px-3 py-2">A supplementary bonding point in a specific room or zone, connected back to the PBB</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GPR</td>
              <td className="px-3 py-2">Ground Potential Rise</td>
              <td className="px-3 py-2">Temporary voltage elevation at the ground electrode during a fault — defined in T14.L01</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-4">
          <p className="text-sm text-slate-300 font-semibold mb-2">Quick refresher:</p>
          <ul className="text-sm space-y-1 text-slate-300/90">
            <li><strong>Grounding:</strong> Connecting a conductor to the earth via an electrode (ground rod, Ufer, etc.) to establish a reference potential. From T14.L01.</li>
            <li><strong>Ground potential rise (GPR):</strong> The temporary voltage jump at a ground electrode during a fault — why all services must bond to the SAME electrode system. From T14.L01.</li>
            <li><strong>Bonding:</strong> Connecting multiple components to the same potential so voltage differences don't exist between them. From T14.L01.</li>
            <li><strong>Electrodes:</strong> NEC §250.52 types (ground rod, Ufer, ring electrode) — the hardware you bond everything to. From T14.L04.</li>
          </ul>
        </div>

        <h3 className="mt-6 font-semibold">The building-entry bonding path — from fiber to earth</h3>
        <p className="mt-2">
          Trace the bonding path for a fiber optical cable entering a building:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            <strong>Fiber cable enters</strong> through a conduit or cable entry at the building
            penetration (weatherhead, entrance conduit, or duct seal — installed per NESC and
            NEC Art. 770).
          </li>
          <li>
            <strong>Primary protector</strong> (listed surge protector, UL 497B-rated for optical
            fiber) is installed at or near the building entry. Per NEC §770.93, metallic OSP cable
            components require a listed primary protector bonded to the building GES.
            (Source: NEC §770.93; NEC §770.100.)
          </li>
          <li>
            <strong>Bonding conductor</strong> from the primary protector's bonding screw runs to
            the IBT.
          </li>
          <li>
            <strong>IBT</strong> (intersystem bonding termination) provides terminals for multiple
            communication services (fiber protector, cable TV protector, telephone protector).
            All their bonding conductors terminate here. Per NEC §250.94, the IBT must be
            accessible and must be bonded to the GES.
            (Source: NEC §250.94.)
          </li>
          <li>
            <strong>GES connection</strong> runs from the IBT to the building's grounding electrode
            conductor — which connects to all recognized electrodes (Ufer in the slab, driven rod
            at the building, water pipe if metallic, ring electrode if installed).
            All electrodes are bonded together into one GES. (Source: NEC Art. 250.)
          </li>
        </ol>

          <h3 className="mt-6 font-semibold">PBB and SBB — the telecom bonding backbone</h3>
        <p className="mt-2">
          In buildings with telecom rooms or larger facilities (CO, headend, data center annex),
          the IBT at the building entry connects to a PBB (primary bonding busbar). The PBB is
          the central bonding bus — like the main switchboard, but for grounding conductors rather
          than circuits. Everything bonds to the PBB, and the PBB bonds to the GES.
          (Source: TIA-607-D §4 [confirm edition].)
        </p>
        <p className="mt-2">
          In a multi-room facility, each telecom room has an SBB (secondary bonding busbar)
          connected back to the PBB via a TBB (telecommunications bonding backbone conductor).
          Equipment in each room (patch panels, OLT frames, splice shelves) bonds to the local
          SBB. The SBB bonds back to the PBB. The PBB bonds to the GES. One chain, one common
          ground reference.
        </p>
        <p className="mt-2">
          For a typical field FDH cabinet, the equivalent is simpler: an internal bonding bus
          or lug strip inside the cabinet where the cabinet frame, patch-panel frames, and any
          electronic hardware ground conductors all terminate. That internal bus runs a bonding
          conductor to the exterior ground rod or ring electrode.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h3 className="mt-6 font-semibold">The IBT vs. the equipment ground — an important distinction</h3>
        <p className="mt-2">
          The IBT is NOT the same as an equipment grounding conductor in an electrical panel.
          The IBT is specifically for <em>communication service</em> bonding — it's where the
          outside telecom services bond to the building's existing power GES. The power system
          already has its GES; the IBT is the tie point that brings the comm services onto that
          same GES. NEC §250.94 requires the IBT to be accessible so future communication
          services can add their bonding conductors as the building's services change over time.
          (Source: NEC §250.94.)
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            The IBT/GES concept cascades from building entry through all bonding design:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T14.L01 Grounding &amp; Bonding Fundamentals</strong> — The IBT is the point where all communications bonding converges to tie into the building's main GES. Without this tie point, each communication service (telco, cable, fiber) would have its own isolated GES — creating multiple ground-potential differences that cause currents to flow between systems.</li>
            <li><strong>T14.L06 Ground Resistance Testing</strong> — The GES (and therefore the IBT connection point) is tested for resistance-to-earth. High IBT resistance means fault currents stay elevated, creating shock hazard. The ground resistance spec (typically ≤5 Ω for telco, ≤25 Ω for cable) is measured at the GES/IBT location.</li>
            <li><strong>T19.L09 Headend &amp; CO Bonding to ISP Infrastructure</strong> — At the headend/CO, the fiber grounding conductor bonds to the same GES as the power system and existing communication services. The principle is identical: one equipotential GES, all services bonded there.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The IBT is not a luxury — it's the structural foundation that prevents your communications system from floating at a different potential than the building's power system.
          </p>
        </section>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <section data-tier="foundations" className="mt-8">
        <h3 className="font-semibold mb-3">Key Terms — Flashcards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <Quiz
          questions={[
            {
              id: 'T14L05Q1',
              text: 'Why does NEC §250.94 require all communication service protectors to bond to the same GES at building entry?',
              options: [
                'To provide a surge rating path that slows the fault current from reaching equipment',
                'So that during GPR events, all services rise to the same voltage, preventing dangerous voltage differences between them',
                'To simplify inspection by consolidating all grounding connections in one location',
                'Because multiple electrodes in parallel provide lower resistance than a single rod',
              ],
              correct: 1,
              explanation:
                'If each service bonds to a different electrode, those electrodes can be at different voltages during a GPR event — creating dangerous potential differences between services inside the building. Bonding all services to one common GES via the IBT ensures they rise and fall together, eliminating voltage differences. (Source: NEC §250.94; IEEE Std 1100-2005 §1.2–1.3 [confirm edition].)',
            },
            {
              id: 'T14L05Q2',
              text: 'The IBT (intersystem bonding termination) is located:',
              options: [
                'Inside the electrical panel next to the main breaker',
                'At or near the building entry point where communication services enter',
                'On the utility pole immediately outside the building',
                'In the telecommunications equipment room adjacent to the main distribution frame',
              ],
              correct: 1,
              explanation:
                'The IBT is required to be at or accessible from the building entry, where the incoming OSP comm services first enter the structure. This is where the primary protectors are installed and where their bonding conductors run the shortest path to the GES. NEC §250.94 specifies the IBT must be accessible for future service additions. (Source: NEC §250.94.)',
            },
            {
              id: 'T14L05Q3',
              text: 'In a large headend facility with multiple telecom rooms, which component bonds each room\'s equipment back to the main GES?',
              options: [
                'A separate primary protector in each room bonded to a separate independent ground rod',
                'Secondary bonding busbars (SBBs) in each room, connected to the primary bonding busbar (PBB) via telecommunications bonding backbone conductors',
                'Patch panel ground lugs connected directly to the building steel structure',
                'Individual ground conductors from each equipment frame running directly to the GES electrode',
              ],
              correct: 1,
              explanation:
                'TIA-607-D defines the telecom bonding backbone: each room has an SBB (secondary bonding busbar) for local equipment, connected to the PBB (primary bonding busbar) via a TBB (telecom bonding backbone) conductor. The PBB bonds to the GES. This maintains the single-reference ground architecture across all rooms without each piece of equipment running a long conductor to the GES. (Source: TIA-607-D §4 [confirm edition].)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
