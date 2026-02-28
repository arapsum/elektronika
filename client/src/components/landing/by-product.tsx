import { useState } from "react";
import ProductCard from "@/components/products/card";

const tags = [
  { name: "New Arrival", value: "new-arrivals", isActive: true },
  { name: "Bestseller", value: "bestseller", isActive: false },
  { name: "Featured Products", value: "featured", isActive: false },
];

const newArrivals = [
  {
    name: "Apple iPhone 14 Pro Max 128GB Deep Purple",
    price: 899,
    image: "/new-arrivals/iphone-14-pro.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Blackmagic Pocket Cinema Camera 6K",
    price: 2359,
    image: "/new-arrivals/blackmagic.png",
    isWishlisted: true,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Apple Watch Series 9 41mm Starlight Aluminium",
    price: 399,
    image: "/new-arrivals/apple-watch.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Airpods Max Silver Starlight Aluminium",
    price: 549,
    image: "/new-arrivals/apple-headphones.png",
    isWishlisted: true,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Samsung Galaxy Watch 6 Classic 47mm Black",
    price: 369,
    image: "/new-arrivals/samsung-watch.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Samsung Galaxy Z Fold 256GB Phantom Black",
    price: 1659,
    image: "/new-arrivals/samsung-z-fold.png",
    isWishlisted: true,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Samsung Galaxy Buds FE Graphite",
    price: 159,
    image: "/new-arrivals/galaxy-earbuds.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: 'Apple iPad 9 10.2" 128GB Silver (MK2L3) 2022',
    price: 1265,
    image: "/new-arrivals/apple-ipad.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },

  {
    name: "Apple iPhone 14 Pro Max 256GB Deep Purple",
    price: 1099,
    image: "/new-arrivals/iphone-14-pro-2.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max 256GB Deep Purple",
  },
];

export function BrowseByProducts() {
  const [activeTag, setActiveTag] = useState("new-arrivals");

  return (
    <section className="px-4 py-14 space-y-8 xl:px-40 lg:px-16 md:px-8">
      {/* Header tabs */}
      <div className="flex items-center justify-between md:justify-start gap-8">
        {tags.map((tag) => (
          <button
            type="button"
            onClick={() => setActiveTag(tag.value)}
            key={tag.value}
            className="hover:text-black/75 transition-transform duration-300"
          >
            <h1
              className={`font-medium text-base leading-8 ${activeTag === tag.value ? "underlined-text text-black" : "text-[#8B8B8B]"}`}
            >
              {tag.name}
            </h1>
          </button>
        ))}
      </div>
      {/* Product Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 space-y-4 gap-4">
        {newArrivals.slice(0, 8).map((item) => (
          <ProductCard key={item.name} {...item} />
        ))}
        <div className="hidden sm:block md:block lg:hidden">
          {newArrivals.slice(8, 9).map((item) => (
            <ProductCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
