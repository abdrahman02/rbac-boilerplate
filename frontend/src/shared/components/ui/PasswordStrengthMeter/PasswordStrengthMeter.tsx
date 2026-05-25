const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

const STRENGTH_BAR_CLASSES = ["bg-destructive", "bg-destructive", "bg-warning", "bg-primary", "bg-success"] as const;

const STRENGTH_TEXT_CLASSES = [
  "text-destructive",
  "text-destructive",
  "text-warning",
  "text-primary",
  "text-success",
] as const;

export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const level = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div
      className="flex items-center gap-2 mt-1.5"
      role="meter"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={4}
      aria-label={`Password strength: ${STRENGTH_LABELS[level]}`}
    >
      <div className="flex gap-[3px] flex-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`flex-1 h-1 rounded-sm transition-colors ${
              i <= level ? STRENGTH_BAR_CLASSES[level] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className={`text-[11.5px] font-medium min-w-[52px] text-right ${STRENGTH_TEXT_CLASSES[level]}`}>
        {STRENGTH_LABELS[level]}
      </span>
    </div>
  );
}
