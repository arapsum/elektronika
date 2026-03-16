import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { ProductDetailBreadcrumb } from "./breadcrumbs";
import { ProductThumbnail } from "./images";
import { ProductInfo } from "./info";
import { RelatedProducts } from "./related-products";
import { fetchProduct } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/store";
import type { Product, ProductSpecification, SpecificationEntry } from "@/types/product.types";

export default function ProductDetail({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery(
    {
      queryKey: ["product", id],
      queryFn: () => fetchProduct(id),
    },
    queryClient,
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <section className="py-8 space-y-9 mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40">
      <div className="hidden lg:block">
        <ProductDetailBreadcrumb />
      </div>
      <main className="flex flex-col gap-9 lg:gap-0">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-12 xl:py-8">
          <ProductThumbnail />
          <ProductInfo product={data!} />
        </section>
        <ProductDetails product={data!} />

        {/* TODO: Create reviews component */}

        <RelatedProducts />
      </main>
    </section>
  );
}

export function ProductDetails({ product }: { product: Product<any> }) {
  const specifications = product.specifications;

  const specsKeys = Object.keys(specifications!);

  return (
    <section className="py-10 px-4 mx-auto bg-[#FAFAFA] rounded-lg">
      <main className="flex flex-col gap-8 bg-white px-6 py-12 rounded-lg">
        {/* Header */}
        <div className="w-full">
          <h1 className="font-medium leading-8 text-black text-2xl">Details</h1>
        </div>
        {/* Description */}
        <div>
          <p className="font-medium leading-6 text-sm text-[#9D9D9D] text-justify">
            {product.description}
          </p>
        </div>
        {/* Details */}
        <section>
          {specsKeys.length > 0 && <RenderSpecs specifications={specifications!} />}
        </section>

        <div className="flex justify-center items-center">
          <Button
            type="button"
            variant="outline"
            className="flex gap-2 items-center py-3 px-14 w-54 h-12"
          >
            <span className="font-medium leading-6 text-[14px]">View more</span>
            <ChevronDownIcon className="size-6" />
          </Button>
        </div>
      </main>
    </section>
  );
}

function RenderSpecs({ specifications }: { specifications: ProductSpecification }) {
  const specsEntries = Object.entries(specifications);

  return (
    <div className="flex flex-col gap-10">
      {specsEntries.map(([key, value]: [string, Record<string, SpecificationEntry>]) => (
        <div className="flex flex-col gap-4">
          <div>
            <h5 className="font-medium leading-6 text-black text-[20px] capitalize">{key}</h5>
          </div>
          <div className="flex flex-col gap-6">
            {Object.entries(value).map(([spec, entry], index) => (
              <div
                key={`idx-${index}-${spec}`}
                className="flex justify-between items-center border-b border-dotted border-black/40"
              >
                <span className="font-normal leading-6 text-gray-700 text-[16px]">{spec}</span>
                <span className="leading-6 text-gray-700 text-[15px]">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
