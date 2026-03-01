import { useState } from "react";

const productImages: {
  image: string;
  alt: string;
  selected?: boolean;
}[] = [
  {
    image: "/products/details/iphone-14-pro-front-back-view-mobile.png",
    alt: "Front & Back view of iphone 14",
    selected: true,
  },
  {
    image: "/products/details/iphone-14-pro-front-view-mobile.png",
    alt: "Front view of iphone 14",
    selected: false,
  },
  {
    image: "/products/details/iphone-14-pro-back-view-mobile.png",
    alt: "Back view of iphone 14",
    selected: false,
  },
  {
    image: "/products/details/iphone-14-pro-side-view-mobile.png",
    alt: "Side view of iphone 14",
    selected: false,
  },
];

export function ProductThumbnail() {
  const [selectedImage, setSelectedImage] = useState({
    alt: "Front and back view of iPhone 14",
    image: "/products/details/selected-image-mobile.png",
  });

  return (
    <section className="flex flex-col lg:flex-row-reverse gap-7.5 lg:gap-12 lg:aspect-536/516 px-4 lg:p-0">
      {/* Selected image */}
      <div className="flex items-center justify-center lg:flex-1">
        <img
          src={selectedImage.image}
          alt={selectedImage.alt}
          className="object-center object-contain w-66 h-82.5 lg:w-full lg:h-full"
        />
      </div>

      <div className="lg:my-auto lg:h-111 lg:w-[74.88px]">
        <div className="flex items-center justify-center lg:flex-col lg:items-start gap-3.5 lg:gap-6">
          {productImages.map((item) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setSelectedImage(item)}
              className="max-w-[74.26px] lg:max-w-[74.88px] h-[74.88px] flex items-center justify-center max-h-[66.34px] lg:max-h-[93px] lg:h-[93px] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.alt}
                width={"74.26px"}
                height={"66.34px"}
                className="object-contain object-center w-auto h-full"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
