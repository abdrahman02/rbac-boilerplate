import { twMerge } from 'tailwind-merge'

interface AvatarProps {
  name: string
  size?: number
  className?: string
}

function hueFromString(s: string): number {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return h % 360
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

export function Avatar({ name, size = 32, className }: AvatarProps) {
  const hue = hueFromString(name)

  return (
    <span
      className={twMerge(
        'inline-flex items-center justify-center rounded-full select-none shrink-0 font-semibold tracking-tight',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: `oklch(0.78 0.10 ${hue})`,
        color: `oklch(0.28 0.10 ${hue})`,
        boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.04)',
      }}
    >
      {getInitials(name)}
    </span>
  )
}
