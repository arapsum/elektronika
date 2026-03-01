import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const screenDetails = [
  { name: "Screen diagonal", value: '6.7"' },
  { name: "Screen resolution", value: "2796x1290" },
  { name: "Refresh rate", value: "120 Hz" },
  { name: "Pixel density", value: "120 Hz" },
  { name: "Screen type", value: "OLED" },
];

const cpuDetails = [
  { name: "Processing Unit", value: "A16 Bionic" },
  { name: "Cores", value: "10" },
];

export function ProductDetails() {
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
            Just as a book is judged by its cover, the first thing you notice when you pick up a
            modern smartphone is the display. Nothing surprising, because advanced technologies
            allow you to practically level the display frames and cutouts for the front camera and
            speaker, leaving no room for bold design solutions. And how good that in such realities
            Apple everything is fine with displays. Both critics and mass consumers always praise
            the quality of the picture provided by the products of the Californian brand. And last
            year's 6.7-inch Retina panels, which had ProMotion, caused real admiration for many.
          </p>
        </div>
        {/* Details */}
        <div className="flex flex-col gap-10">
          {/* Info 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="font-medium leading-6 text-black text-[20px]">Screen</h5>
            </div>
            <div className="flex flex-col gap-6">
              {screenDetails.map((details, index) => (
                <div
                  key={`idx-${index}-${details.name}`}
                  className="flex justify-between items-center border-b border-dotted border-black/40"
                >
                  <span className="font-normal leading-6 text-gray-700 text-[16px]">
                    {details.name}
                  </span>
                  <span className="leading-6 text-gray-700 text-[15px]">{details.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Info 2 */}
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="font-medium leading-6 text-black text-[20px]">CPU</h5>
            </div>
            <div className="flex flex-col gap-6">
              {cpuDetails.map((details, index) => (
                <div
                  key={`${details.name}-idx-${index}`}
                  className="flex justify-between items-center border-b border-dotted border-black/40"
                >
                  <span className="font-normal leading-6 text-gray-700 text-[16px]">
                    {details.name}
                  </span>
                  <span className="leading-6 text-gray-700 text-[15px]">{details.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
