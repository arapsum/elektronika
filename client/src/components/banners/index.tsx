import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export { LargeBanner } from "./large-banner";
export { SmallBanners } from "./small-banners";
export { BigBanners } from "./big-banners.tsx";

export const OutlineButton = ({ className }: { className?: string }) => (
  <Button
    variant="outline"
    className={cn(
      "h-14 px-14 py-4 bg-inherit text-white border-[1.5px] border-white/40 rounded-sm transition-transform duration-300 gap-2",
      className,
    )}
  >
    <span className="font-medium leading-6">Shop Now</span>
  </Button>
);
