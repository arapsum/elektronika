import ProductCard from "@/components/products/card";

const products = [
  {
    name: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
    image: "/products/iphone-14-pro-1.png",
    alt: "Front & Back view of iphone 14",
    price: 1437,
    isWishlisted: false,
  },
  {
    name: "Airpods Max Silver Starlight Aluminium",
    image: "/products/airpods-max-silver.png",
    alt: "Front & Back view of iphone 14",
    price: 269,
    isWishlisted: false,
  },
  {
    name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
    image: "/products/apple-watch-series-9.png",
    alt: "Front & Back view of iphone 14",
    price: 499,
    isWishlisted: false,
  },
  {
    name: "Apple iPhone 14 Pro 1TB White (MQ234)",
    image: "/products/iphone-14-pro-2.png",
    alt: "Front & Back view of iphone 14",
    price: 1499,
    isWishlisted: false,
  },
  {
    name: "Apple iPhone 13 Mini 128GB Pink (MK216)",
    image: "/products/iphone-13-mini-128gb.png",
    alt: "iPhone 14 pro gold",
    price: 799,
    isWishlisted: false,
  },
  {
    name: "Apple iPhone 14 Pro 256GB Space Black (MQ245)",
    image: "/products/iphone-14-space-black.png",
    alt: "iPhone 11  white",
    price: 875,
    isWishlisted: false,
  },
];

export function RelatedProducts() {
  return (
    <section className="flex flex-col gap-8 py-20 bg-[#FFFFFF]">
      <div className="">
        <h2 className="font-medium leading-6 text-[24px]">Related Products</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard key={`idx-${index}-${product.name}`} {...product} />
        ))}
      </div>
    </section>
  );
}
