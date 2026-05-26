import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ReactNode } from "react";
import { pageBtnVariants } from "./Pagination.variants";

interface PaginationProps {
  /** 1-indexed current page */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function buildPageWindow(page: number, totalPages: number, maxButtons = 7): PageItem[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const innerWidth = maxButtons - 4; // 1 first + 1 last + 2 ellipsis slots
  const half = Math.floor(innerWidth / 2);
  let start = Math.max(2, page - half);
  const end = Math.min(totalPages - 1, start + innerWidth - 1);
  if (end - start + 1 < innerWidth) start = Math.max(2, end - innerWidth + 1);

  const out: PageItem[] = [1];
  if (start > 2) out.push("ellipsis-start");
  for (let p = start; p <= end; p++) out.push(p);
  if (end < totalPages - 1) out.push("ellipsis-end");
  out.push(totalPages);
  return out;
}

export function Pagination({ page, pageSize, total, onPageChange, label = "items" }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const pages = buildPageWindow(page, totalPages);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <span className="text-[12.5px] text-muted-foreground">
        Showing{" "}
        <b className="text-foreground font-semibold">
          {from}–{to}
        </b>{" "}
        of <b className="text-foreground font-semibold">{total}</b> {label}
      </span>

      <div className="flex items-center gap-1">
        <PageBtn onClick={() => onPageChange(1)} disabled={page <= 1} title="First page" iconOnly>
          <ChevronsLeft size={14} />
        </PageBtn>
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page <= 1} title="Previous page" iconOnly>
          <ChevronLeft size={14} />
        </PageBtn>

        {pages.map((p) =>
          p === "ellipsis-start" || p === "ellipsis-end" ? (
            <span key={p} className="w-8 h-8 inline-flex items-center justify-center text-[13px] text-muted-foreground">
              …
            </span>
          ) : (
            <PageBtn key={p} onClick={() => onPageChange(p)} active={p === page} title={`Page ${p}`}>
              {p}
            </PageBtn>
          ),
        )}

        <PageBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} title="Next page" iconOnly>
          <ChevronRight size={14} />
        </PageBtn>
        <PageBtn onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} title="Last page" iconOnly>
          <ChevronsRight size={14} />
        </PageBtn>
      </div>
    </div>
  );
}

interface PageBtnProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  iconOnly?: boolean;
  children: ReactNode;
}

function PageBtn({ active, disabled, onClick, title, iconOnly, children }: PageBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={pageBtnVariants({ active, disabled, iconOnly })}
    >
      {children}
    </button>
  );
}
