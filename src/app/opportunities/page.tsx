import { Stub } from "@/components/Stub";

export const metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <Stub
      title="Opportunities"
      description="Internships, scholarships, hackathons, competitions, fellowships and open-source programs — organised by eligibility, deadline and your interests."
      roadmap={[
        "Opportunity tracking with application status",
        "Deadline-focused organisation",
        "Matching opportunities to your profile",
        "Application workflow from saved to applied",
      ]}
      action={{ label: "Ask the AI Assistant", href: "/assistant" }}
    />
  );
}