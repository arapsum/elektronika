import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  image: string;
  alt: string;
  price: number;
  isWishlisted: boolean;
}

export default function ProductCard({ isWishlisted, image, alt, name, price }: Props) {
  const [isInWhishlist, setIsInWishlist] = useState(isWishlisted);
  return (
    <div className="space-y-2 md:space-y-4 py-6 px-3 md:px-4 bg-[#F6F6F6] rounded-[9px] max-w-67 h-88 md:h-108 shadow-sm">
      {/* Top section */}
      <div className="w-full flex items-center shrink-0 justify-end p-0 gap-2">
        <button type="button" onClick={() => setIsInWishlist((prev) => !prev)}>
          <HeartIcon
            className={`size-6 md:size-8 transition-transform duration-300 ${isInWhishlist ? "fill-[#FF0000] text-[#FF0000]" : "text-[#909090]"}`}
          />
        </button>
      </div>
      {/* Mid section */}
      <div className="flex items-center justify-center shrink-0">
        <img src={image} alt={alt} className="object-center object-contain size-26 md:size-40" />
      </div>
      {/* Bottom section: Name, price & Button */}
      <div className="flex flex-col gap-4 md:gap-6 justify-between">
        <div className="space-y-4 flex items-center justify-center flex-col">
          <p className="font-medium text-sm md:text-base text-center leading-6 text-black line-clamp-2">
            {name}
          </p>
          <p className="font-semibold leading-6 tracking-[0.03em] text-2xl">£{price}</p>
        </div>

        <Button variant={"default"} className="rounded-md px-16 py-3 h-12 group  hover:bg-black/70">
          <span className="text-sm leading-6 font-medium">Add to Cart</span>
        </Button>
      </div>
    </div>
  );
}
