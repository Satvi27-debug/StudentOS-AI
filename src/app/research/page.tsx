import { Stub } from "@/components/Stub";

export const metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <Stub
      title="Research"
      description="Research topic exploration, paper understanding, literature organisation and experiment planning — clearly separating retrieved information from AI interpretation."
      roadmap={[
        "Research topic exploration",
        "Paper understanding and reading lists",
        "Literature organisation",
        "Experiment and methodology planning",
        "Research documentation",
      ]}
      action={{ label: "Ask the AI Assistant", href: "/assistant" }}
    />
  );
}