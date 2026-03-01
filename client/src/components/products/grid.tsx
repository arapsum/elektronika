import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { products } from "@/data/products";
import ProductCard from "./card";

export default function ProductGrid() {
  return (
    <section className="space-y-10 ">
      <main className="space-y-6">
        <h3 className="font-medium leading-4 tracking-[0.03em] flex items-center">
          <span className="text-base text-[#6C6C6C]">Products Result:&nbsp;</span>
          <span className="text-xl text-black">85</span>
        </h3>
        {/* Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((item) => (
            <ProductCard key={item.name} {...item} />
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
