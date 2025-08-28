// components/ui/PasswordStrengthMeter.jsx
import React from 'react';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'At least one number', test: (p) => /[0-9]/.test(p) },
];

const getStrength = (validCount) => {
  if (validCount === 4) return { label: 'Strong', color: 'bg-green-500' };
  if (validCount >= 2) return { label: 'Medium', color: 'bg-yellow-400' };
  return { label: 'Weak', color: 'bg-red-500' };
};

const PasswordStrengthMeter = ({ password }) => {
  const validations = rules.map(rule => ({
    label: rule.label,
    valid: rule.test(password),
  }));

  const validCount = validations.filter(v => v.valid).length;
  const strength = getStrength(validCount);

  return (
    <div className="mt-2 text-white">
      <ul className="text-sm space-y-1 pl-4">
        {validations.map((item, idx) => (
          <li key={idx} className={`flex items-center gap-2 ${item.valid ? 'text-green-400' : 'text-red-400'}`}>
            <span className="transition-all">{item.valid ? '✔' : '❌'}</span>
            {item.label}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-in-out ${strength.color}`}
            style={{ width: `${(validCount / rules.length) * 100}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-white/80">
          Strength: <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
