import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      primary:
        "bg-brand-gradient text-white hover:shadow-glow transition-all duration-300",
      secondary:
        "bg-orange-gradient text-white hover:shadow-glow transition-all duration-300",
      outline:
        "border-2 border-transparent bg-clip-padding bg-brand-gradient text-transparent font-semibold hover:text-white hover:bg-brand-gradient transition-all duration-300 relative overflow-hidden",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <Comp
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

GradientButton.displayName = "GradientButton";

export { GradientButton };
