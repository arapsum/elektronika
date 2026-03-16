import { useState } from "react";
import { BsCpuFill } from "react-icons/bs";
import { CiDeliveryTruck, CiShop } from "react-icons/ci";
import { FaCamera, FaMicrochip } from "react-icons/fa";
import { GiBattery75 } from "react-icons/gi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { IoCameraReverse } from "react-icons/io5";
import { MdPhoneAndroid } from "react-icons/md";
import { Button } from "@/components/ui/button";
import type { CategoryAttributes, Product } from "@/types/products";

const colours = [
  { name: "black", class: "bg-gray-900", ring: "ring-yellow-500" },
  { name: "purple", class: "bg-purple-600", ring: "ring-black" },
  { name: "red", class: "bg-red-600", ring: "ring-black" },
  { name: "yellow", class: "bg-yellow-500", ring: "ring-black" },
  { name: "silver", class: "bg-gray-300", ring: "ring-black" },
];

const specs = [
  { icon: MdPhoneAndroid, label: "Screen size", value: '6.7"' },
  { icon: FaMicrochip, label: "CPU", value: "Apple A16 Bionic" },
  { icon: BsCpuFill, label: "Number of Cores", value: "6" },
  { icon: FaCamera, label: "Main camera", value: "48-12-12 MP" },
  { icon: IoCameraReverse, label: "Front-camera", value: "12 MP" },
  { icon: GiBattery75, label: "Battery capacity", value: "4323 mAh" },
];

const storageOptions = ["128GB", "256GB", "512GB", "1TB"];

const services = [
  { name: "Free Delivery", icon: CiDeliveryTruck, period: "1-2 days" },
  { name: "In Stock", icon: CiShop, period: "Today" },
  { name: "Guaranteed", icon: HiOutlineBadgeCheck, period: "1 year" },
];

export function ProductInfo<T extends keyof CategoryAttributes>({
  product,
}: {
  product: Product<T>;
}) {
  const options = product.options;

  const [selectedColour, setSelectedColour] = useState("purple");
  const [selectedStorage, setSelectedStorage] = useState("1TB");

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const colourOptions = options.map((option) => {
    return { name: option.attributes.colour, hex: option.attributes.colourHex };
  });
  const storageOptions = options.map((option) => option.attributes.storage);

  return (
    <section className="space-y-8 px-4 lg:px-0">
      {/* Content */}
      <main className="space-y-4">
        {/* Title */}
        <section className="space-y-6">
          <h1 className="font-bold text-[40px] leading-10">
            {product.brandName} {product.name} -&nbsp;
            {selectedOption.attributes.memory} RAM
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-[32px] leading-12 tracking-[0.03em] text-black">
              £1299
            </span>
            <span className="font-normal text-[#A0A0A0] text-2xl leading-8 tracking-[0.03em] line-through">
              £{selectedOption.price}
            </span>
          </div>
        </section>

        {/*  */}
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
                onClick={() => setSelectedStorage(item.toUpperCase())}
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
          <p className="font-normal text-sm leading-6 tracking-[0.03em] text-[#6C6C6C]">
            Enhanced capabilities thanks to an enlarged display of 6.7 inchesand work without
            rechargingthroughout the day. Incredible photosas in weak, yesand in bright lightusing
            the new systemwith two cameras&nbsp;
            <span className="text-[#2c2c2c] underline">more...</span>
          </p>
        </section>
      </main>

      {/* Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-14 border border-black/50 rounded-sm">
          Add to Wishlist
        </Button>
        <Button variant="default" className="h-14 rounded-sm">
          Add to Cart
        </Button>
      </section>

      {/* icons */}
      <div className="flex items-center gap-8 md:grid md:grid-cols-3">
        {services.map(({ name, icon: Icon, period }) => (
          <div
            key={name}
            className="rounded-sm flex flex-col md:flex-row md:items-start md:justify-start gap-4 pb-4 md:pb-0 shadow-xs md:shadow-none lg:shadow-sm w-32 md:w-full lg:w-[158px] h-fit"
          >
            <div className="flex items-center justify-center bg-[#f6f6f6] p-4 size-14 mx-auto md:mx-0 rounded-sm">
              <Icon className="size-8 text-emerald-500" />
            </div>
            <p className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
              <span className="block font-medium text-xs leading-6 text-[#717171]">{name}</span>
              <span className="block font-medium text-sm leading-6 text-black">{period}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
