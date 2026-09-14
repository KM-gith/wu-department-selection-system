import React from "react";

export function Panel({ children, className = "", ...rest }) {
  return (
    <div className={`bg-paperraised border border-hairline rounded ${className}`} {...rest}>
      {children}
    </div>
  );
}

const pillTones = {
  navy: "bg-[#E7ECF3] text-navy",
  moss: "bg-moss-soft text-moss",
  rust: "bg-rust-soft text-rust",
  gold: "bg-[#F5E9D1] text-gold",
};

export function Pill({ children, tone = "navy" }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pillTones[tone]}`}>
      {children}
    </span>
  );
}

export function PrimaryButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`inline-flex items-center gap-2 bg-navy text-white font-semibold text-sm rounded px-4 py-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-navy-soft transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const ghostTones = {
  navy: "text-navy border-navy",
  rust: "text-rust border-rust",
  moss: "text-moss border-moss",
};

export function GhostButton({ children, tone = "navy", className = "", ...rest }) {
  return (
    <button
      className={`inline-flex items-center gap-2 bg-transparent border font-semibold text-sm rounded px-3.5 py-2 ${ghostTones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-xs font-semibold text-inksoft mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full px-3 py-2.5 border border-hairline rounded text-sm text-ink bg-white box-border focus:outline-none focus:ring-2 focus:ring-navy-soft";
