import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionTitle, Eyebrow } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";
import { local as copy } from "@/lib/copy";
import type { Settings } from "@/lib/cms";

const MapPin = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Waze = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m3 11 18-8-8 18-2-8-8-2Z" />
  </svg>
);

const Uber = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M9 17h6" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const iconClasses =
  "[&_svg]:size-[15px] [&_svg]:shrink-0 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] after:hidden";

export type LocalSectionProps = {
  settings: Settings;
};

export function LocalSection({ settings }: LocalSectionProps) {
  const query = encodeURIComponent(`${settings.venueName}, ${settings.venueAddress}`);

  const apps = [
    { label: "Google Maps", icon: MapPin, href: settings.venueMapUrl },
    { label: "Waze", icon: Waze, href: `https://www.waze.com/ul?q=${query}&navigate=yes` },
    {
      label: "Uber",
      icon: Uber,
      href: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=${query}`,
    },
  ];

  return (
    <Section id="local">
      <Container>
        <Reveal>
          <Eyebrow className="mb-[22px]">{copy.eyebrow}</Eyebrow>
        </Reveal>

        <div className="grid grid-cols-2 items-center gap-[clamp(32px,4.5vw,56px)] max-[900px]:grid-cols-1">
          <Reveal>
            <SectionTitle size="md">
              {settings.venueName},<br />
              {settings.venueAddress.split(",").slice(-1)[0]?.trim()}.
            </SectionTitle>

            <address className="text-mint my-[18px] mt-4 font-mono text-sm leading-[1.8] not-italic">
              {settings.venueAddress}
            </address>

            <p className="text-cream-2 text-[16px] leading-[1.7]">{copy.text}</p>

            <p className="text-cream-3 mt-7 font-mono text-[12px] tracking-[0.14em] uppercase">
              {copy.comoChegar}
            </p>

            <div className="mt-3 flex flex-wrap gap-2.5">
              {apps.map((app) => (
                <Button
                  key={app.label}
                  size="sm"
                  variant="ghost"
                  href={app.href}
                  target="_blank"
                  rel="noopener"
                  className={iconClasses}
                >
                  {app.icon}
                  {app.label}
                </Button>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="border-line aspect-4/3 overflow-hidden border bg-[repeating-linear-gradient(135deg,#1E3218_0_10px,#24391D_10px_20px)]">
              <iframe
                title={copy.mapAlt}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
                className="block size-full border-0 [filter:grayscale(1)_invert(.92)_sepia(.42)_hue-rotate(58deg)_saturate(1.6)_brightness(.9)_contrast(1.05)]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
