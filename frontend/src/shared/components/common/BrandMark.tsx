interface BrandMarkProps {
  collapsed?: boolean
}

export function BrandMark({ collapsed = false }: BrandMarkProps) {
  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
      <div
        className="w-8 h-8 rounded-[9px] bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0"
        style={{ boxShadow: 'inset 0 -1px 0 rgb(255 255 255 / 0.08), 0 1px 2px rgb(0 0 0 / 0.08)' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 4 6v6c0 4.6 3.2 7.7 8 9 4.8-1.3 8-4.4 8-9V6l-8-3z" />
          <path d="M9 12.5 11 14.5 15.5 10" />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-[1.1]">
          <span className="text-[14px] font-semibold tracking-[-0.01em]">Bedrock</span>
          <span className="text-[11px] text-muted-foreground">Access Control</span>
        </div>
      )}
    </div>
  )
}
