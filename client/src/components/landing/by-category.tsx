import { ChevronLeftIcon, ChevronRightIcon, GamepadIcon } from "lucide-react";
import { BsSmartwatch } from "react-icons/bs";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { GiPhotoCamera } from "react-icons/gi";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { RiSmartphoneLine } from "react-icons/ri";

const categories = [
  { label: "Phones", icon: RiSmartphoneLine },
  { label: "Smart Watches", icon: BsSmartwatch },
  { label: "Cameras", icon: GiPhotoCamera },
  { label: "Headphones", icon: FaHeadphonesSimple },
  { label: "Computers", icon: HiOutlineComputerDesktop },
  { label: "Gaming", icon: GamepadIcon },
];

export function BrowseByCategory() {
  return (
    <section className="px-4 py-16 bg-[#FAFAFA] space-y-12 lg:space-y-8 xl:px-40 xl:py-20 lg:px-16 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="capitalize font-medium text-2xl leading-8 tracking-[0.01em]">
          Browse by category
        </h1>

        <div className="flex items-center space-x-4">
          <button type="button">
            <ChevronLeftIcon className="size-8" />
          </button>

          <button type="button">
            <ChevronRightIcon className="size-8" />
          </button>
        </div>
      </div>
      {/* category grid */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 xl:gap-8 space-y-4">
        {categories.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#EDEDED] rounded-[15px] flex flex-col gap-2 h-32 items-center justify-center py-6 xl:w-40 "
          >
            <Icon className="size-12 text-black" />
            <p className="font-medium text-black text-base leading-6">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
