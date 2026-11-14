import { cn } from "@/lib/utils";

export default function SectionHeading({ kicker, title, description, align = "left" }) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {kicker && <p className="eyebrow">{kicker}</p>}
      <h2 className="mt-2 text-2xl font-semibold uppercase tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}