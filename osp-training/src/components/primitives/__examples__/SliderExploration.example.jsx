import React from 'react';
import SliderExploration from '../SliderExploration.jsx';

/**
 * SliderExploration.example — Live optical link budget sandbox.
 *
 * The user adjusts fiber length, splice count, and connector count to watch
 * the link budget headroom change in real time. Shows the "warn" and "error"
 * status paths as well as the "ok" path.
 */

const LINK_BUDGET_VARS = [
  { key: 'txPower',    label: 'Transmitter power',       units: 'dBm',    min: -5,  max: 10,  step: 0.5,  default: 3   },
  { key: 'rxSens',     label: 'Receiver sensitivity',    units: 'dBm',    min: -35, max: -10, step: 0.5,  default: -24 },
  { key: 'lengthKm',   label: 'Fiber length',            units: 'km',     min: 1,   max: 80,  step: 1,    default: 18  },
  { key: 'dbPerKm',    label: 'Fiber attenuation',       units: 'dB/km',  min: 0.18, max: 0.4, step: 0.01, default: 0.25 },
  { key: 'splices',    label: 'Fusion splice count',     units: 'splices', min: 0,  max: 30,  step: 1,    default: 6   },
  { key: 'connectors', label: 'Connector pairs',         units: 'pairs',  min: 0,  max: 12,  step: 1,    default: 4   },
];

function computeLinkBudget({ txPower, rxSens, lengthKm, dbPerKm, splices, connectors }) {
  const fiberLoss  = lengthKm * dbPerKm;
  const spliceLoss = splices * 0.10;       // FOA field rule: 0.10 dB/fusion splice
  const connLoss   = connectors * 0.30;    // FOA field rule: 0.30 dB/mated pair
  const margin     = 3;                    // 3 dB aging/safety margin
  const totalLoss  = fiberLoss + spliceLoss + connLoss + margin;
  const budget     = txPower - rxSens;     // available optical budget in dB
  const headroom   = budget - totalLoss;

  let status, statusMessage;
  if (headroom >= 3) {
    status = 'ok';
    statusMessage = `${headroom.toFixed(2)} dB of headroom — link closes comfortably. Sanity-check by comparing against an OTDR baseline after installation.`;
  } else if (headroom >= 0) {
    status = 'warn';
    statusMessage = `${headroom.toFixed(2)} dB of headroom — link technically closes but margin is tight. Consider shorter fiber runs, fewer connectors, or better optics for a production design.`;
  } else {
    status = 'error';
    statusMessage = `Link does NOT close — ${Math.abs(headroom).toFixed(2)} dB over budget. Reduce loss or improve the optics.`;
  }

  return { result: headroom, label: 'Headroom', unit: 'dB', status, statusMessage };
}

const REFERENCE_ANNOTATIONS = [
  { value: '3 dB', label: 'Recommended minimum headroom', color: '#16a34a' },
  { value: '0 dB', label: 'Link closure threshold',       color: '#f59e0b' },
];

export default function SliderExplorationExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">SliderExploration — Example Usage</h1>

      <SliderExploration
        title="Link Budget Sandbox"
        description={
          'Move the sliders to see how each variable affects the optical link budget headroom. '
          + 'Try increasing the fiber length or splice count until the link stops closing — '
          + 'that\'s the design limit for this set of optics.'
        }
        variables={LINK_BUDGET_VARS}
        compute={computeLinkBudget}
        annotations={REFERENCE_ANNOTATIONS}
      />
    </div>
  );
}
