import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ExposureGaugeProps {
  score: number; // 0 to 100
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  totalFindings: number;
}

export function ExposureGauge({ score, threatLevel, totalFindings }: ExposureGaugeProps) {
  // Score color styles
  const getScoreColor = () => {
    if (score >= 75) return { stroke: '#ef4444', text: 'text-red-400', badge: 'bg-red-500/10 border-red-500/30 text-red-400' };
    if (score >= 50) return { stroke: '#f97316', text: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/30 text-orange-400' };
    if (score >= 25) return { stroke: '#eab308', text: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' };
    return { stroke: '#10b981', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
  };

  const colors = getScoreColor();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#0e1422] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div 
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: colors.stroke }}
      />

      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1f293d"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
            Index / 100
          </span>
        </div>
      </div>

      {/* Threat Level & Summary */}
      <div className="flex-1 space-y-2 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${colors.badge}`}>
            {threatLevel} EXPOSURE RISK
          </span>
          <span className="text-xs text-gray-400">
            • {totalFindings} Active Open-Web Records Discovered
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white tracking-tight">
          {score >= 70 ? 'Significant Digital Footprint Vulnerabilities Detected' : 'Manageable Online Surface Detected'}
        </h3>
        
        <p className="text-sm text-gray-400 max-w-xl">
          Neural web search cross-referenced unauthenticated traces, leaked contact identifiers, and publicly exposed project secrets across public search indexes.
        </p>
      </div>

      {/* Mini metric indicators */}
      <div className="grid grid-cols-2 gap-3 w-full md:w-auto flex-shrink-0">
        <div className="bg-[#131b2e] p-3 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block font-mono">CCPA / GDPR</span>
          <span className="text-sm font-bold text-blue-400 mt-0.5 block">Eligible</span>
        </div>
        <div className="bg-[#131b2e] p-3 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block font-mono">Doxxing Risk</span>
          <span className={`text-sm font-bold mt-0.5 block ${colors.text}`}>{threatLevel}</span>
        </div>
      </div>

    </div>
  );
}
