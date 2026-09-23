import { Stub } from "@/components/Stub";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <Stub
      title="Projects"
      description="A workspace per project: description, technologies, tasks, status, repository and deadlines — with an AI project assistant."
      roadmap={[
        "Project ideas and requirements",
        "Architecture and feature planning",
        "Task breakdown and development plans",
        "Documentation and README creation",
        "Testing and deployment planning",
      ]}
      action={{ label: "Ask the AI Assistant", href: "/assistant" }}
    />
  );
}