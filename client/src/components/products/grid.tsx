import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard, { ProductCardSkeleton } from "./card";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/products";
import { queryClient } from "@/store";
import type { Product } from "@/types/products";

export default function ProductGrid() {
  const { data, isLoading, error, isError } = useQuery(
    {
      queryKey: ["products"],
      queryFn: fetchProducts,
    },
    queryClient,
  );

  const products = data?.data;

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <section className="space-y-10 ">
      <main className="space-y-6">
        <h3 className="font-medium leading-4 tracking-[0.03em] flex items-center">
          <span className="text-base text-[#6C6C6C]">Products Result:&nbsp;</span>
          <span className="text-xl text-black">85</span>
        </h3>
        {/* Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.map((item: Product<any>) => (
                <ProductCard
                  key={item.name}
                  id={item.id}
                  image={item.images[0].link}
                  alt={item.images[0].alt}
                  name={`${item.brandName} ${item.name}`}
                  price={Number(item.options[0].price)}
                  isWishlisted={false}
                />
              ))}
        </main>
      </main>

      <section>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </section>
  );
}
