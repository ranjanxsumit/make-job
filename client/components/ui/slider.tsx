import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  thumbLeft?: string;
  thumbRight?: string;
};

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbLeft, thumbRight, ...props }, ref) => {
    const left = thumbLeft ?? "/components/ui/ellipse-1.svg";
    const right = thumbRight ?? "/components/ui/ellipse-2.svg";
    return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden bg-neutral-200">
          <SliderPrimitive.Range className="absolute h-1.5 top-1/2 -translate-y-1/2 bg-black rounded-full" />
        </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full bg-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden flex items-center justify-center"
  style={left ? { backgroundImage: `url("${left}")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } : undefined}
      />

      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full bg-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden flex items-center justify-center"
  style={right ? { backgroundImage: `url("${right}")`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } : undefined}
      />
    </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
