import React, { useEffect, useRef, useState } from 'react';

/**
 * TopologyCanvas — minimal "Nodes & Connections" engine for OSP fiber
 * routing. Nodes are draggable; click two nodes in succession to draw a
 * fiber strand between them. Click a strand to delete it.
 *
 * Persisted to localStorage so the user's sketch survives reload.
 *
 * This is a teaching aid, not a fiber-management system. It deliberately
 * reproduces the core action of replacing manual Excel/Visio splice
 * tracking with something interactive — but it does not import KMZ,
 * does not hold splice matrices, and does not export to a real
 * outside-plant DB.
 */

const STORAGE_KEY = 'osp.topology.v1';

const NODE_TYPES = [
  { type: 'pop',     label: 'POP / Hut',          color: '#f59e0b' },
  { type: 'fdh',     label: 'FDH Cabinet',        color: '#22d3ee' },
  { type: 'splice',  label: 'Splice Closure',     color: '#a3e635' },
  { type: 'tap',     label: 'Tap / NID',          color: '#fb923c' },
  { type: 'cust',    label: 'Customer ONT',       color: '#e879f9' },
];

const NODE_SHAPE = { w: 110, h: 36 };

export default function TopologyCanvas() {
  const [nodes, setNodes] = useState(() => load()?.nodes || sampleNodes());
  const [edges, setEdges] = useState(() => load()?.edges || sampleEdges());
  const [selected, setSelected] = useState(null);   // node id selected for edge creation
  const [drag, setDrag] = useState(null);           // { id, dx, dy }
  const [strands, setStrands] = useState(2);        // # fibers per new edge
  const svgRef = useRef(null);

  useEffect(() => save({ nodes, edges }), [nodes, edges]);

  function addNode(type) {
    const def = NODE_TYPES.find(n => n.type === type);
    const id  = `n${Date.now().toString(36)}`;
    const n   = { id, type, label: def.label, x: 60, y: 60 };
    setNodes(ns => [...ns, n]);
  }

  function nodePointerDown(e, n) {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    setDrag({ id: n.id, dx: e.clientX - rect.left - n.x, dy: e.clientY - rect.top - n.y, moved: false });
  }
  function pointerMove(e) {
    if (!drag) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - drag.dx;
    const y = e.clientY - rect.top  - drag.dy;
    setNodes(ns => ns.map(nn => nn.id === drag.id ? { ...nn, x, y } : nn));
    setDrag(d => ({ ...d, moved: true }));
  }
  function pointerUp() {
    if (drag && !drag.moved) {
      // treat as a click on the node
      handleNodeClick(drag.id);
    }
    setDrag(null);
  }
  function handleNodeClick(id) {
    if (selected == null) { setSelected(id); return; }
    if (selected === id)  { setSelected(null); return; }
    // create edge between selected and id
    setEdges(es => [...es, { id: `e${Date.now().toString(36)}`, from: selected, to: id, strands }]);
    setSelected(null);
  }
  function deleteEdge(id) {
    setEdges(es => es.filter(e => e.id !== id));
  }
  function deleteNode(id) {
    setNodes(ns => ns.filter(n => n.id !== id));
    setEdges(es => es.filter(e => e.from !== id && e.to !== id));
    if (selected === id) setSelected(null);
  }
  function reset() {
    setNodes(sampleNodes()); setEdges(sampleEdges()); setSelected(null);
  }

  const totalStrands = edges.reduce((s, e) => s + (e.strands || 0), 0);

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Topology Canvas</h3>
        <div className="text-xs text-slate-300/70">
          {nodes.length} nodes &middot; {edges.length} runs &middot; {totalStrands} strands total
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {NODE_TYPES.map(t => (
          <button key={t.type} onClick={() => addNode(t.type)}
                  className="btn-ghost text-xs"
                  style={{ borderColor: t.color, color: t.color }}>
            + {t.label}
          </button>
        ))}
        <label className="text-xs flex items-center gap-2 ml-auto">
          Strands per new run:
          <input type="number" min="1" step="1" value={strands}
                 onChange={(e) => setStrands(Math.max(1, Number(e.target.value)))}
                 className="w-16 bg-black/40 border border-white/15 rounded px-2 py-0.5 font-mono text-right"/>
        </label>
        <button className="btn-ghost text-xs" onClick={reset}>Reset</button>
      </div>

      <p className="text-[11px] text-slate-300/70 mb-2">
        Click a node to start a run. Click another node to connect them.
        Click a run to remove it. Drag nodes to lay out. Right-click a node
        (or shift-click) to delete it.
      </p>

      <svg
        ref={svgRef}
        viewBox="0 0 800 380"
        className="w-full bg-black/40 rounded-lg border border-white/10 select-none"
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onClick={() => setSelected(null)}
      >
        {/* edges */}
        {edges.map(e => {
          const a = nodes.find(n => n.id === e.from);
          const b = nodes.find(n => n.id === e.to);
          if (!a || !b) return null;
          const x1 = a.x + NODE_SHAPE.w / 2;
          const y1 = a.y + NODE_SHAPE.h / 2;
          const x2 = b.x + NODE_SHAPE.w / 2;
          const y2 = b.y + NODE_SHAPE.h / 2;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          return (
            <g key={e.id} className="cursor-pointer" onClick={(ev) => { ev.stopPropagation(); deleteEdge(e.id); }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeOpacity="0.7" strokeWidth="2"/>
              <circle cx={mx} cy={my} r="9" fill="#0f172a" stroke="#fbbf24"/>
              <text x={mx} y={my + 3} fill="#fbbf24" fontSize="10" textAnchor="middle">{e.strands}f</text>
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map(n => {
          const def = NODE_TYPES.find(t => t.type === n.type) || NODE_TYPES[0];
          const isSel = selected === n.id;
          return (
            <g key={n.id}
               transform={`translate(${n.x}, ${n.y})`}
               onPointerDown={(e) => nodePointerDown(e, n)}
               onContextMenu={(e) => { e.preventDefault(); deleteNode(n.id); }}
               onClickCapture={(e) => { if (e.shiftKey) { e.stopPropagation(); deleteNode(n.id); } }}
               className="cursor-grab active:cursor-grabbing">
              <rect width={NODE_SHAPE.w} height={NODE_SHAPE.h} rx="6"
                    fill="#0f172a" stroke={def.color}
                    strokeWidth={isSel ? 3 : 1.5}/>
              <circle cx="10" cy={NODE_SHAPE.h / 2} r="4" fill={def.color}/>
              <text x="20" y={NODE_SHAPE.h / 2 + 4} fontSize="11" fill="#e2e8f0">{n.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
function save(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

function sampleNodes() {
  return [
    { id: 'pop1',  type: 'pop',    label: 'POP / Hut',       x:  40, y: 160 },
    { id: 'sp1',   type: 'splice', label: 'Splice Closure',  x: 220, y: 100 },
    { id: 'fdh1',  type: 'fdh',    label: 'FDH-A1',          x: 400, y: 160 },
    { id: 'tap1',  type: 'tap',    label: 'Tap NAP-04',      x: 580, y: 100 },
    { id: 'cust1', type: 'cust',   label: 'ONT 18 Maple',    x: 700, y:  60 },
    { id: 'cust2', type: 'cust',   label: 'ONT 22 Maple',    x: 700, y: 140 },
  ];
}
function sampleEdges() {
  return [
    { id: 'e1', from: 'pop1',  to: 'sp1',  strands: 144 },
    { id: 'e2', from: 'sp1',   to: 'fdh1', strands:  48 },
    { id: 'e3', from: 'fdh1',  to: 'tap1', strands:  12 },
    { id: 'e4', from: 'tap1',  to: 'cust1', strands: 1 },
    { id: 'e5', from: 'tap1',  to: 'cust2', strands: 1 },
  ];
}
