import React from 'react';

export default function VellumLogo({ className = "w-5 h-5", showText = true, subtitle = null }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative flex items-center justify-center">
        {/* Geometric Diamond Seal Logo */}
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} text-white`}
        >
          <rect
            x="14"
            y="2"
            width="17"
            height="17"
            transform="rotate(45 14 2)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-neutral-100"
          />
          <rect
            x="14"
            y="7"
            width="10"
            height="10"
            transform="rotate(45 14 7)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="text-neutral-500"
          />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" className="text-white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-white leading-none">
              Vellum
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
              CORE
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-neutral-500 font-mono tracking-tight mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
