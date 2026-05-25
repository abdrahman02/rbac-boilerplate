import type { VariantProps } from "tailwind-variants";
import { spinnerVariants } from "./Spinner.variants";

type SpinnerProps = VariantProps<typeof spinnerVariants>;

export function Spinner({ size }: SpinnerProps) {
  return <span className={spinnerVariants({ size })} role="status" aria-label="Loading" />;
}
