import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import { BsSliders } from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { filterItems } from "@/data/filterOptions";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

function FilterCheckbox({
  label,
  count,
  checked,
}: {
  label: string;
  count: number;
  checked?: boolean;
}) {
  return (
    <FieldGroup>
      <Field className="flex gap-2" orientation="horizontal">
        <Checkbox checked={checked} />
        <FieldLabel className="flex leading-6">
          <span className="font-medium text-sm text-black">{label}</span>
          <span className="text-[#929292] text-xs">{count}</span>
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}

export function PriceFilter({ from, to }: { from: number; to: number }) {
  return (
    <Accordion type="single" className="p-0 m-0">
      <AccordionItem value="price" className="space-y-6">
        <AccordionTrigger>Price</AccordionTrigger>
        <AccordionContent className="flex flex-col space-y-6">
          {/* From-To */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-normal text-sm leading-6 tracking-[-0.005em] text-[#A7A7A7]">
                From
              </p>

              <p className="font-normal text-sm leading-6 tracking-[-0.005em] text-[#A7A7A7]">To</p>
            </div>
            <div className="flex items-center justify-between">
              <input
                value={from}
                className="bg-white py-2 pl-2 pr-16 rounded-sm border border-[#9F9F9F] w-27.25"
              />

              <input
                value={to}
                className="bg-white py-2 pl-2 pr-16 rounded-sm border border-[#9F9F9F] w-27.25"
              />
            </div>
          </div>
          {/* Slider */}
          <main>
            <Slider max={to} min={from} step={1} />
          </main>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function Filter({
  options,
}: {
  options: { label: string; count: number; checked?: boolean }[];
}) {
  return (
    <ScrollArea className="flex flex-col space-y-6 w-full max-h-84 lg:w-[256px] lg:max-w-[256px]">
      <div className="py-2 mx-auto px-2">
        <input
          type="search"
          className="py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#F5F5F5] w-full lg:w-60"
          placeholder="Search..."
        />
      </div>

      <div className="flex flex-col space-y-4 px-2">
        {options.map((option) => (
          <FilterCheckbox key={option.label} {...option} />
        ))}
      </div>
    </ScrollArea>
  );
}

export function MobileFilter({ onClose }: { onClose: () => void }) {
  return (
    <section className="px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 w-full">
        <button type="button" className="flex items-center justify-center" onClick={onClose}>
          <ChevronLeftIcon className="size-8" />
        </button>
        <h1 className="font-medium text-2xl leading-8 tracking-[0.01em]">Filters</h1>
      </div>
      {/* main */}
      <main className="flex flex-col gap-6 px-4">
        <PriceFilter from={655} to={1659} />

        <Accordion type="multiple" defaultValue={["brand"]} className="space-y-6">
          {filterItems.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>
                <Filter options={item.options} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      {/* Nutton */}
      <div>
        <Button
          variant="default"
          className="w-full h-14 rounded-md"
          onClick={() => {
            // do somige filtering then close
            setTimeout(onClose, 1500);
          }}
        >
          <span>Apply</span>
        </Button>
      </div>
    </section>
  );
}

export function MobileFilterButtons({ onFilterClick }: { onFilterClick: () => void }) {
  return (
    <section className="lg:hidden gap-4 grid grid-cols-2 px-4 pt-10">
      <Button
        variant={"outline"}
        onClick={onFilterClick}
        className="flex items-center justify-between px-4 py-4 h-14 w-full"
      >
        <span className="font-normal text-[15px] leading-4 tracking-[-0.005em]">Filters</span>
        <BsSliders className="size-6" />
      </Button>
      {/* Dropdown */}
      <Button
        variant={"outline"}
        className="flex items-center justify-between px-4 py-4 h-14 w-full"
      >
        <span className="font-normal text-[15px] leading-4 tracking-[-0.005em]">By Rating</span>
        <ChevronDownIcon className="size-r" />
      </Button>
    </section>
  );
}
