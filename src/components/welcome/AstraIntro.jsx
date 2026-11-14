import { MessageCircle, Sparkles, Telescope } from "lucide-react";
import { Image } from "@/components/ui/image";

const ASTRA_IMAGE =
  "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/c954d6e57_generated_image.png";

const CAPABILITIES = [
  { label: "Explains scientific concepts", icon: Sparkles },
  { label: "Guides you through missions", icon: MessageCircle },
  { label: "Answers your space questions", icon: Telescope },
];

export default function AstraIntro() {
  return (
    <section id="astra" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="panel grid items-center gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-background/60">
            <Image
              src={ASTRA_IMAGE}
              alt="ASTRA, the AI space instructor, shown as a glowing holographic avatar"
              className="h-[260px] w-full sm:h-[320px]"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow">Your onboard instructor</p>
          <h2 className="mt-2 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            Meet ASTRA, your AI space instructor
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every astronaut needs guidance. ASTRA is your intelligent learning companion, helping you
            understand scientific concepts, explore space and discover answers to your questions.
          </p>

          <ul className="mt-6 space-y-2.5">
            {CAPABILITIES.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-foreground/90">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <item.icon className="h-4 w-4 text-primary" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
            ASTRA is available inside the trainee app once you log in, and answers are written for young
            learners using NASA-sourced science.
          </p>
        </div>
      </div>
    </section>
  );
}