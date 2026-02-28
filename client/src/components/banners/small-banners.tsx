import React from "react";
import { OutlineButton } from ".";
import { cn } from "@/lib/utils";

interface MobileProps {
  titleProps: { regular: string; bold: string; className?: string };
  subtitle: string;
  image: string;
  alt: string;
  subtitleClass?: string;
  className?: string;
  cta?: boolean;
  imageWidth: string;
  imageHeight: string;
}

const mobileBanners: MobileProps[] = [
  {
    image: "/banners/apple-airpods-banner-mobile.png",
    alt: "Apple Airpods white",
    titleProps: { regular: "Apple Airpods", bold: "Max" },
    subtitle: "Computational audio. Listen, it's powerful",
    imageWidth: "192px",
    imageHeight: "200px",
    className: "bg-[#EDEDED]",
  },
  {
    image: "/banners/apple-vision-banner-mobile.png",
    alt: "Apple Vision Pro black",
    titleProps: {
      regular: "Apple Vision",
      bold: "Pro",
      className: "text-[#FFFFFF]",
    },
    subtitle: "An immersive way to experience entertainment",
    imageWidth: "325.87px",
    imageHeight: "192.44px",
    className: "bg-[#353535]",
  },
  {
    image: "/banners/sony-playstation-5-banner-mobile.png",
    alt: "Playstation 5 black and white",
    titleProps: {
      regular: "Playstation",
      bold: "5",
    },
    subtitle:
      "Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.",
    imageWidth: "200px",
    imageHeight: "200px",
    className: "bg-[#FFFFFF]",
  },
  {
    image: "/banners/apple-macbook-banner-mobile.png",
    alt: "Apple Macbook air",
    titleProps: {
      regular: "Macbook",
      bold: "Air",
    },
    subtitle:
      "The new 15‑inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.",
    imageWidth: "330.48px",
    imageHeight: "200px",
    className: "bg-[#EDEDED]",
    cta: true,
  },
];

function BannerTitle({
  regular,
  bold,
  className,
}: {
  regular: string;
  bold: string;
  className?: string;
}) {
  return (
    <h3 className={cn("leading-10 text-[34px] text-black", className)}>
      <span className="font-thin">{regular.trim()}&nbsp;</span>
      <span className="font-semibold">{bold}</span>
    </h3>
  );
}

function BannerSubtitle({ subtitle, className }: { subtitle: string; className?: string }) {
  return (
    <p
      className={cn(
        "font-medium text-base leading-6 text-[#909090] line-clamp-2 text-center",
        className,
      )}
    >
      {subtitle}
    </p>
  );
}

export function SmallBannerMobile({
  titleProps,
  subtitle,
  image,
  alt,
  imageHeight,
  imageWidth,
  className,
  subtitleClass,
  cta,
}: MobileProps) {
  return (
    <section
      className={cn(
        "px-4 py-10 overflow-hidden space-y-6 flex flex-col items-center justify-center",
        className,
      )}
    >
      <div>
        <img
          src={image}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className="object-center object-contain"
        />
      </div>

      {cta !== undefined && cta !== false ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <BannerTitle {...titleProps} />
            <BannerSubtitle subtitle={subtitle} className={subtitleClass} />
          </div>

          <OutlineButton className="bg-inherit border-black/40 text-black hover:bg-black hover:text-white" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <BannerTitle {...titleProps} />
          <p
            className={cn(
              "font-medium text-base leading-6 text-[#909090] line-clamp-2 text-center",
              subtitleClass,
            )}
          >
            {subtitle}
          </p>
        </div>
      )}
    </section>
  );
}

