import { Stub } from "@/components/Stub";

export const metadata = { title: "Coding" };

export default function CodingPage() {
  return (
    <Stub
      title="Coding"
      description="Concepts, debugging, algorithms and data structures with reasoning — plus project development and Git/GitHub workflows."
      roadmap={[
        "Programming concept and doubt support",
        "Algorithm & data structure practice",
        "Code explanation and improvement",
        "Complexity analysis",
        "Testing and Git/GitHub workflows",
      ]}
      action={{ label: "Ask the AI Assistant", href: "/assistant" }}
    />
  );
}