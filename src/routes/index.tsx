import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MessageSquare, Phone, X } from "lucide-react";
import {
  type ComponentProps,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import deck from "@/assets/deck.jpg";
import stamp from "@/assets/stamp.jpg";
import tree from "@/assets/tree.jpg";
import logo from "@/assets/logo-icon-png.png";
import aboutLogo from "@/assets/logo-full-png.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const projects = [
  {
    image: deck,
    title: "project name",
    alt: "project description",
    location: "location",
    detail: "project materials detail",
  },
  {
    image: stamp,
    title: "project name",
    alt: "project description",
    location: "location",
    detail: "project materials detail",
  },
  {
    image: tree,
    title: "project name",
    alt: "project description",
    location: "location",
    detail: "project materials detail",
  },
];

// TODO: replace with real reviews. Shown one per slide, so keep the same length as `projects`.
const reviews = [
  {
    quote: "These photos and reviews are placeholders and are not real.",
    name: "Dom Saint P",
    location: "Southeast",
  },
  {
    quote: "These photos and reviews are placeholders and are not real.",
    name: "Dom Saint P",
    location: "Southeast",
  },
  {
    quote: "These photos and reviews are placeholders and are not real.",
    name: "Dom Saint P",
    location: "Southeast",
  },
];

const pageTitle = "Lumber Lab Outdoor Construction | Portland, OR";
const pageDescription = "We are a locally owned and operated home project construction company.";

// TODO: replace with the real business number (used in tel:/sms: links, visible text, and schema).
const BUSINESS_PHONE = "+19710000000";
const PHONE_DISPLAY = BUSINESS_PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");

// TODO: real Oregon CCB number. Shown in the footer as-is; only added to the schema once it isn't the placeholder.
const CCB_NUMBER = "000000";
const HAS_REAL_CCB = CCB_NUMBER !== "000000";
// TODO: your WA L&I contractor registration (e.g. "LUMBLLO000AB"). Shown in the footer when set.
const WA_LNI_NUMBER = "LUMLABP000WA";

// TODO: add your Google Business Profile and real social URLs once they exist.
const SOCIAL_PROFILES: string[] = [
  // "https://www.google.com/maps/place/...",
  // "https://www.instagram.com/...",
];

// TODO: point at an external form service (Formspree, etc.). The site is static on GitHub Pages,
// so there is no server to handle `/api/lead` and submissions currently fail.
const LEAD_ENDPOINT = "/api/lead";

const serviceAreas = [
  "Portland, OR",
  "Gresham, OR",
  "Troutdale, OR",
  "Beaverton, OR",
  "Tigard, OR",
  "Hillsboro, OR",
  "Lake Oswego, OR",
  "Oregon City, OR",
  "Milwaukie, OR",
  "Tualatin, OR",
  "Vancouver, WA",
  "Orchards, WA",
  "Camas, WA",
  "Washougal, WA",
  "Battle Ground, WA",
  "Ridgefield, WA",
];

const services = [
  "Decks",
  "Patios",
  "Gazebos",
  "Pergolas",
  "Fences",
  "ADUs",
  "Saunas",
  "Concrete",
  "Treehouses",
  "Playgrounds",
];

const REVIEW_CARD_CLASS =
  "absolute top-6 right-6 md:top-10 md:right-14 z-[4] max-w-sm p-4 md:p-5 rounded pointer-events-none animate-fade-in bg-[color-mix(in_oklab,var(--iron)_82%,transparent)] backdrop-blur-md border border-[color-mix(in_oklab,var(--bone)_12%,transparent)] border-t-2 border-t-[var(--cedar)]";

const CEDAR_LINK_CLASS =
  "btn-cedar flex items-center justify-center gap-2 h-[50px] px-3 rounded-[2px] tracking-wider text-[11px] transition-all";

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

// Guarantee a trailing slash so `${BASE_URL}#website` and `${BASE_URL}file.png` are well-formed.
const BASE_URL = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;

