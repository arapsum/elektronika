import { fetchProduct } from "@/api/products";
import { queryClient } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { ProductDetailBreadcrumb } from "./breadcrumbs";
import { ProductThumbnail } from "./images";
import { RelatedProducts } from "./related-products";
import type {
  CategoryAttributes,
  Product,
  ProductOption,
  ProductSpecification,
  SpecificationEntry,
} from "@/types/product.types";
import { useEffect, useState } from "react";
import { BsCpuFill } from "react-icons/bs";
import { CiDeliveryTruck, CiShop } from "react-icons/ci";
import { FaCamera, FaMicrochip } from "react-icons/fa";
import { GiBattery75 } from "react-icons/gi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { IoCameraReverse } from "react-icons/io5";
import { MdPhoneAndroid } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

const specs = [
  { icon: MdPhoneAndroid, label: "Screen size", value: '6.7"' },
  { icon: FaMicrochip, label: "CPU", value: "Apple A16 Bionic" },
  { icon: BsCpuFill, label: "Number of Cores", value: "6" },
  { icon: FaCamera, label: "Main camera", value: "48-12-12 MP" },
  { icon: IoCameraReverse, label: "Front-camera", value: "12 MP" },
  { icon: GiBattery75, label: "Battery capacity", value: "4323 mAh" },
];

const services = [
  { name: "Free Delivery", icon: CiDeliveryTruck, period: "1-2 days" },
  { name: "In Stock", icon: CiShop, period: "Today" },
  { name: "Guaranteed", icon: HiOutlineBadgeCheck, period: "1 year" },
];

