import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * BranchingScenario — finite state machine decision-tree simulation.
 *
 * Presents a sequence of branching prompts where the user's choices determine
 * the next scenario state. History is tracked so the user can review their
 * path. Progress is persisted to localStorage keyed by `scenarioId` so users
 * can resume across page navigations.
 *
 * @param {string}   scenarioId    - Unique key for localStorage persistence.
 *                                   Use a stable string like "m02-makeready-scenario".
 * @param {string}   title         - Scenario title shown in the header.
 * @param {string}   [description] - Short intro paragraph before the first node.
 * @param {string}   startNodeId   - id of the first node to display.
 * @param {Object}   nodes         - Map of node descriptors keyed by node id:
 *   {
 *     [id]: {
 *       id:          string,
 *       prompt:      string,       // situation description shown to the user
 *       context?:    string,       // optional extra context / background info
 *       choices?:    Array<{       // array of choices (omit for terminal nodes)
 *         label:       string,     // short choice label shown on the button
 *         consequence: string,     // feedback shown after the choice is made
 *         nextId:      string,     // id of the next node (or 'END' to finish)
 *         isOptimal?:  boolean,    // marks the recommended choice for review
 *       }>,
 *       isEnd?:      boolean,      // true for terminal nodes (show summary)
 *       endMessage?: string,       // closing message shown at terminal nodes
 *     }
 *   }
 */
export default function BranchingScenario({
  scenarioId,
  title,
  description,
  startNodeId,
  nodes,
}) {
  const storageKey = `osp-scenario-${scenarioId}`;

  function loadSaved() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return null;
  }

  const saved = loadSaved();
  const [currentNodeId, setCurrentNodeId] = useState(saved?.currentNodeId ?? startNodeId);
  const [history, setHistory]             = useState(saved?.history ?? []);
  const [pendingChoice, setPendingChoice] = useState(null); // { choice, nextId }
  const [done, setDone]                   = useState(saved?.done ?? false);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ currentNodeId, history, done }));
    } catch { /* ignore quota errors */ }
  }, [currentNodeId, history, done, storageKey]);

  const node = nodes[currentNodeId];

  function makeChoice(choice) {
    const entry = { nodeId: currentNodeId, choiceLabel: choice.label, isOptimal: choice.isOptimal };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    setPendingChoice(choice);
  }

  function advance() {
    const nextId = pendingChoice?.nextId;
    setPendingChoice(null);
    if (!nextId || nextId === 'END' || nodes[nextId]?.isEnd) {
      setDone(true);
      if (nextId && nextId !== 'END') setCurrentNodeId(nextId);
    } else {
      setCurrentNodeId(nextId);
    }
  }

  function restart() {
    setCurrentNodeId(startNodeId);
    setHistory([]);
    setPendingChoice(null);
    setDone(false);
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  }

  const optimalCount = history.filter(h => h.isOptimal).length;

  if (done) {
    const endNode = nodes[currentNodeId];
    return (
      <div className="panel space-y-4">
        <h3 className="text-lg font-semibold">{title} — Complete</h3>

        {endNode?.endMessage && (
          <p className="text-slate-200 leading-relaxed">{endNode.endMessage}</p>
        )}

        <div className="rounded-lg bg-black/30 border border-white/10 p-4">
          <p className="text-sm font-semibold text-slate-300 mb-2">Your decision path:</p>
          <ol className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-slate-300/50 shrink-0 w-5 text-right">{i + 1}.</span>
                <span className={h.isOptimal ? 'text-ospgreen' : 'text-slate-200'}>
                  {h.choiceLabel}
                  {h.isOptimal && (
                    <span className="ml-2 text-xs text-ospgreen/70">(recommended)</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-300/70">
            Recommended choices taken: {optimalCount} / {history.length}
          </p>
        </div>

        <button className="btn-primary" onClick={restart}>
          Run scenario again
        </button>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="panel">
        <p className="text-rose-300 text-sm">
          Scenario error: node "{currentNodeId}" not found. Check the nodes prop.
        </p>
      </div>
    );
  }

  return (
    <div className="panel space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {history.length > 0 && (
          <button
            className="text-xs text-slate-300/50 hover:text-slate-300/80 transition"
            onClick={restart}
          >
            Restart
          </button>
        )}
      </div>

      {description && history.length === 0 && (
        <p className="text-sm text-slate-300/70 leading-relaxed border-l-2 border-ospamber/40 pl-3">
          {description}
        </p>
      )}

      {/* Progress breadcrumb */}
      {history.length > 0 && (
        <div className="text-xs text-slate-300/50">
          Step {history.length + 1} — {history.map(h => h.choiceLabel).join(' → ')}
        </div>
      )}

      {/* Current node prompt */}
      <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-2">
        <p className="text-slate-100 leading-relaxed">{node.prompt}</p>
        {node.context && (
          <p className="text-sm text-slate-300/70 leading-relaxed border-t border-white/5 pt-2">
            {node.context}
          </p>
        )}
      </div>

      {/* Consequence reveal after choice */}
      {pendingChoice ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-ospamber/30 bg-ospamber/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              You chose: {pendingChoice.label}
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {pendingChoice.consequence}
            </p>
            {pendingChoice.isOptimal && (
              <p className="mt-2 text-xs text-ospgreen">
                ✓ This is the recommended approach.
              </p>
            )}
          </div>
          <button className="btn-primary" onClick={advance}>
            Continue →
          </button>
        </div>
      ) : (
        /* Choice buttons */
        <div className="space-y-2">
          {(node.choices ?? []).map((choice, i) => (
            <button
              key={i}
              onClick={() => makeChoice(choice)}
              className="w-full text-left px-4 py-3 rounded-lg border border-white/15 hover:border-ospamber/60 hover:bg-ospamber/5 transition text-sm text-slate-200"
            >
              <span className="font-mono text-xs text-slate-300/50 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
