import { NextResponse } from 'next/server'
import { runWithUser } from '@/lib/async-context'
import { getCurrentUserId } from '@/lib/auth'
import { aiConfigured } from '@/mastra/models'
import { buildStudentContext } from '@/mastra/context'
import { routeSchema, ROUTER_INSTRUCTIONS, GENERAL_INSTRUCTIONS, AGENT_IDS } from '@/mastra/routing'
import type { AgentId } from '@/mastra/routing'
import { supervisorAgent } from '@/mastra/agents/supervisor'
import { studyAgent, STUDY_INSTRUCTIONS } from '@/mastra/agents/study'
import { productivityAgent, PRODUCTIVITY_INSTRUCTIONS } from '@/mastra/agents/productivity'
import { careerAgent, CAREER_INSTRUCTIONS } from '@/mastra/agents/career'

type ChatMessage = { role: 'user'; content: string } | { role: 'assistant'; content: string }

function normalizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return []
  const out: ChatMessage[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object' || !('content' in m)) continue
    const role = m.role === 'assistant' ? 'assistant' : 'user'
    const content = typeof m.content === 'string' ? m.content : String(m.content ?? '')
    if (!content.trim()) continue
    const sliced = content.slice(0, 8000)
    out.push(role === 'assistant' ? { role: 'assistant', content: sliced } : { role: 'user', content: sliced })
  }
  return out.slice(-24)
}

const agentFor = (id: AgentId) => {
  switch (id) {
    case 'study':
      return studyAgent
    case 'productivity':
      return productivityAgent
    case 'career':
      return careerAgent
    default:
      return supervisorAgent
  }
}

/** Instructions each specialized agent runs with (base instructions as defined in its file). */
const AGENT_INSTRUCTIONS: Record<AgentId, string> = {
  study: STUDY_INSTRUCTIONS,
  productivity: PRODUCTIVITY_INSTRUCTIONS,
  career: CAREER_INSTRUCTIONS,
  general: GENERAL_INSTRUCTIONS,
}
const agentInstructions = (id: AgentId): string => AGENT_INSTRUCTIONS[id]

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    // fall through — handled below
  }
  const messages = normalizeMessages((payload as { messages?: unknown } | null)?.messages)
  if (messages.length === 0) {
    return NextResponse.json({ error: 'No messages provided.' }, { status: 400 })
  }

  if (!aiConfigured) {
    return NextResponse.json(
      {
        code: 'ai_not_configured',
        error: 'Gemini is not configured. Set GOOGLE_API_KEY in .env to enable the AI Assistant.',
      },
      { status: 503 }
    )
  }

  const userId = await getCurrentUserId()

  const encoder = new TextEncoder()
  let controllerRef!: ReadableStreamDefaultController<Uint8Array>
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller
    },
  })

  const send = (obj: unknown) => {
    try {
      controllerRef.enqueue(encoder.encode(JSON.stringify(obj) + '\n'))
    } catch {
      // stream already closed
    }
  }

  runWithUser(userId, async () => {
    try {
      const ctx = await buildStudentContext(userId)
      send({ type: 'context', available: ctx.available })
      const contextBlock = ctx.available
        ? `<student_context>\n${ctx.text}\n</student_context>`
        : ctx.notice

      // 1. Supervisor routing — pick the right agent for this request.
      const routeResult = await supervisorAgent.generate(messages, {
        instructions: ROUTER_INSTRUCTIONS + '\n\n' + contextBlock,
        structuredOutput: { schema: routeSchema, jsonPromptInjection: true },
      })
      const selected = (AGENT_IDS as readonly string[]).includes(routeResult.object?.selected ?? '')
        ? (routeResult.object!.selected as AgentId)
        : 'general'
      send({
        type: 'meta',
        agent: selected,
        reasoning: routeResult.object?.reasoning ?? '',
      })

      // 2. Run the chosen agent (or the supervisor itself) with student context.
      const target = agentFor(selected)
      const stream = await target.stream(messages, {
        instructions: agentInstructions(selected) + '\n\n' + contextBlock,
        maxSteps: 6,
      })

      // 3. Stream back text deltas and tool events as NDJSON.
      for await (const chunk of stream.fullStream) {
        const payload = (chunk as { payload?: Record<string, unknown> }).payload
        if (!payload) continue
        switch (chunk.type) {
          case 'text-delta': {
            const delta = typeof payload.text === 'string' ? payload.text : ''
            if (delta) send({ type: 'text', delta })
            break
          }
          case 'tool-call':
            send({
              type: 'tool-call',
              name: String(payload.toolName ?? ''),
              args: JSON.stringify(payload.args ?? {}).slice(0, 400),
            })
            break
          case 'tool-result':
            send({
              type: 'tool-result',
              name: String(payload.toolName ?? ''),
              result: payload.result,
            })
            break
          case 'error':
            send({
              type: 'warning',
              message: String(
                ((chunk as { error?: unknown }).error ?? 'The agent hit an issue while responding.')
              ),
            })
            break
          default:
            break
        }
      }
      send({ type: 'done' })
    } catch (e) {
      console.error('[assistant] request failed:', e)
      send({
        type: 'error',
        message:
          e instanceof Error
            ? e.message
            : 'Something went wrong while processing your request. Please try again.',
      })
    } finally {
      try {
        controllerRef.close()
      } catch {
        // already closed
      }
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}