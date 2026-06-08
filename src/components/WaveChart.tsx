import React from 'react';
import { SolidWaveScannerRow, WaveChartColors } from '../types';

interface WaveChartProps {
  selectedStock: SolidWaveScannerRow | null;
  minFib: number;
  chartColors?: WaveChartColors;
}

const defaultColors: WaveChartColors = {
  wave1: '#94a3b8', // slate-400
  wave2: '#10b981', // emerald-500
  wave3: '#eab308', // amber-500
  wave4: '#f97316', // orange-500
  wave5: '#d4af37', // royal-gold
  fibLevel: '#1e293b', // slate-800
  fibZone: '#cbd5e1', // slate-300
};

export default function WaveChart({ selectedStock, minFib, chartColors }: WaveChartProps) {
  const colors = chartColors || defaultColors;

  // Generate a path representing an idealized Elliott Wave
  // Wave 0 (0,90) -> Wave 1 (60,40) -> Wave 2 (100, 75) -> Wave 3 (200,10) -> Wave 4 (240,45) -> Wave 5 (320, 0)
  // Corrective A (360,35) -> B (400, 20) -> C (460, 70)
  
  const width = 500;
  const height = 220;

  // Let's modify coordinates slightly based on the momentum of the selected stock
  const momentumFactor = selectedStock ? Math.min(1.5, Math.max(0.5, 1 + selectedStock.momentum / 100)) : 1.0;
  
  // Custom adjusted coordinates
  const p0 = { x: 30, y: 170 };
  const p1 = { x: 90, y: 110 };
  // Wave 2 retracement is affected by minFib
  const wave1Height = p0.y - p1.y;
  const retracementY = p1.y + (wave1Height * minFib);
  const p2 = { x: 130, y: retracementY };
  // Wave 3 is the giant wave, amplified by momentum
  const p3 = { x: 230, y: Math.max(10, 110 - (wave1Height * 2.8 * momentumFactor)) };
  const p4 = { x: 280, y: p3.y + 35 };
  const p5 = { x: 360, y: Math.max(5, p4.y - 45) };
  
  // Correction waves
  const pa = { x: 400, y: p5.y + 30 };
  const pb = { x: 430, y: pa.y - 15 };
  const pc = { x: 470, y: pa.y + 40 };

  const points = [p0, p1, p2, p3, p4, p5, pa, pb, pc];

  return (
    <div className="bg-royal-card-bg border border-slate-800 rounded-xl p-5 relative overflow-hidden" id="wave-chart">
      {/* Background radial glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400">
            مخطط الموجة الكسيرية التفاعلي (إليوت وفيبيوناشي)
          </h3>
          <p className="text-xs text-royal-gold/90 mt-0.5">
            {selectedStock ? `سهم ${selectedStock.name} (${selectedStock.symbol})` : 'التشكيل القياسي لموجة الرادار المليارية'}
          </p>
        </div>
        <div className="flex space-x-2 space-x-reverse text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" style={{ borderColor: `${colors.fibLevel}40` }}>
            مستهدف فيبوناتشي: {(minFib * 100).toFixed(0)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-royal-gold border border-amber-500/20" style={{ color: colors.wave3, borderColor: `${colors.wave3}30` }}>
            الموجة الدافعة 3 🔥
          </span>
        </div>
      </div>

      <div className="relative flex justify-center items-center h-48 bg-slate-950/40 rounded-lg p-2 border border-slate-900/60 overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines using custom Fibonacci level style color */}
          <line x1="0" y1="50" x2={width} y2="50" stroke={colors.fibLevel} strokeDasharray="3 3" opacity={0.6} />
          <line x1="0" y1="110" x2={width} y2="110" stroke={colors.fibLevel} strokeDasharray="3 3" opacity={0.6} />
          <line x1="0" y1="170" x2={width} y2="170" stroke={colors.fibLevel} strokeDasharray="3 3" opacity={0.6} />

          {/* Fibonacci Target Zone with custom zone colors */}
          <rect 
            x="85" 
            y={Math.min(p1.y, retracementY)} 
            width="60" 
            height={Math.abs(retracementY - p1.y)} 
            fill={`${colors.fibZone}10`} 
            stroke={colors.fibZone}
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text x="115" y={p1.y - 12} fontSize="9" fill={colors.fibZone} fontWeight="bold" textAnchor="middle" className="font-mono">
            منطقة فيبو {(minFib * 100).toFixed(0)}%
          </text>

          {/* Individual Customizable Wave Lines for Waves 1, 2, 3, 4, 5 & Corrections */}
          {/* Wave 1: p0 -> p1 */}
          <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={colors.wave1} strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Wave 2: p1 -> p2 */}
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={colors.wave2} strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Wave 3: p2 -> p3 */}
          <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke={colors.wave3} strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Wave 4: p3 -> p4 */}
          <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke={colors.wave4} strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Wave 5: p4 -> p5 */}
          <line x1={p4.x} y1={p4.y} x2={p5.x} y2={p5.y} stroke={colors.wave5} strokeWidth="4.0" strokeLinecap="round" />
          
          {/* Correction lines - standard or slightly styled to distinguish */}
          <line x1={p5.x} y1={p5.y} x2={pa.x} y2={pa.y} stroke="#f87171" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
          <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
          <line x1={pb.x} y1={pb.y} x2={pc.x} y2={pc.y} stroke="#ef4444" strokeWidth="3.0" strokeLinecap="round" />

          {/* Glowing points and Labels */}
          {points.map((p, idx) => {
            let label = '';
            let color = '#cbd5e1';
            let size = 5;

            if (idx === 0) { label = 'البداية'; color = colors.wave1; }
            if (idx === 1) { label = 'الموجة 1'; size = 6; color = colors.wave1; }
            if (idx === 2) { label = `الموجة 2 (${(minFib * 100).toFixed(0)}%)`; size = 7; color = colors.wave2; }
            if (idx === 3) { label = 'الموجة 3 🚀'; size = 8; color = colors.wave3; }
            if (idx === 4) { label = 'الموجة 4'; size = 6; color = colors.wave4; }
            if (idx === 5) { label = 'الموجة 5 👑'; size = 7; color = colors.wave5; }
            if (idx === 6) { label = 'A'; color = '#f87171'; }
            if (idx === 7) { label = 'B'; color = '#60a5fa'; }
            if (idx === 8) { label = 'C 📉'; color = '#ef4444'; size = 6; }

            return (
              <g key={idx}>
                {/* Outer halo */}
                <circle cx={p.x} cy={p.y} r={size + 4} fill={color} opacity="0.2" />
                {/* Core point */}
                <circle cx={p.x} cy={p.y} r={size} fill={color} stroke="#070a13" strokeWidth="1.5" />
                {/* Text descriptor */}
                <text 
                  x={p.x} 
                  y={p.y - size - 6} 
                  fontSize="9.5" 
                  fill={color} 
                  fontWeight={size > 6 ? "bold" : "normal"}
                  textAnchor="middle"
                  className="font-sans"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic metadata watermark in background */}
        <div className="absolute bottom-1 right-2 font-mono text-[9px] text-slate-600 uppercase tracking-widest pointer-events-none select-none">
          V-BILLIONAIRE COGNITIVE WAVE ENGINE
        </div>
      </div>

      {selectedStock && (
        <div className="mt-3 flex justify-between text-xs bg-slate-950/20 p-2 rounded border border-slate-900/40 text-slate-300">
          <div>
            <span>قوة الزخم: </span>
            <span className={`font-mono font-medium ${selectedStock.momentum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {selectedStock.momentum}%
            </span>
          </div>
          <div>
            <span>تطابق النمط: </span>
            <span className="font-mono font-medium text-amber-400">{selectedStock.patternScore}%</span>
          </div>
          <div>
            <span>العائد المتوقع: </span>
            <span className="font-mono font-medium text-emerald-400">+{selectedStock.expectedGain}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

