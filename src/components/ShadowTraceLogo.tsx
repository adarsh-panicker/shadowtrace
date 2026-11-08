import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function ShadowTraceLogo({ className = '', size = 38 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="radarPulse" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Outline */}
        <path
          d="M50 8 L85 22 V50 C85 71 69 88 50 94 C31 88 15 71 15 50 V22 Z"
          fill="#090d16"
          stroke="url(#shieldGrad)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Concentric Radar Rings */}
        <circle cx="50" cy="48" r="28" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="48" r="19" stroke="#334155" strokeWidth="1.5" />
        <circle cx="50" cy="48" r="10" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />

        {/* Crosshair Grid */}
        <line x1="50" y1="20" x2="50" y2="76" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="22" y1="48" x2="78" y2="48" stroke="#1e293b" strokeWidth="1.2" />

        {/* Central Eye / Iris Pupil */}
        <circle cx="50" cy="48" r="5" fill="#38bdf8" filter="url(#glow)" />
        <circle cx="50" cy="48" r="2.2" fill="#ffffff" />

        {/* Sweeping Radar Beam */}
        <path
          d="M50 48 L72 32 A 28 28 0 0 0 50 20 Z"
          fill="url(#radarPulse)"
          opacity="0.35"
        />

        {/* Alert Node Accent */}
        <circle cx="68" cy="36" r="3.5" fill="#ef4444" />
        <circle cx="68" cy="36" r="6" stroke="#ef4444" strokeWidth="1" opacity="0.75" />
      </svg>
    </div>
  );
}
