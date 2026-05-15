// Net-new — T08.L09 Application, Permit, and Inspection Path
// Author B — attachment application workflow, AHJ permitting, inspection sequence
// Sources: net-new; 47 CFR 1.1411 (access timeline); FCC 18-111; field practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T08.L09',
  course_id: 'T08',
  title: 'Application, Permit, and Inspection Path',
  order: 9,
  lesson_type: 'working',
  prerequisites: [
    'T08.L01', 'T08.L02', 'T08.L03',
    'T08.L04', 'T08.L05', 'T08.L06',
    'T08.L07', 'T08.L08',
  ],
  learning_objectives: [
    'Trace the step-by-step workflow from attachment application submission to cable installation authorization',
    'Identify who reviews the application at each stage (pole owner, AHJ) and what they\'re looking for',
    'Recognize common delays that arise in the application-permit-inspection loop and how to mitigate them',
    'Apply the FCC 15-day access rule in the context of the full application timeline',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'attachment application',
    'utility-company review',
    'local permitting (AHJ)',
    'inspection',
    'approval',
    'tie-in notice',
  ],
};

export const vocabulary_introduced = {
  'attachment application': 'The formal request submitted by a fiber applicant to the pole owner requesting permission to attach a cable to one or more poles. A complete attachment application includes: applicant identity and contact, application number (for tracking), list of pole IDs and locations, attachment design drawings (span lengths, attachment heights, cable type and diameter, proposed bracket specifications), pole-loading calculations (NESC loading district and design loads per T05), and the applicant\'s certification that the design complies with applicable codes. Incomplete applications are returned by the pole owner for additional information — this is a common delay source. Per FCC 18-111 and 47 CFR 1.1411, the pole owner must process a complete attachment application within defined timelines.',
  'utility-company review': 'The pole owner\'s internal review of the attachment application to verify: (1) the proposed attachment height and design clear all existing attachments with NESC-required spacing, (2) the pole can structurally support the new load without exceeding design capacity, and (3) the applicant has submitted all required information. This review typically takes 10–14 business days for straightforward applications. The pole owner may issue a "notice of completion" (confirming the application is complete) and then begin the make-ready estimate process, or they may return the application with specific requests for additional information. Under 47 CFR 1.1411, the pole owner has a defined period to complete the survey and provide the make-ready estimate after receiving a complete application.',
  'local permitting (AHJ)': 'The permit issued by the Authority Having Jurisdiction (AHJ) — the local governmental body (city, county, or state transportation department) — that authorizes construction work in the right-of-way (ROW). Even after the pole owner approves the attachment application, the fiber applicant must obtain a separate permit from the AHJ to perform work in the public right-of-way. AHJ permits typically require: the applicant\'s permit application, a copy of the utility\'s approved attachment authorization, site plans showing the route, and sometimes traffic control plans if work is in a travel lane. AHJ review times vary widely — from 3 business days (simple residential ROW) to 6+ weeks (state highway or urban intersection). Some jurisdictions have permit-by-rule provisions that allow aerial attachments to proceed without an individual permit when the applicant already has a franchise or blanket permit agreement.',
  'inspection': 'The post-installation verification that the attachment was installed as designed and complies with all applicable codes. Inspection may be performed by the pole owner (verifying the attachment meets their design approval), the AHJ (verifying compliance with the local permit), or both. The AHJ inspector typically checks: attachment height vs. permit, cable sag, bracket installation, and bonding/grounding. The pole owner may perform their own inspection on a sample basis or for all new attachments in some service areas. Applicants must be prepared to schedule both inspections — failure to notify the required inspectors before cable installation is a common compliance deficiency.',
  'approval': 'The formal authorization to proceed with cable installation after both the pole owner and AHJ have verified the make-ready work is complete and the site is ready for the new attachment. Approval from the pole owner typically takes the form of a "make-ready completion notice" confirming that all transfer, reframe, or replacement work has been completed and the pole is ready for the new cable. AHJ approval is the issued permit with a permit number. Both documents should be on file before cables are pulled. Some applicants pull cable before receiving formal approval and then face a stop-work order — an expensive mistake.',
  'tie-in notice': 'The notification the fiber applicant sends to the pole owner after cable installation is complete, formally notifying the pole owner that the new cable is now attached and operational. The tie-in notice may include: the date of installation, a description of any field deviations from the approved design (with explanation), photos of the installation, and confirmation that as-built documentation is forthcoming. Some pole owners require the tie-in notice within 5–10 business days of cable installation. Failure to send a tie-in notice is a common compliance gap that becomes an issue when the pole owner performs their annual pole audit and finds an unauthorized attachment.',
};