const STATE_NAMES: Record<string, string> = { OR: "Oregon", WA: "Washington" };

const areaServed = [
  ...serviceAreas.map((label) => {
    const [city = label, state = ""] = label.split(", ");
    return {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: STATE_NAMES[state] ?? state },
    };
  }),
  ...Object.values(STATE_NAMES).map((name) => ({ "@type": "State", name })),
];

// schema.org business info for search engines (rendered as JSON-LD in the page head).
// Optional additions: openingHoursSpecification once hours are set; address only if it should be public.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}#website`,
      url: BASE_URL,
      name: "Lumber Lab Outdoor Construction",
      alternateName: SITE_NAME,
      publisher: { "@id": `${BASE_URL}#business` },
    },
    {
      "@type": "GeneralContractor",
      "@id": `${BASE_URL}#business`,
      name: SITE_NAME,
      url: BASE_URL,
      telephone: BUSINESS_PHONE,
      image: OG_IMAGE,
      logo: `${BASE_URL}apple-touch-icon.png`,
      description: pageDescription,
      priceRange: "$$",
      areaServed,
      ...(HAS_REAL_CCB && {
        identifier: {
          "@type": "PropertyValue",
          name: "Oregon CCB License",
          value: CCB_NUMBER,
        },
      }),
      ...(SOCIAL_PROFILES.length > 0 && { sameAs: SOCIAL_PROFILES }),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Construction",
        itemListElement: services.map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      // Describes the first project photo; update it if public/og-image.jpg shows something else.
      { property: "og:image:alt", content: projects[0]?.alt ?? SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: BASE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      },
    ],
  }),
  component: Index,
});

/* -------------------------------------------------------------------------- */
/* Small helpers / components                                                 */
/* -------------------------------------------------------------------------- */

