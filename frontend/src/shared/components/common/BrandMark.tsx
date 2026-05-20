export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 mb-9">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
          <rect x="10" y="3" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
          <rect x="3" y="10" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
          <rect x="10" y="10" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div className="flex flex-col leading-[1.1]">
        <span className="text-[15px] font-semibold tracking-[-0.01em]">RBAC Control</span>
        <span className="text-[11.5px] text-muted-foreground">Access Management</span>
      </div>
    </div>
  )
}
