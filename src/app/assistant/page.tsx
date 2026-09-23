import { AssistantChat } from "@/components/assistant/AssistantChat";

export const metadata = { title: "AI Assistant" };

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function AssistantPage({ searchParams }: Props) {
  const { q } = await searchParams

  return (
    <div className="flex h-full flex-col">
      <AssistantChat initialQuery={q} />
    </div>
  )
}