type Panel = "none" | "about" | "services" | "quote";
type SubmitStatus = "idle" | "sending" | "sent" | "error";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function CedarButton({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button className={cn("btn-cedar", className)} {...props} />;
}

/**
 * Slide-in panel that behaves like a dialog:
 * - `inert` while closed, so its contents can't be tabbed to or read by screen readers
 * - receives focus when opened (focus returns to the opener via `closePanel`)
 */
function SlidePanel({
  open,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.inert = !open;
    if (open) element.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={cn("slide-panel focus:outline-none", open && "slide-panel-open", className)}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function Index() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [panel, setPanel] = useState<Panel>("none");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const reducedMotion = usePrefersReducedMotion();

  const triggerRef = useRef<HTMLElement | null>(null);

  const cycle = (direction: number) => {
    setProjectIndex((current) => (current + direction + projects.length) % projects.length);
  };

  const openPanel = (next: Exclude<Panel, "none">) => {
    // Remember what opened the panel so focus can return there on close.
    if (panel === "none") triggerRef.current = document.activeElement as HTMLElement | null;
    // Reopening the quote panel after a submit (or error) shows a fresh form.
    if (next === "quote" && status !== "sending") setStatus("idle");
    setPanel(next);
  };

  const closePanel = () => {
    setPanel("none");
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  // Close on Escape while a panel is open.
  useEffect(() => {
    if (panel === "none") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel("none");
        triggerRef.current?.focus();
        triggerRef.current = null;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panel]);

  // Autoplay: restarts its 5s countdown on every slide change, and stops while a panel
  // is open or when the visitor prefers reduced motion.
  const autoplay = !reducedMotion && panel === "none";

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => {
      setProjectIndex((current) => (current + 1) % projects.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [autoplay, projectIndex]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const currentReview = reviews[projectIndex];

  return (
    <main className="site-shell">
      {/* --- Left Brand Panel --- */}
      <section className="brand-panel">
        <div className="brand-lockup">
          <img src={logo} alt="" className="brand-logo" width={42} height={42} />
          <div>
            <p className="brand-name">Lumber Lab</p>
            <p className="brand-place">Outdoor Construction</p>
          </div>
        </div>

        <div className="brand-licenses">
          <span>CCB #{CCB_NUMBER}</span>
          {WA_LNI_NUMBER && <span>{WA_LNI_NUMBER}</span>}
        </div>

        <div className="brand-copy animate-fade-in">
          <p className="eyebrow">
            Serving the Greater PDX Metro Area
            <br />& SW Washington
          </p>
          <h1>
            Locally Owned
            <br />
            <em>Family Run</em>
          </h1>
          <p className="intro">Website by Dom. Work in Progress.</p>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <CedarButton className="nav-button" onClick={() => openPanel("about")}>
            <span>About The Lab</span>
            <ArrowRight />
          </CedarButton>

          <CedarButton className="nav-button" onClick={() => openPanel("services")}>
            <span>Services</span>
            <ArrowRight />
          </CedarButton>

          <CedarButton className="nav-button" onClick={() => openPanel("quote")}>
            <span>Contact us</span>
            <ArrowRight />
          </CedarButton>
        </nav>
      </section>

      {/* --- Right Interactive Stage --- */}
      <section className="stage" aria-roledescription="carousel" aria-label="Recent projects">
        {/* Mouse/touch convenience only; the Next button below is the accessible control. */}
        <button
          className="stage-clicker"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => cycle(1)}
        />

        {projects.map((project, index) => (
          <img
            key={project.title}
            src={project.image}
            alt={project.alt}
            aria-hidden={index !== projectIndex}
            width={1600}
            height={1200}
            loading={index === 0 ? "eager" : "lazy"}
            className={cn("stage-image", index === projectIndex && "stage-image-active")}
          />
        ))}

        <div className="stage-shade" />

        {/* --- Top-Right Review Card --- */}
        {panel === "none" && currentReview && (
          <aside key={`review-${projectIndex}`} className={REVIEW_CARD_CLASS}>
            <div className="text-[var(--cedar)] text-xs tracking-widest mb-1.5">★★★★★</div>
            <blockquote className="m-0 text-xs md:text-sm italic text-[var(--bone)] leading-relaxed">
              “{currentReview.quote}”
            </blockquote>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-[var(--cedar)] font-semibold mt-2">
              {currentReview.name}{" "}
              <span className="text-[var(--steel)] font-normal opacity-80">
                — {currentReview.location}
              </span>
            </p>
          </aside>
        )}

        {/* --- Bottom-Left Project Caption --- */}
        <div className="stage-content">
          <div key={projectIndex} className="project-caption animate-fade-in">
            <p>{projects[projectIndex]?.location}</p>
            <h2>{projects[projectIndex]?.title}</h2>
            <span>{projects[projectIndex]?.detail}</span>
          </div>
        </div>

        {/* --- Stage Pagination Controls --- */}
        <div className="stage-controls">
          <div className="control-buttons">
            <Button variant="ghost" size="icon" aria-label="Previous" onClick={() => cycle(-1)}>
              <ArrowLeft />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Next" onClick={() => cycle(1)}>
              <ArrowRight />
            </Button>
          </div>
        </div>

        {/* --- Slide-in About Panel --- */}
        <SlidePanel
          open={panel === "about"}
          labelledBy="about-heading"
          className="flex flex-col min-h-full"
        >
          {/* Top: close button and logo. On short windows the logo shrinks (down to min-h-24)
              so the panel fits without scrolling; the copy and call to action keep their size. */}
          <div className="relative flex flex-col items-center min-h-24 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-1 right-0 text-[var(--bone)] hover:bg-[color-mix(in_oklab,var(--bone)_10%,transparent)]"
              aria-label="Close about panel"
              onClick={closePanel}
            >
              <X />
            </Button>

            <img
              src={aboutLogo}
              alt="Lumber Lab Outdoor Construction logo"
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="w-60 md:w-72 lg:w-80 h-auto min-h-0 object-contain mx-auto"
            />
          </div>

          <h2 id="about-heading" className="sr-only">
            About Lumber Lab Outdoor Construction
          </h2>

          <div className="mt-8 text-sm md:text-base text-[color-mix(in_oklab,var(--bone)_80%,transparent)] leading-relaxed">
            <p>
              We build outdoor living spaces with your choice of materials and aid in the design
              process to bring your vision into your backyard. From stamped concrete patios to
              hardwood decks, stained cedar awnings to hot tub pads, we can build it. Call or text
              us for a free same day, in person consultation.
            </p>
          </div>

          {/* Bottom: call to action, pinned by mt-auto */}
          <div className="pt-6 mt-auto">
            <CedarButton
              className="w-full h-[50px] tracking-wider text-xs justify-between"
              onClick={() => setPanel("quote")}
            >
              <span>Click here to get in touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </CedarButton>
          </div>
        </SlidePanel>

        {/* --- Slide-in Services Panel --- */}
        <SlidePanel
          open={panel === "services"}
          labelledBy="services-heading"
          className="flex flex-col justify-between min-h-full"
        >
          <div>
            <div className="services-header">
              <div>
                <p className="eyebrow">Our build menu</p>
                <h2 id="services-heading">Services</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close services panel"
                onClick={closePanel}
              >
                <X />
              </Button>
            </div>

            <ul className="services-list">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Bottom: call to action, pinned by mt-auto */}
          <div className="pt-6 mt-auto">
            <CedarButton
              className="w-full h-[50px] tracking-wider text-xs justify-between"
              onClick={() => openPanel("quote")}
            >
              <span>Click here to get in touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </CedarButton>
          </div>
        </SlidePanel>

        {/* --- Slide-in Consultation Panel --- */}
        <SlidePanel open={panel === "quote"} labelledBy="quote-heading">
          <div className="quote-header">
            <div>
              <p className="eyebrow">Click to call or text for a</p>
              <h2 id="quote-heading">free consultation</h2>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close quote form" onClick={closePanel}>
              <X />
            </Button>
          </div>

          {status === "sent" ? (
            <div className="success-message animate-fade-in" role="status">
              <span>
                <Check />
              </span>
              <h3>Thank you.</h3>
              <p>We’ll give you a call soon to talk about your outdoor space.</p>
              <Button variant="outline" onClick={closePanel}>
                Back to projects
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {/* Quick Contact: Call & Text Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href={`tel:${BUSINESS_PHONE}`} className={CEDAR_LINK_CLASS}>
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call us</span>
                </a>

                <a href={`sms:${BUSINESS_PHONE}`} className={CEDAR_LINK_CLASS}>
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Or text us here</span>
                </a>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[color-mix(in_oklab,var(--bone)_15%,transparent)]" />
                <span className="absolute px-3 text-[10px] uppercase tracking-widest text-[var(--steel)] bg-[var(--iron)]">
                  or request a callback
                </span>
              </div>

              {/* Callback Form */}
              <form onSubmit={onSubmit}>
                {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
                <div aria-hidden="true" className="sr-only">
                  <label>
                    Company
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    Name
                    <Input required name="name" autoComplete="name" placeholder="Your Name" />
                  </label>
                  <label>
                    Phone Number
                    <Input
                      required
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(XXX) XXX.XXXX"
                    />
                  </label>
                </div>

                <label>
                  Project Description
                  <Textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project."
                  />
                </label>

                <CedarButton
                  type="submit"
                  className="submit-button"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Request a call back"}
                  <ArrowUpRight />
                </CedarButton>

                <div aria-live="polite">
                  {status === "error" && (
                    <p role="alert" className="form-note">
                      Something went wrong sending that. Please try again, or call us at{" "}
                      <a href={`tel:${BUSINESS_PHONE}`} className="underline">
                        {PHONE_DISPLAY}
                      </a>
                      .
                    </p>
                  )}
                </div>
                <p className="form-note">Made with Love by Dom Saint P</p>
              </form>
            </div>
          )}
        </SlidePanel>
      </section>
    </main>
  );
}
