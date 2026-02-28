import { HeartIcon, type LucideIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import DesktopHeader from "./desktop";
import MobileHeader from "./mobile";

export const navItems = [
  { name: "Home", link: "/", isActive: true },
  { name: "About", link: "/#about", isActive: false },
  { name: "Contact Us", link: "/#contact-us", isActive: false },
  { name: "Blog", link: "/#blog", isActive: false },
];

export const iconButtons = [
  { icon: HeartIcon, link: "#/wishlist" },
  { icon: ShoppingCartIcon, link: "#/cart" },
  { icon: UserIcon, link: "#/account" },
];

export const SearchBar = () => (
  <div className="relative group w-full ">
    <SearchIcon className="size-6 absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 group-hover:text-gray-600 pointer-events-none" />
    <input
      type="search"
      className="py-4 pr-4 pl-12 placeholder:text-[#656565] placeholder:text-sm placeholder:leading-[4.5] rounded-sm bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      placeholder="Search..."
    />
  </div>
);

export const NavItem = ({
  name,
  link,
  isActive,
}: {
  name: string;
  link: string;
  isActive: boolean;
}) => {
  return (
    <a
      href={link}
      className={`text-sm lg:text-base font-medium ${isActive ? "text-black hover:text-black/75" : "text-black/30 hover:text-black/50"}`}
    >
      {name}
    </a>
  );
};

export const IconButton = ({ icon: Icon, link }: { icon: LucideIcon; link: string }) => (
  <a href={link}>
    <button type="button" className="transition cursor-pointer hover:text-black/50">
      <Icon className="text-black size-6" />
    </button>
  </a>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = "/";
  return (
    <>
      <div className="md:hidden">
        <MobileHeader pathname={pathname} setOpen={setOpen} open={open} />
      </div>
      <DesktopHeader />
    </>
  );
}