function ProductDetails<T extends keyof CategoryAttributes>({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery<Product<T>>(
    {
      queryKey: ["product", id],
      queryFn: () => fetchProduct(id),
    },
    queryClient,
  );

  const [selectedOption, setSelectedOption] = useState<ProductOption<any> | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  const options = data?.options;

  useEffect(() => {
    if (!options) return;

    setSelectedOption(options[0]);
    setSelectedStorage(options[0].attributes.storage);
    setSelectedColour(options[0].attributes.colour);
  }, [options]);

  useEffect(() => {
    if (!options) return;

    const matched = options.find((opt) => {
      return opt.attributes.colour === selectedColour && opt.attributes.storage === selectedStorage;
    });

    if (matched) setSelectedOption(matched);
  }, [selectedStorage, selectedColour, options]);
  if (isLoading || selectedOption === null) return <div>Loading...</div>;

  if (isError || !data) return <div>Error: {error?.message ?? "Internal server error"}</div>;

  const colourOptions: { name: string; hex: string }[] = [];

  const colours =
    options?.map((opt) => ({
      name: opt.attributes.colour,
      hex: opt.attributes.colourhex,
    })) ?? [];

  colours?.forEach((colour) => {
    if (!colourOptions.some((c) => c.name === colour.name)) {
      colourOptions.push(colour);
    }
  });

  const storage = options?.map((opt) => opt.attributes.storage) ?? [];
  const storageOptions = [...new Set(storage)];

  // const memory = options?.map((opt) => opt.attributes.memory) ?? [];
  // const memoryOptions = [...new Set(memory)];

  const specifications = data.specifications;
  const specsKeys = Object.keys(specifications!);

  const changeOption = (type: string, value: string) => {
    if (!options) return;
    if (type === "storage") {
      const opt = options.find(
        (opt) => opt.attributes.storage === value && opt.attributes.colour === selectedColour,
      );

      if (opt) {
        setSelectedOption(opt);
        setSelectedStorage(value);
      }
    } else {
      const opt = options.find(
        (opt) => opt.attributes.storage === selectedStorage && opt.attributes.colour === value,
      );

      if (opt) {
        setSelectedOption(opt);
        setSelectedColour(value);
      }
    }
  };

  return (
    <section className="py-8 space-y-9 mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40">
      <div className="hidden lg:block">
        <ProductDetailBreadcrumb />
      </div>

      <main className="flex flex-col gap-9 lg:gap-0">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-12 xl:py-8">
          <ProductThumbnail />
          {/*Product Information*/}
          <section className="space-y-8 px-4 lg:px-0">
            {/* Content */}
            <main className="space-y-4">
              {/* Title */}
              <section className="space-y-6">
                <h1 className="leading-10">
                  <span className="font-bold text-lg">
                    {data.brandName} {data.name} -&nbsp;
                  </span>
                  <span className="text-base">
                    {selectedOption.attributes.memory} RAM -&nbsp;
                    {selectedOption.attributes.storage} Storage -&nbsp;
                    {selectedOption.attributes.colour}
                  </span>
                </h1>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-[32px] leading-12 tracking-[0.03em] text-black">
                    {selectedOption.discount > 0
                      ? `£${selectedOption.price - selectedOption.price * (selectedOption.discount / 100)}`
                      : `£${selectedOption.price}`}
                  </span>
                  {selectedOption.discount > 0 && (
                    <span className="font-normal text-[#A0A0A0] text-2xl leading-8 tracking-[0.03em] line-through">
                      £{selectedOption.price}
                    </span>
                  )}
                </div>
              </section>

              <section className="space-y-6">
                {/* Colours section */}
                <div className="flex items-center gap-6">
                  <span className="hidden font-normal text-base leading-6 ">Select colour:</span>
                  <div className="flex items-center gap-4">
                    {colourOptions.map((colour) => (
                      <button
                        type="button"
                        onClick={() => setSelectedColour(colour.name)}
                        key={colour.name}
                        style={{ backgroundColor: colour.hex }}
                        className={`size-8 rounded-full  ring-2 ring-transparent  transition-transform duration-300 ${selectedColour === colour.name ? "ring-black" : "ring-transparent"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Storage Tabs */}
                <div className="flex items-center gap-2 lg:gap-4">
                  {storageOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeOption("storage", item)}
                      className={`py-4 px-6 h-14 w-20 lg:w-30 md:w-40 border-[1.5px] rounded-sm transition-transform duration-300 flex items-center justify-center ${selectedStorage === item ? "border-black text-black" : "border-[#D5D5D5] text-[#6F6F6F]"}`}
                    >
                      <span className="font-medium text-base">{item}</span>
                    </button>
                  ))}
                </div>

                {/* Details  */}
                <main className="grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-2">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 bg-[#F4F4F4] shadow-xs px-2 py-4 rounded-sm"
                    >
                      <Icon className="size-6 text-[#4e4e4e]" />
                      <div>
                        <p className="text-sm font-light text-[#a7a7a7] leading-4">{label}</p>
                        <p className="text-sm font-normal text-[#4e4e4e] leading-4">{value}</p>
                      </div>
                    </div>
                  ))}
                </main>

                {/* text description  */}
                <p className="font-normal text-sm leading-6 tracking-[0.03em] text-[#6C6C6C] line-clamp-3">
                  {data.summary}
                </p>
              </section>
            </main>

            {/* Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 border border-black/50 rounded-sm hover:bg-black hover:text-white"
              >
                Add to Wishlist
              </Button>
              <Button variant="default" className="h-14 rounded-sm ">
                Add to Cart
              </Button>
            </section>

            {/* icons */}
            <div className="flex items-center gap-8 md:grid md:grid-cols-3">
              {services.map(({ name, icon: Icon, period }) => (
                <div
                  key={name}
                  className="rounded-sm flex flex-col md:flex-row md:items-start md:justify-start gap-4 pb-4 md:pb-0 shadow-xs md:shadow-none lg:shadow-sm w-32 md:w-full lg:w-39.5 h-fit"
                >
                  <div className="flex items-center justify-center bg-[#f6f6f6] p-4 size-14 mx-auto md:mx-0 rounded-sm">
                    <Icon className="size-8 text-emerald-500" />
                  </div>
                  <p className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
                    <span className="block font-medium text-xs leading-6 text-[#717171]">
                      {name}
                    </span>
                    <span className="block font-medium text-sm leading-6 text-black">{period}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </section>
        {/*Product Specifications*/}
        <section className="py-10 px-4 mx-auto bg-[#FAFAFA] rounded-lg">
          <main className="flex flex-col gap-8 bg-white px-6 py-12 rounded-lg">
            {/* Header */}
            <div className="w-full">
              <h1 className="font-medium leading-8 text-black text-2xl">Details</h1>
            </div>
            {/* Description */}
            <div>
              <p className="font-medium leading-6 text-sm text-[#9D9D9D] text-justify">
                {data.description}
              </p>
            </div>
            {/* Details */}
            <section>
              {specsKeys.length > 0 && (
                <RenderSpecs specifications={specifications!} option={selectedOption} />
              )}
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

        {/*Related Products*/}
        <RelatedProducts />
      </main>
    </section>
  );
}

function RenderSpecs<T extends keyof CategoryAttributes>({
  specifications,
  option,
}: {
  specifications: ProductSpecification<T>;
  option: ProductOption<T>;
}) {
  const specsEntries = Object.entries(specifications);

  console.log(specsEntries);

  return (
    <div className="flex flex-col gap-10">
      {specsEntries.map(
        ([key, value]: [string, Record<string, SpecificationEntry<T>>], index: number) => (
          <div key={`${key}-${index}`} className="flex flex-col gap-4">
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
                  <span className="leading-6 text-gray-700 text-[15px]">
                    {entry.derivedFromAttribute
                      ? (option.attributes[entry.derivedFromAttribute] as string)
                      : entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default ProductDetails;
