import React from 'react';
import BranchingScenario from '../BranchingScenario.jsx';

/**
 * BranchingScenario.example — Aerial permitting make-ready cost scenario.
 *
 * Scenario: A crew is permitting new aerial fiber through a residential ROW.
 * The pole owner quotes a high make-ready estimate. The user must decide
 * how to handle the cost negotiation and whether to request an independent audit.
 *
 * localStorage key: "osp-scenario-m02-makeready-demo"
 * If you clear localStorage, the scenario resets to the start.
 */

const MAKE_READY_NODES = {
  'start': {
    id: 'start',
    prompt:
      'You are permitting a 2.4-mile aerial fiber route through a residential neighborhood. '
      + 'The pole owner (a local electric utility) has sent a make-ready estimate of $42,000 '
      + 'for 38 poles — roughly $1,105 per pole. Your project budget assumed $650/pole based on '
      + 'the last route you permitted in this county. What do you do first?',
    choices: [
      {
        label: 'Accept the estimate and revise the project budget upward.',
        consequence:
          'Accepting without review sets a precedent and may leave money on the table. '
          + 'Make-ready estimates are not always final — utilities sometimes include contingency '
          + 'or apply rates that don\'t match your jurisdiction\'s tariff. This choice is valid if '
          + 'the timeline is critical, but you should still document the delta for future bids.',
        nextId: 'accepted',
        isOptimal: false,
      },
      {
        label: 'Request the utility\'s itemized cost breakdown before responding.',
        consequence:
          'Good call. An itemized breakdown lets you spot line items that are off-rate or '
          + 'duplicated. Under FCC Order 18-30, utilities must provide a cost breakdown within '
          + '60 days of a completed application. This is the standard first move.',
        nextId: 'got-breakdown',
        isOptimal: true,
      },
      {
        label: 'Immediately reject the estimate and threaten to go underground.',
        consequence:
          'Threatening without data weakens your negotiating position. The utility knows '
          + 'underground costs significantly more ($15–$60/ft vs aerial) — an empty threat '
          + 'signals you haven\'t done the math. Get the breakdown first.',
        nextId: 'rejected-blind',
        isOptimal: false,
      },
    ],
  },

  'got-breakdown': {
    id: 'got-breakdown',
    prompt:
      'The utility provides the breakdown. You find two issues: '
      + '(1) Eight poles are billed at the "complex transfer" rate ($1,800 each) but appear from '
      + 'the field photos to be simple bolt-on attachments. '
      + '(2) The estimate includes a $3,200 "engineering study" fee not in the tariff schedule. '
      + 'What is your next move?',
    context:
      'FCC Order 18-30 §§ 70–75 requires attachment rates to match the approved tariff. '
      + 'Disputes must be filed within 90 days of receiving the estimate.',
    choices: [
      {
        label: 'Write a formal dispute letter citing the tariff discrepancy and requesting re-rating of the 8 poles, plus removal of the engineering fee.',
        consequence:
          'Correct approach. A written dispute creates a paper trail, invokes the 90-day dispute window, '
          + 'and is the first step under FCC §1.1416. The utility must respond within 30 days. '
          + 'Potential savings: 8 poles × ($1,800 − $650) = $9,200 + $3,200 fee = ~$12,400.',
        nextId: 'dispute-filed',
        isOptimal: true,
      },
      {
        label: 'Negotiate verbally with the utility\'s project manager and accept a compromise.',
        consequence:
          'Verbal negotiations without written documentation leave you without recourse if '
          + 'the utility reverts to the original estimate or changes personnel. Always get '
          + 'any revised estimate in writing. This approach might work but is the riskier path.',
        nextId: 'verbal-resolved',
        isOptimal: false,
      },
    ],
  },

  'dispute-filed': {
    id: 'dispute-filed',
    prompt:
      'The utility reviews your dispute and agrees to re-rate 6 of the 8 contested poles '
      + 'and removes the engineering fee. The revised estimate is $29,900 — a $12,100 reduction. '
      + 'They maintain the "complex transfer" rate on the remaining 2 poles, citing unique '
      + 'construction at those locations. Do you accept the revised estimate?',
    choices: [
      {
        label: 'Accept the revised estimate and proceed with permitting.',
        consequence:
          'A $12,100 savings on a budget overrun is a solid outcome. The remaining 2 poles '
          + 'at complex rate may be legitimate — document your acceptance and move forward. '
          + 'Update your unit-cost database for future bids in this jurisdiction.',
        nextId: 'end-success',
        isOptimal: true,
      },
      {
        label: 'Dispute the remaining 2 poles and escalate to the state PUC.',
        consequence:
          'PUC escalation is a legitimate option but adds 60–180 days to the timeline and '
          + 'significant staff hours. Weigh the ~$2,300 potential additional savings against '
          + 'the schedule impact. This is the right call if you have strong field evidence '
          + 'that the 2 poles are genuinely simple attachments.',
        nextId: 'end-escalated',
        isOptimal: false,
      },
    ],
  },

  'accepted': {
    id: 'accepted',
    prompt: 'You accepted the full estimate. What did you learn from this scenario?',
    isEnd: true,
    endMessage:
      'Accepting without review left approximately $12,100 in recoverable costs on the table. '
      + 'For future routes: always request an itemized breakdown and cross-check line items '
      + 'against the utility\'s filed tariff before accepting any make-ready estimate.',
  },

  'rejected-blind': {
    id: 'rejected-blind',
    prompt: 'The utility called your bluff. How do you recover?',
    context:
      'Underground construction for this 2.4-mile route would cost roughly $280,000 '
      + 'compared to $42,000 aerial — clearly not viable as a negotiating lever.',
    choices: [
      {
        label: 'Walk back the threat and request the itemized breakdown.',
        consequence:
          'The right move, even if you\'re starting from a weaker position. '
          + 'Request the breakdown, document your dispute, and proceed through the formal process.',
        nextId: 'got-breakdown',
        isOptimal: true,
      },
    ],
  },

  'verbal-resolved': {
    id: 'verbal-resolved',
    isEnd: true,
    endMessage:
      'Verbal agreement resolved the immediate dispute, but no paper trail means you\'re '
      + 'exposed if the utility later reasserts the original estimate. '
      + 'For future negotiations: always confirm revised estimates in a written email or letter before committing resources.',
  },

  'end-success': {
    id: 'end-success',
    isEnd: true,
    endMessage:
      'Well handled. You recovered $12,100 through a formal itemized-cost dispute, '
      + 'documented every step, and kept the project moving. '
      + 'Key takeaway: make-ready estimates are not fixed prices — utilities sometimes '
      + 'apply incorrect rate categories, and FCC Order 18-30 gives you the tools to challenge them.',
  },

  'end-escalated': {
    id: 'end-escalated',
    isEnd: true,
    endMessage:
      'PUC escalation is in progress. You may recover an additional ~$2,300 but '
      + 'the project is on hold for 60–180 days. Whether that trade-off makes sense '
      + 'depends on your contract timeline and client expectations. '
      + 'Document everything carefully — PUC proceedings are public record.',
  },
};

export default function BranchingScenarioExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">
        BranchingScenario — Example Usage
      </h1>

      <BranchingScenario
        scenarioId="m02-makeready-demo"
        title="Make-Ready Cost Dispute"
        description={
          'You are the permitting engineer on an aerial fiber route. '
          + 'The pole owner\'s make-ready estimate comes in well above budget. '
          + 'Work through the negotiation — your decisions determine the outcome.'
        }
        startNodeId="start"
        nodes={MAKE_READY_NODES}
      />
    </div>
  );
}
