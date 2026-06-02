import type { ToasterProps } from "sonner";

export { toast } from "sonner";

export const TOAST_OPTIONS: NonNullable<ToasterProps["toastOptions"]> = {
  unstyled: true,
  closeButton: true,
  classNames: {
    toast:
      "!flex !items-start !gap-3 !relative !rounded-xl !border !border-border !bg-card !px-4 !py-3.5 !shadow-md !min-w-[320px] !max-w-[380px] !overflow-hidden",
    content: "!flex-1 !min-w-0",
    title: "!text-[13.5px] !font-semibold !leading-snug !tracking-tight !text-foreground",
    description: "!text-xs !leading-relaxed !text-muted-foreground !mt-0.5",
    icon: "!size-8 !min-w-8 !rounded-lg !bg-muted !text-muted-foreground !flex !items-center !justify-center !shrink-0 !mt-0.5",
    closeButton:
      "!absolute !top-2 !right-2 !size-5 !rounded !border !border-border !bg-transparent !text-muted-foreground hover:!bg-muted hover:!text-foreground !transition-colors !cursor-pointer !flex !items-center !justify-center",
    success: "!border-l-4 !border-l-success",
    error: "!border-l-4 !border-l-destructive",
    warning: "!border-l-4 !border-l-warning",
    info: "!border-l-4 !border-l-primary",
    loading: "!border-l-4 !border-l-muted-foreground",
  },
};
