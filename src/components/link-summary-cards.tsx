import { Star, Telescope, BookOpenText, ShieldAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkItem } from "@/lib/types";

export function LinkSummaryCards({ links }: { links: LinkItem[] }) {
  const totalLinks = links.length;
  const favoriteLinks = links.filter((link) => link.isFavorite).length;
  const readingNow = links.filter((link) => link.status === "Reading").length;
  const importantLinks = links.filter(
    (link) => link.status === "Important"
  ).length;

  const cards = [
    {
      title: "Filtered Links",
      value: totalLinks,
      description: "Matches the current filter and sort state.",
      icon: Telescope,
    },
    {
      title: "Favorites",
      value: favoriteLinks,
      description: "Priority sources for quick revisit.",
      icon: Star,
    },
    {
      title: "Reading Now",
      value: readingNow,
      description: "Items currently in active review.",
      icon: BookOpenText,
    },
    {
      title: "Important",
      value: importantLinks,
      description: "High-signal references worth surfacing first.",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          size="sm"
          className="gap-0.5! rounded-xl px-1 py-4! shadow-none!"
        >
          <CardHeader className="gap-2">
            <div className="text-primary dark:text-chart-2 flex items-center gap-2">
              <card.icon className="size-5" />
              <span className="text-xl font-medium tracking-tight">
                {card.value}
              </span>
            </div>
            <CardTitle className="text-xl! font-medium tracking-tight">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs leading-5">
            {card.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
