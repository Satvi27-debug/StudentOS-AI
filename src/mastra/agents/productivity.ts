import { Agent } from '@mastra/core/agent'
import { GEMINI_MODEL } from '../models'
import { createTasksTool } from '../tools/create-tasks'

export const PRODUCTIVITY_INSTRUCTIONS = `You are the Productivity Agent of StudentOS, specialized in tasks, deadlines, and planning.

You help students organize work across study, projects, career, and personal goals; set priorities; and schedule realistically around competing deadlines.

Rules:
- Turn every plan you make into real tasks using the create_tasks tool (short titles, sensible YYYY-MM-DD due dates). Your goal is a task list the student can act on today.
- Account for the student's open tasks and deadlines from their context: flag overload, suggest what to drop or defer.
- Be specific and realistic — the student may have other commitments shown in their context.
- If data is missing or the database is unavailable, say so instead of inventing deadlines.`

export const productivityAgent = new Agent({
  id: 'productivity',
  name: 'Productivity Agent',
  description: 'Tasks, deadlines, prioritisation and schedules; converts plans into real tasks.',
  instructions: PRODUCTIVITY_INSTRUCTIONS,
  model: GEMINI_MODEL,
  tools: { create_tasks: createTasksTool },
})