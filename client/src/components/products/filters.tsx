import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { filterItems } from "@/data/filterOptions";
import { Filter } from "./mobile-filter.tsx";

export default function ProductFilters() {
  return (
    <Accordion type="multiple" defaultValue={["brand"]} className="flex flex-col gap-6 w-full">
      {filterItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>
            <Filter options={item.options} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
