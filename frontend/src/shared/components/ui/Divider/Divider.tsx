interface DividerProps {
  label?: string
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-2.5 my-6 text-xs text-muted-foreground tracking-widest">
      <span className="flex-1 h-px bg-border" />
      {label}
      <span className="flex-1 h-px bg-border" />
    </div>
  )
}
