import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-md hover:bg-cta hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
        secondary:
          "bg-white/10 backdrop-blur-md border border-white/20 text-primary hover:bg-white/20 shadow-glass",
        ghost: "hover:bg-primary/5 text-primary",
        link: "text-cta underline-offset-4 hover:underline",
        glass: "bg-white/70 backdrop-blur-md border border-white/20 text-primary shadow-glass hover:bg-white/90"
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : motion.button

    return (
      <Comp
        ref={ref}
        whileHover={!asChild ? { y: -2, transition: { duration: 0.2 } } : undefined}
        whileTap={!asChild ? { scale: 0.98 } : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as any)}
      />
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

