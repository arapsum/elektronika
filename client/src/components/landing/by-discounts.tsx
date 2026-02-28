import ProductCard from "@/components/products/card";

const discountedProducts = [
  {
    name: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
    price: 699,
    image: "/discounted/iphone-14-pro-512gb.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Apple AirPods Max Silver (AX656)",
    price: 359,
    image: "/discounted/airpods-max-silver.png",
    isWishlisted: true,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium Case",
    price: 299,
    image: "/discounted/apple-watch.png",
    isWishlisted: false,
    alt: "iPhone 14 Pro Max Deep Purple",
  },
  {
    name: "Apple iPhone 14 Pro 1TB Gold (MQ2V3)",
    price: 649,
    image: "/discounted/iphone-14-pro-1tb.png",
    isWishlisted: true,
    alt: "iPhone 14 Pro Max White",
  },
];

export function DiscountedProducts() {
  return (
    <section className="w-full px-4 py-14 md:px-36 lg:px-40 bg-white xl:py-20 space-y-8">
      {/* Header */}
      <h1 className="font-medium text-black text-2xl leading-8">Discounts up to -50%</h1>
      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {discountedProducts.map((item) => (
          <ProductCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}
