import { MenuIcon, XIcon } from "lucide-react";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { IconButton, iconButtons, NavItem, navItems, SearchBar } from ".";

export default function MobileHeader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
}) {
  return (
    <>
      <header className="flex items-center justify-between px-4 py-6 bg-white w-full">
        <Logo colour="black" />

        <button type="button" onClick={() => setOpen(true)} className="transition cursor-pointer">
          <MenuIcon className="size-10 text-[#080341]" />
        </button>
      </header>

      {/* Menu Modal Overlya  */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <div
        className={`fixed top-0 right-0 h-full sm:w-120 bg-white z-50 shadow-2xl transition-transform transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <Logo />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="transition cursor-pointer"
          >
            <XIcon className="size-10 text-[#080341]" />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-6">
          <SearchBar />

          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <NavItem key={item.link} {...item} />
            ))}
          </nav>

          <Separator />

          <div className="flex items-center justify-around">
            {iconButtons.map((item) => (
              <IconButton key={item.link} {...item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
