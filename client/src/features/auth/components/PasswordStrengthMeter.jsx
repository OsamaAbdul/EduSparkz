import React from 'react';
import { Check, X } from "lucide-react";

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'At least one number', test: (p) => /[0-9]/.test(p) },
];

const getStrength = (validCount) => {
  if (validCount === 4) return { label: 'Strong', color: 'bg-electric-lime', textColor: 'text-electric-lime', glow: 'shadow-[0_0_10px_rgba(50,255,100,0.5)]' };
  if (validCount >= 2) return { label: 'Medium', color: 'bg-electric-cyan', textColor: 'text-electric-cyan', glow: 'shadow-[0_0_10px_rgba(0,245,255,0.5)]' };
  return { label: 'Weak', color: 'bg-hot-magenta', textColor: 'text-hot-magenta', glow: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]' };
};

const PasswordStrengthMeter = ({ password = '' }) => {
  const validations = rules.map(rule => ({
    label: rule.label,
    valid: rule.test(password),
  }));

  const validCount = validations.filter(v => v.valid).length;
  const strength = getStrength(validCount);
  const progress = Math.max(5, (validCount / rules.length) * 100); // Min 5% width for visibility

  return (
    <div className="mt-4 space-y-4">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Password Strength</span>
          <span className={`font-bold ${strength.textColor} transition-colors duration-300`}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color} ${strength.glow}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Validation Rules */}
      <ul className="space-y-2">
        {validations.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2.5 text-sm transition-colors duration-300">
            <div className={`
              w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-300
              ${item.valid
                ? 'bg-electric-lime/10 border-electric-lime text-electric-lime'
                : 'bg-white/5 border-white/10 text-gray-500'}
            `}>
              {item.valid ? (
                <Check className="w-2.5 h-2.5" />
              ) : (
                <X className="w-2.5 h-2.5" />
              )}
            </div>
            <span className={`transition-colors duration-300 ${item.valid ? 'text-white' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;