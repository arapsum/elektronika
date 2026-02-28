import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Logo from "./logo.tsx";

const services = [
  { name: "Bonus programme", href: "/#BonusProgramme" },
  { name: "Gift cards", href: "/#GiftCards" },
  { name: "Credit and payment", href: "/#CreditAndPayment" },
  { name: "Service contracts", href: "/#ServiceContracts" },
  { name: "Non cash account", href: "/#NonCashAccount" },
  { name: "Payment", href: "/#Payment" },
];

const assistances = [
  { name: "Find an order", href: "/#FindAnOrder" },
  { name: "Terms of delivery", href: "/#TermsOfDelivery" },
  { name: "Exchange and return of goods", href: "/#ExchangeAndReturn" },
  { name: "Guarantee", href: "/#Guarantee" },
  { name: "Frequently asked questions", href: "/#FAQs" },
  { name: "Terms of use of the site", href: "/#Termsofuseofthesite" },
];

const socials = [
  { name: "Facebook", icon: FaFacebookF, href: "#/Facebook" },
  { name: "Tiktok", icon: FaTiktok, href: "#/Tiktok" },
  { name: "Twitter", icon: FaTwitter, href: "#/Twitter" },
  { name: "Instagram", icon: FaInstagram, href: "#/Instagram" },
];

export default function Footer() {
  return (
    <footer className="py-12 w-full text-white bg-black lg:px-16 md:px-8 xl:px-40 lg:py-26">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col justify-center items-center space-y-4 md:justify-start md:items-start">
            <Logo colour="white" />
            <p className="text-sm font-light leading-relaxed text-gray-400 text-center md:text-start">
              We are a residential interior design firm located in Portland. Our boutique-studio
              offers more than
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center md:justify-start md:items-start">
            <h2 className="mb-1 text-base font-semibold text-white">Services</h2>

            <ul className="flex flex-col gap-2 justify-center items-center md:justify-start md:items-start">
              {services.map((service) => (
                <li
                  key={service.name}
                  className="text-sm font-light text-gray-400 transition-colors hover:text-white"
                >
                  <a href={service.href}>{service.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 justify-center items-center md:justify-start md:items-start">
            <h2 className="mb-1 text-base font-semibold text-white">Assistance to the buyer</h2>

            <ul className="flex flex-col gap-2 justify-center items-center md:justify-start md:items-start">
              {assistances.map((assistance) => (
                <li
                  key={assistance.href}
                  className="text-sm font-light text-gray-400 transition-colors hover:text-white"
                >
                  <a href={assistance.href}>{assistance.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center pt-4 md:justify-start">
          {socials.map(({ href, name, icon: Icon }) => (
            <a href={href} key={name} className="text-gray-400 transition-colors hover:text-white">
              {<Icon className="size-4" />}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
