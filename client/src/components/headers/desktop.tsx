import Logo from "@/components/logo";
import { IconButton, iconButtons, NavItem, navItems, SearchBar } from ".";
import { Subnavbar } from "./subnav";

function DesktopHeaderTop() {
  return (
    <header className=" w-full md:px-4 py-4 lg:px-16 xl:px-40 bg-white">
      <div className="flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8 justify-between">
        {/* Logo Section */}
        <div className="h-8 w-20 md:w-24 shrink-0">
          <Logo colour="black" />
        </div>
        {/* Search field */}
        <div className="md:w-60 lg:w-108">
          <SearchBar />
        </div>
        {/* Navbar */}
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {navItems.map((item) => (
            <NavItem key={item.link} {...item} />
          ))}
        </nav>
        {/* Icon Buttons */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 shrink-0">
          {iconButtons.map((item) => (
            <IconButton key={item.link} {...item} />
          ))}
        </div>
      </div>
    </header>
  );
}

export default function DesktopHeader() {
  return (
    <section className="hidden md:block xl:w-360 xl:max-w-360 mx-auto w-full">
      <DesktopHeaderTop />
      <Subnavbar />
    </section>
  );
}
