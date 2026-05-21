import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  style?: CSSProperties
}

export function MailIcon({ size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.5 5.5L8 9.5L14.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LockIcon({ size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 7.5V5a3 3 0 0 1 6 0v2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
    </svg>
  )
}

export function EyeIcon({ size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M1.5 8s2-4.5 6.5-4.5S14.5 8 14.5 8s-2 4.5-6.5 4.5S1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function EyeOffIcon({ size = 16, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M2 2L14 14M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.8 5.3 1.5 8 1.5 8s2 4.5 6.5 4.5c1.4 0 2.6-.4 3.6-1M7 3.6c.3-.1.7-.1 1-.1 4.5 0 6.5 4.5 6.5 4.5s-.4.9-1.2 1.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CheckIcon({ size = 26, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 14, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M9 11L5 7l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
