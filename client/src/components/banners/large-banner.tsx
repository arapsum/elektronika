import React from "react";
import { Button } from "@/components/ui/button";

const OutlineButton = () => (
  <a href="/products">
    <Button
      variant="outline"
      className="h-14 px-14 py-4 bg-inherit text-white border-[1.5px] border-white/40 rounded-sm transition-transform duration-300 gap-2"
    >
      <span className="font-medium leading-6">Shop Now</span>
    </Button>
  </a>
);

export function LargeBannerMobile() {
  return (
    <section className="md:hidden pt-22 px-4 pb-0 overflow-hidden space-y-12 bg-linear-to-br from-[#211C24] to-[#211C24]">
      {/* Top section: Banner text & Call to Action btn */}
      <div className="space-y-8 flex items-center justify-center flex-col">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <p className="font-semibold text-[25px] leading-8 text-white/50">Pro.Beyond</p>
          <h1 className="text-white text-7xl leading-18 tracking-[-0.01em] text-center">
            <span className="font-thin line-clamp-1">IPhone 14&nbsp;</span>
            <span className="font-bold">Pro</span>
          </h1>
          <p className="font-medium text-[19px] leading-6 text-[#909090] text-center">
            Created to change everything for the better. For everyone
          </p>
        </div>

        <OutlineButton />
      </div>
      {/* Image */}
      <div className="flex items-center justify-center">
        <img
          src="/banners/large-banner-mobile.png"
          alt="Apple iPhone 14 banner"
          width="321px"
          height="289px"
          className="object-center object-contain"
        />
      </div>
    </section>
  );
}

export function LargeBannerDesktop() {
  return (
    <section className="hidden bg-linear-to-br from-[#211C24] to-[#211C24] md:flex items-center justify-between xl:px-40 lg:px-16 md:px-8 overflow-hidden h-158">
      {/* Left section: Banner text & CTA Button */}
      <div className="flex flex-col gap-6 justify-start items-start">
        {/* Titles */}
        <div className="space-y-6">
          <p className="font-semibold text-[25px] leading-8 text-white/40">Pro.Beyond</p>
          <h1 className="text-white text-7xl xl:text-8xl leading-18 tracking-[-0.01em] text-start">
            <span className="font-thin">IPhone 14&nbsp;</span>
            <span className="font-bold">Pro</span>
          </h1>
        </div>

        <p className="font-medium text-[18px] leading-6 text-[#909090] text-start">
          Created to change everything for the better. For everyone
        </p>

        <OutlineButton />
      </div>
      {/* Banner image */}
      <div>
        <img
          alt="Apple iPhone 14 Banner deep purple"
          src="/banners/large-banner-desktop.png"
          width="406px"
          height="632px"
        />
      </div>
    </section>
  );
}

export function LargeBanner() {
  return (
    <React.Fragment>
      <LargeBannerMobile />
      <LargeBannerDesktop />
    </React.Fragment>
  );
}
