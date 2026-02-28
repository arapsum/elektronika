import {
  CameraIcon,
  GamepadIcon,
  HeadphonesIcon,
  type LucideIcon,
  MonitorIcon,
  SmartphoneIcon,
  WatchIcon,
} from "lucide-react";

const navItems = [
  { label: "Phones", link: "#phones", icon: SmartphoneIcon },
  { label: "Computers", link: "#computers", icon: MonitorIcon },
  { label: "Smart Watches", link: "#smart-watches", icon: WatchIcon },
  { label: "Cameras", link: "#cameras", icon: CameraIcon },
  { label: "Headphones", link: "#headphones", icon: HeadphonesIcon },
  { label: "Gaming", link: "#gaming", icon: GamepadIcon },
];

const NavItem = ({
  label,
  icon: Icon,
  link,
}: {
  label: string;
  icon: LucideIcon;
  link: string;
}) => (
  <a
    href={link}
    className="flex items-center justify-center md:justify-items-start transition-colors space-x-2 text-white/50 hover:text-white/75"
  >
    <Icon className="lg:size-6 size-5 shrink-0" />
    <p className="text-xs md:text-sm lg:text-base leading-4 lg:leading-8 whitespace-nowrap">
      {label}
    </p>
  </a>
);

export function Subnavbar() {
  return (
    <section className="xl:px-40 lg:px-16 md:px-4 bg-[#2E2E2E]">
      <nav className="flex items-center justify-between md:justify-between gap-2 md:gap-4 lg:gap-6 ">
        {navItems.map((item) => (
          <NavItem key={item.link} {...item} />
        ))}
      </nav>
    </section>
  );
}
