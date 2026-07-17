import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"a"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<HTMLAnchorElement, ShimmerButtonProps>(
  ({ shimmerColor = "#ffffff", shimmerSize = "0.05em", shimmerDuration = "3s", borderRadius = "100px", background = "rgba(0, 0, 0, 1)", className, children, ...props }, ref) => <a
    ref={ref}
    style={{ "--spread": "90deg", "--shimmer-color": shimmerColor, "--radius": borderRadius, "--speed": shimmerDuration, "--cut": shimmerSize, "--bg": background } as CSSProperties}
    className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden border border-white/10 px-6 py-3 text-white [border-radius:var(--radius)] [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px ${className ?? ""}`}
    {...props}
  >
    <span aria-hidden="true" className="-z-30 absolute inset-0 overflow-visible blur-[2px] [container-type:size]"><span className="absolute inset-0 aspect-square h-[100cqh] animate-[magicui-shimmer-slide_var(--speed)_ease-in-out_infinite_alternate]"><span className="absolute -inset-full w-auto animate-[magicui-spin-around_calc(var(--speed)*2)_infinite_linear] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" /></span></span>
    <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    <span aria-hidden="true" className="absolute inset-0 size-full rounded-2xl shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
    <span aria-hidden="true" className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
  </a>
);

ShimmerButton.displayName = "ShimmerButton";
