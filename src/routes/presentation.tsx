import { createFileRoute } from "@tanstack/react-router";
import { Presentation } from "@/components/presentation/presentation";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — WildCards" },
      {
        name: "description",
        content:
          "Technical presentation of WildCards — browser-based multiplayer UNO game architecture, features, and implementation.",
      },
      { property: "og:title", content: "WildCards — Technical Presentation" },
      {
        property: "og:description",
        content: "WildCards technical project presentation",
      },
    ],
  }),
  component: PresentationPage,
});

function PresentationPage() {
  return <Presentation />;
}
