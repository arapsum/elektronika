import { useState } from "react";
import { OutlineButton } from ".";

interface BigBannerProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  bgColour: string;
  titleColour?: string;
  imageWidth: string;
  textColour?: string;
  buttonVariant?: "light" | "dark";
}

function BigBanner({
  title,
  description,
  imageSrc,
  imageAlt,
  bgColour,
  imageWidth,
  titleColour = "text-black",
  textColour = "text-[#909090]",
  buttonVariant,
}: BigBannerProps) {
  const isDarkBackground =
    buttonVariant === "dark" || titleColour.includes("white") || titleColour.includes("#FFFFFF");

  const buttonClasses = isDarkBackground
    ? "border-white/60 hover:bg-white/80"
    : "border-black/60 hover:bg-black/80";

  const buttonTextColour = isDarkBackground
    ? "text-white hover:text-black"
    : "text-black hover:text-white";

  return (
    <div className={`px-8 pb-14 h-full w-full  ${bgColour}`}>
      <div className="flex flex-col space-y-6 h-full md:justify-between">
        <div className="flex flex-col gap-6">
          {/* Image Section */}
          <div className="flex justify-center shrink-0 items-center w-full h-60">
            <img
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              className="object-contain object-center w-full h-full"
            />
          </div>

          <div className="flex flex-col space-y-4 max-h-48">
            <h1
              className={`font-normal text-center md:text-start text-[28px] leading-12 ${titleColour}`}
            >
              {title}
            </h1>

            <p
              className={`font-medium text-center md:text-start text-[14px] leading-6 ${textColour} line-clamp-3`}
            >
              {description}
            </p>
          </div>
        </div>

        <a href="/#products" className="flex justify-center items-center">
          <OutlineButton
            className={`md:w-full w-fit transition-colors ${buttonClasses} ${buttonTextColour}`}
          />
        </a>
      </div>
    </div>
  );
}

const banners: BigBannerProps[] = [
  {
    title: "iPad Pro",
    description:
      "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    imageSrc: "/banners/ipad-pro.png",
    imageAlt: "Ipad pro",
    bgColour: "bg-[#FFFFFF]",
    textColour: "text-[#909090]",
    imageWidth: "366px",
  },
  {
    title: "Samsung Galaxy",
    description:
      "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    imageSrc: "/banners/samsung-galaxy-banner.png",
    imageAlt: "Ipad pro 5",
    bgColour: "bg-[#F9F9F9]",
    textColour: "text-[#909090]",
    imageWidth: "360px",
  },
  {
    title: "iPad Max",
    description:
      "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    imageSrc: "/banners/ipad-pro.png",
    imageAlt: "Ipad pro",
    bgColour: "bg-[#EAEAEA]",
    textColour: "text-[#909090]",
    imageWidth: "366px",
  },
  {
    title: "Macbook Air",
    description:
      "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    imageSrc: "/banners/macbook-banner.png",
    imageAlt: "Ipad pro",
    bgColour: "bg-[#2C2C2C]",
    textColour: "text-[#909090]",
    titleColour: "text-[#FFFFFF]",
    imageWidth: "376px",
  },
];

export function BigBanners() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="h-auto bg-white w-svw xl:w-360">
      {/* Desktop: Four banners grid */}
      {/* Mobile: Carousel with one banner */}
      {/* TODO: MAKE IT RESPONSIVE */}
      <div className="relative">
        {/* Mobile carousel */}
        <div className="overflow-hidden space-y-12 md:hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.title} className="shrink-0 w-full">
                <BigBanner {...banner} />
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex gap-2 justify-center pb-6">
            {banners.map((banner, index) => (
              <button
                type="button"
                key={banner.title}
                onClick={() => setCurrentSlide(index)}
                className={`size-2.5 rounded-full transition-colors ${
                  index === currentSlide ? "bg-gray-800" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden w-full h-full shrink-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-0">
          {banners.map((banner) => (
            <BigBanner key={banner.title} {...banner} />
          ))}
        </div>
      </div>
    </section>
  );
}