export const vocabulary_assumed = [
  { term: 'OTMR (One-Touch Make-Ready)', source_lesson_id: 'T08.L01' },
  { term: '15-day clock', source_lesson_id: 'T08.L02' },
  { term: 'make-ready estimate', source_lesson_id: 'T08.L07' },
  { term: 'MRE (make-ready estimate)', source_lesson_id: 'T08.L07' },
  { term: 'pole owner', source_lesson_id: 'T08.L01' },
  { term: 'FCC 18-111', source_lesson_id: 'T08.L01' },
  { term: 'NESC', source_lesson_id: 'T05.L01' },
];

export const key_terms = Object.entries(vocabulary_introduced).map(([term, definition]) => ({
  term,
  definition,
}));

export default function T08L09_ApplicationPermitInspectionPath() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Getting fiber on a pole you don't own isn't just a construction question — it's a
          paperwork marathon. Before a single worker climbs a pole, you need permission from
          at least two different organizations: the pole owner (the utility company that owns
          the poles) and the AHJ (the local government that controls the right-of-way where
          the poles stand).
        </p>
        <p className="mt-2">
          These two review processes run mostly in sequence, not in parallel — which means the
          timeline adds up fast. Typical end-to-end time from submitting your application to
          having authorization to pull cable: 5 to 10 weeks on a smooth project. On a project
          with delays, 6 months is not unusual.
        </p>
        <p className="mt-2">
          This lesson maps the full workflow so you can anticipate where delays will hit,
          know what each reviewer is looking for, and stay ahead of the critical-path steps.
        </p>

        {/* Key Terms Flashcards */}
        <Flashcard
          deckId="T08-L09"
          cards={[
            {
              id: 'T08-L09-fc-app',
              front: 'What is an attachment application, and what must it include?',
              back: 'The formal request submitted by a fiber applicant to the pole owner for permission to attach a cable. Must include: applicant identity, pole IDs and locations, attachment design drawings (span lengths, heights, cable type, bracket specs), pole-loading calculations, and compliance certification. Incomplete applications are returned — a common delay source.',
            },
            {
              id: 'T08-L09-fc-utility-review',
              front: 'What does the pole owner check during utility-company review?',
              back: 'The pole owner verifies: (1) proposed attachment height clears all existing attachments with NESC spacing, (2) the pole can structurally support the new load without exceeding design capacity, (3) all required information is submitted. Typically takes 10–14 business days. May return application with specific requests or issue a notice of completion.',
            },
            {
              id: 'T08-L09-fc-ahj',
              front: 'What is local permitting (AHJ) and why is it separate from the utility\'s approval?',
              back: 'A permit from the Authority Having Jurisdiction (the local government body controlling the right-of-way). Even after the pole owner approves the attachment, a separate AHJ permit is required to perform work in the public ROW. Requires: application, utility authorization copy, site plans, sometimes traffic control plans. Review time: 3 business days to 6+ weeks depending on jurisdiction.',
            },
            {
              id: 'T08-L09-fc-inspection',
              front: 'Who may inspect a fiber pole attachment, and what do they check?',
              back: 'Inspection may be by the pole owner (verifying design compliance), the AHJ (verifying permit compliance), or both. AHJ inspector checks: attachment height vs. permit, cable sag, bracket installation, bonding/grounding. Pole owner may do sample or 100% inspection. Both inspections must be scheduled before cable installation is considered complete.',
            },
            {
              id: 'T08-L09-fc-tienotice',
              front: 'What is a tie-in notice and when must it be sent?',
              back: 'The formal notification from the fiber applicant to the pole owner after cable installation is complete, stating the new cable is attached and operational. May include: installation date, field deviations from approved design with explanation, photos, and confirmation that as-built documentation is forthcoming. Many pole owners require this within 5–10 business days of installation.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Full Application-to-Install Workflow</h2>

        <p>
          Here's the typical sequence for a standard aerial fiber attachment project with
          no OTMR complications. Times shown are business days for a routine project with
          a cooperative pole owner and AHJ.
        </p>

        <div className="mt-4 space-y-3">
          {[
            {
              step: 'Step 1',
              title: 'Submit Attachment Application to Pole Owner',
              days: 'Day 0',
              detail: 'Submit: pole IDs, design drawings, loading calculations, applicant certification. Verify you\'ve checked the pole owner\'s specific application requirements — some have online portals, some require paper form + PDF attachments. Missing a single field = returned application.',
            },
            {
              step: 'Step 2',
              title: 'Pole Owner: Notice of Complete Application',
              days: 'Day 3–5',
              detail: 'Pole owner confirms the application is complete (or returns it for additional information). The FCC 15-day clock for granting access starts running from when a COMPLETE application is received — incomplete applications reset the clock.',
            },
            {
              step: 'Step 3',
              title: 'Pole Owner: Field Survey + Make-Ready Estimate',
              days: 'Day 5–14',
              detail: 'Pole owner surveys the route (or uses existing audit data) and prepares the MRE. Under 47 CFR 1.1411, the pole owner must provide the survey results and estimate within a defined period after receiving a complete application [confirm current regulatory deadlines — FCC rate orders are revised]. Complex routes may take longer.',
            },
            {
              step: 'Step 4',
              title: 'Applicant: Review + Accept MRE',
              days: 'Day 15–22',
              detail: 'You review the MRE (using the skills from T08.L07), verify line items, accept or dispute specific items, and pay. The make-ready work cannot be scheduled until the MRE is accepted and paid.',
            },
            {
              step: 'Step 5',
              title: 'Submit AHJ Permit Application',
              days: 'Day 15 (parallel with MRE review)',
              detail: 'Submit your local permit application to the AHJ simultaneously with MRE review — don\'t wait for the MRE to complete before starting the permit process. Include the pole owner\'s application number as proof of utility authorization.',
            },
            {
              step: 'Step 6',
              title: 'AHJ: Permit Review and Issuance',
              days: 'Day 18–35',
              detail: 'AHJ reviews and issues the permit. Simple residential ROW: 3–5 business days. State highway or urban: 2–6 weeks. Some jurisdictions require a traffic control plan, a noise ordinance variance, or a bond before issuing. Start the AHJ process as early as possible.',
            },
            {
              step: 'Step 7',
              title: 'Make-Ready Work Executed',
              days: 'Day 22–45 (after MRE accepted + crew scheduling)',
              detail: 'Pole owner schedules make-ready crew. Transfer, reframe, and replacement actions performed. Power company sub-contractor work scheduled separately if required (adds 3–8 weeks). You may need to be present at job sites for complex make-ready actions.',
            },
            {
              step: 'Step 8',
              title: 'Pole Owner: Make-Ready Completion Notice',
              days: 'Day 45–55',
              detail: 'Pole owner notifies you that make-ready is complete and the poles are ready for your cable installation. Inspect the poles before pulling cable — verify the attachment heights match your design.',
            },
            {
              step: 'Step 9',
              title: 'Cable Installation',
              days: 'Day 55–65',
              detail: 'Pull the cable. Notify required inspectors (AHJ, pole owner) before starting if pre-installation inspection is required in your jurisdiction.',
            },
            {
              step: 'Step 10',
              title: 'Inspection + Tie-In Notice',
              days: 'Day 65–70',
              detail: 'AHJ and/or pole owner inspect. Submit tie-in notice to pole owner within their required timeframe (typically 5–10 business days of installation completion). Begin as-built documentation (T08.L10).',
            },
          ].map((item) => (
            <div key={item.step} className="p-3 border border-white/10 rounded-lg bg-white/3">
              <p className="font-semibold text-slate-100 text-sm">{item.step}: {item.title} <span className="font-normal text-slate-400">— {item.days}</span></p>
              <p className="text-xs text-slate-300/90 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 font-semibold">The Most Common Delay Points</h3>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li><strong>Incomplete application returned</strong> — missing a single exhibit resets your timeline by 5–10 days. Use the pole owner's checklist verbatim.</li>
          <li><strong>MRE dispute</strong> — if you dispute line items, add 5–15 days for the back-and-forth. Have your staker's field notes ready to support specific line-item challenges.</li>
          <li><strong>AHJ permit delay</strong> — the most variable timeline in the entire process. Start the AHJ application the same day you submit to the pole owner. Never wait sequentially.</li>
          <li><strong>Power company make-ready crew scheduling</strong> — power crews book 3–8 weeks out. If your route has any poles requiring power company transfers, add this to your critical-path timeline immediately.</li>
          <li><strong>Pre-inspection hold</strong> — some AHJs require a pre-installation inspection before you can pull cable. If you miss the inspection appointment, you wait for the next available slot.</li>
        </ol>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Blanket Permits and Franchise Agreements</h2>
        <p>
          On large-scale deployments — hundreds or thousands of poles across multiple
          jurisdictions — project teams typically negotiate <strong>blanket permits</strong>
          or <strong>franchise agreements</strong> that replace individual pole-by-pole AHJ
          permits. Key characteristics:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li>
            <strong>Blanket permit:</strong> Issued by the AHJ to cover all construction
            work within a defined geographic area or project scope during a defined time
            period. The applicant still submits route-specific drawings, but the AHJ review
            is a single high-level review rather than individual pole-by-pole processing.
            Common for ISPs deploying fiber in a single county with a cooperative county
            commission.
          </li>
          <li>
            <strong>Franchise agreement:</strong> A negotiated agreement between the
            applicant and the municipality granting the right to use the public ROW for
            telecommunications infrastructure indefinitely (subject to annual review). Once
            the franchise is established, individual project permits are typically faster
            (sometimes permit-by-rule for aerial attachments on existing poles). Most
            large telecom companies have existing franchise agreements in their operating areas.
          </li>
          <li>
            <strong>RUS project consideration:</strong> RUS-funded projects often involve
            existing electric cooperatives that already have pole-line easements across
            the service territory. In this case, the electric cooperative may also be the
            pole owner, which can streamline both the utility review and the AHJ
            process — the co-op's existing easements may cover the fiber installation
            without requiring a separate AHJ permit in unincorporated rural areas.
            [Verify with the specific cooperative and county; easement coverage varies.]
          </li>
        </ul>
      </section>

      {/* ── BRANCHING SCENARIO ────────────────────────────────────────────── */}
      <BranchingScenario
        id="T08-L09-BS1"
        title="Application to In-Service: Managing Timeline Slippage"
        description="You're managing a 35-pole aerial attachment project in a rural county. Project was supposed to go live in 8 weeks. Walk through the application process and manage the timeline."
        nodes={[
          {
            id: 'start',
            type: 'decision',
            text: "Day 1: You submit the attachment application to the pole owner. Day 5: The pole owner returns it — missing the pole-loading calculation exhibit for 3 poles where the staker flagged potential overloading. Your options?",
            choices: [
              { label: 'Ask the pole owner to waive the missing calculation requirement — it\'s just 3 poles', nextId: 'waive-bad' },
              { label: 'Get the loading calculations done immediately (hire PE if needed) and resubmit within 2 business days', nextId: 'resubmit-fast' },
            ],
          },
          {
            id: 'waive-bad',
            type: 'outcome',
            text: "The pole owner won't waive it — pole-loading calculations are required by their tariff and by FCC 18-111 for a complete application. The 15-day FCC clock doesn't start until they receive a complete application. You've lost time and goodwill by asking. Expedite the calculations and resubmit.",
            variant: 'bad',
          },
          {
            id: 'resubmit-fast',
            type: 'decision',
            text: "Good move. You expedite the calculations and resubmit Day 7. The pole owner acknowledges receipt of a complete application Day 9. While waiting for the MRE (due Day 23), what should you do about the AHJ permit?",
            choices: [
              { label: 'Wait for the MRE to be accepted before starting the AHJ permit — the AHJ may want proof of utility approval first', nextId: 'wait-ahj-bad' },
              { label: 'Submit the AHJ permit application now, using your application number as proof of pending utility authorization', nextId: 'parallel-ahj' },
            ],
          },
          {
            id: 'wait-ahj-bad',
            type: 'outcome',
            text: "Sequential approach adds 2–4 weeks to your timeline unnecessarily. Most AHJs accept a pending utility application number as sufficient for permit review — they don't need the MRE accepted before they'll review your permit. Submit in parallel. You've given up weeks of clock.",
            variant: 'bad',
          },
          {
            id: 'parallel-ahj',
            type: 'decision',
            text: "Parallel approach: AHJ permit submitted Day 9. AHJ says review will take 3 weeks (Day 30). MRE arrives Day 21. MRE reviewed and accepted Day 24. AHJ permit issued Day 30. Power company sub-contractor for 4 poles is booked 5 weeks out (Day 30 + 35 days = Day 65). Your project target was Day 56 (8 weeks from Day 1). What's your move?",
            choices: [
              { label: 'Accept the Day 65 timeline — there\'s nothing you can do about the power company schedule', nextId: 'accept-delay' },
              { label: 'Explore whether the 4 power-company poles can be done as OTMR by your crew, which would remove the power company scheduling dependency', nextId: 'otmr-check' },
            ],
          },
          {
            id: 'accept-delay',
            type: 'outcome',
            text: "Reasonable but passive. Before accepting the delay, it's worth asking whether any of the 4 power-company poles can be done by your crew under OTMR rules — if your crew owns the cable being transferred (your fiber), you may qualify for OTMR on those poles. The power company gets notified but your crew does the work. This eliminates the scheduling dependency. Always check the OTMR eligibility before defaulting to power company scheduling.",
            variant: 'bad',
          },
          {
            id: 'otmr-check',
            type: 'decision',
            text: "Smart. You check with your make-ready engineer. Two of the 4 poles qualify for OTMR (your crew can perform the transfer without power company involvement). The other 2 require the power company because their cable is in the power space. For those 2: 5-week wait. For the 2 OTMR poles: your crew can do it within 1 week. You're now only waiting on 2 poles. How do you handle the 2-pole power company delay?",
            choices: [
              { label: 'Hold all 35 poles until the power company completes those 2 — it\'s simpler', nextId: 'hold-all-bad' },
              { label: 'Install cable on the 33 poles that are ready, leave the 2 power-company poles with gap sections and splice later', nextId: 'phased-install' },
            ],
          },
          {
            id: 'hold-all-bad',
            type: 'outcome',
            text: "Holding all 35 poles for 2 means your cable crew sits idle for 5 weeks on 33 poles worth of work. That's not efficient. If the design allows for phased installation (pull cable on the ready poles, leave gap sections at the 2 power poles, splice in after make-ready is complete), you can put the cable crew to work now and minimize the schedule impact.",
            variant: 'bad',
          },
          {
            id: 'phased-install',
            type: 'outcome',
            text: "Phased installation is the field-smart approach. Pull cable on the 33 ready poles. Leave pre-cut gap sections with slack at the 2 power-company poles. After power company make-ready (5 weeks), send a splice crew back to complete those 2 pole connections. Your project goes live 5 weeks late only at those 2 endpoints — the rest of the route is ready. Document the phasing in your project schedule and notify the customer of the partial go-live timeline.",
            variant: 'good',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T08.L09 Check — Application, Permit, and Inspection Path"
        mode="multiple-choice"
        questions={[
          {
            id: 'T08-L09-Q1',
            type: 'mc',
            prompt: 'What is the most common reason an attachment application is returned by the pole owner before the 15-day FCC clock starts?',
            choices: [
              'The applicant filed in the wrong geographic jurisdiction',
              'The application is incomplete — missing required exhibits such as loading calculations, attachment drawings, or the applicant\'s certification',
              'The pole owner is exercising its right to delay under FCC rules',
              'The pole owner does not have staff available to review the application',
            ],
            answerIndex: 1,
            explanation: 'The FCC 15-day clock starts when a COMPLETE application is received. An incomplete application can be returned without triggering the clock. The most common reason for return is missing required documentation: pole-loading calculations, attachment design drawings specifying heights and hardware, or the applicant\'s code compliance certification. Submit a complete application the first time to avoid the clock reset. (T08.L09 — attachment application completeness.)',
          },
          {
            id: 'T08-L09-Q2',
            type: 'mc',
            prompt: 'In the full application-to-install workflow, when should you submit the AHJ permit application relative to the utility review process?',
            choices: [
              'After the MRE is accepted and paid — the AHJ needs proof of utility approval before reviewing',
              'After the utility approves make-ready completion and the poles are ready for cable',
              'At the same time as or shortly after submitting the attachment application to the pole owner, in parallel — don\'t wait sequentially',
              'Before submitting to the pole owner, so the AHJ permit is ready when the utility approves',
            ],
            answerIndex: 2,
            explanation: 'AHJ permit submission should run parallel to the utility review process. Most AHJs accept the applicant\'s utility application number as proof of pending authorization — they don\'t require a completed MRE or utility approval before starting their review. Sequential submission (wait for utility approval, then submit to AHJ) adds 2–4 weeks to the timeline unnecessarily. The two reviews can run concurrently; whichever finishes later sets the timeline. (T08.L09 — parallel vs. sequential workflow.)',
          },
          {
            id: 'T08-L09-Q3',
            type: 'mc',
            prompt: 'What is a tie-in notice, and what compliance risk arises if you don\'t send one?',
            choices: [
              'A tie-in notice is a document sent BEFORE installation to notify the pole owner you\'re about to pull cable — skipping it is a permit violation',
              'A tie-in notice is a post-installation notification to the pole owner that the new cable is attached and operational. Skipping it creates a compliance gap where your attachment could be classified as unauthorized during a pole owner\'s annual audit',
              'A tie-in notice is the AHJ\'s final inspection sign-off — it\'s the AHJ\'s document, not the applicant\'s',
              'A tie-in notice is only required when construction deviates from the approved design',
            ],
            answerIndex: 1,
            explanation: 'A tie-in notice is a post-installation notification from the applicant to the pole owner confirming the cable is installed and operational. Failure to send one means the pole owner\'s records still show the attachment as "pending installation" or "authorized but not installed." When they perform annual pole audits and find a cable without a tie-in notice on record, it may be classified as an unauthorized attachment — potentially leading to a demand for removal or a fine. Many pole owners require tie-in notices within 5–10 business days of installation completion. (T08.L09 — tie-in notice compliance.)',
          },
          {
            id: 'T08-L09-Q4',
            type: 'mc',
            prompt: 'A project has 12 poles ready for cable installation and 3 poles still awaiting power company make-ready (5-week lead time). What is the field-smart approach?',
            choices: [
              'Hold all 15 poles until the 3 power-company poles are done — cable installation must happen in a single continuous pull',
              'Pull cable on all 15 poles, leaving the power-company poles with the cable slack coiled on the ground until make-ready is complete',
              'Pull cable on the 12 ready poles, leave pre-cut gap sections with slack at the 3 power-company poles, splice in after make-ready is complete',
              'Ask the pole owner to expedite the 3 power-company poles by upgrading to emergency service — always an option under FCC rules',
            ],
            answerIndex: 2,
            explanation: 'Phased installation is the efficient approach: pull cable on the 12 ready poles, leave gap sections with slack at the 3 power-company poles (effectively "parking" the cable at those locations), then send a splice crew to complete the connections after make-ready is done. This keeps the cable installation crew productive instead of idle. Option 2 (cable on the ground) creates a damage and trip hazard. Option 1 (hold everything) wastes 5 weeks of crew availability. Emergency service from the power company exists but is expensive and not guaranteed. (T08.L09 — phased installation.)',
          },
        ]}
      />

    </LessonLayout>
  );
}