export function RectangleBanner() {
  return (
    <section className="overflow-hidden h-82  relative bg-white flex">
      <div className="flex items-center">
        <div className="flex h-full shrink-0 w-90">
          <img
            src="/banners/playstation-5-banner.png"
            alt="PlayStation 5 Black & White"
            width={"360px"}
            height={"343px"}
            className="object-cover object-center"
          />
        </div>

        <div className="flex relative z-10 flex-col gap-4 justify-center p-8 -ml-16 bg-white">
          <h1 className="m-0 font-medium text-[49px] leading-10 text-black">PlayStation 5</h1>

          <p className="font-medium m-0 leading-6 text-sm text-[#909090]">
            Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your
            PlayStation experience.
          </p>
        </div>
      </div>
    </section>
  );
}

// Square banner 1
function AirpodBanner() {
  return (
    <section className="flex overflow-hidden relative w-full h-full bg-[#EDEDED]">
      <div className="flex items-center">
        <div className="flex h-68 shrink-0 w-26">
          <img
            src="/banners/apple-airpods-banner.png"
            alt="Apple Airpods"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex relative z-10 flex-col gap-2 lg:justify-center lg:items-center p-4 ml-4 bg-[#EDEDED]">
          <h1 className="m-0 leading-10 text-black text-2xl lg:text-[29px]">
            <span className="font-light lg:line-clamp-2">Apple Airpods&nbsp;</span>
            <span className="font-semibold">Max</span>
          </h1>
          <p className="m-0 text-sm font-medium leading-6 text-[#909090]">
            Computational audio. Listen it's powerful.
          </p>
        </div>
      </div>
    </section>
  );
}

// Square banner 2
function VisionBanner() {
  return (
    <section className="flex overflow-hidden relative w-full h-full bg-[#353535]">
      <div className="flex items-center">
        <div className="flex h-47.5 shrink-0 w-34">
          <img
            src="/banners/apple-vision-pro-banner.png"
            alt="Apple Airpods"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex relative z-10 flex-col gap-2 lg:justify-center lg:items-center p-4 bg-[#353535]">
          <h1 className="m-0 leading-10 text-white text-2xl lg:text-[29px]">
            <span className="font-light">Apple Vision&nbsp;</span>
            <span className="font-semibold">Pro</span>
          </h1>
          <p className="m-0 text-sm font-medium leading-6 text-[#909090]">
            An immersive way to experience entertainment.
          </p>
        </div>
      </div>
    </section>
  );
}

function BigBanner() {
  return (
    <section className="flex overflow-hidden relative size-full bg-[#EDEDED]">
      <div className="flex pt-11 pb-11 w-full">
        {/* Title, description & CTA button */}
        <div className="flex flex-col gap-4 justify-center pl-14 max-w-90">
          {/* Title & Description */}
          <div className="flex flex-col gap-4 justify-center p-0 m-0">
            <h1 className="text-black text-[64px] leading-14">
              <span className="font-thin">Macbook&nbsp;</span>
              <div className="font-semibold">Air</div>
            </h1>

            <p className="m-0 font-medium leading-6 text-[14px] text-[#909090]">
              The new 15‑inch MacBook Air makes room for more of what you love with a spacious
              Liquid Retina display.
            </p>

            <a href="/#products">
              <OutlineButton className="bg-inherit border-black/40 text-black hover:bg-black hover:text-white" />
            </a>
          </div>
        </div>
        {/* Image */}
        <div className="flex ml-auto h-full shrink-0">
          <img
            src="/banners/macbook-air-banner.png"
            alt="Macbook air"
            className="object-cover object-right h-full w-73"
          />
        </div>
      </div>
    </section>
  );
}

function DesktopBanner() {
  return (
    <section className="hidden md:grid lg:h-150 w-full grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Left side banners */}
      <div className="h-full lg:w-180">
        <RectangleBanner />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-68">
          <AirpodBanner />
          <VisionBanner />
        </div>
      </div>
      {/* Right side */}
      <BigBanner />
    </section>
  );
}

export function SmallBanners() {
  return (
    <React.Fragment>
      <div className="md:hidden">
        {mobileBanners.map((banner) => (
          <SmallBannerMobile key={`idx-banner-${banner.subtitle}`} {...banner} />
        ))}
      </div>
      <DesktopBanner />
    </React.Fragment>
  );
}
