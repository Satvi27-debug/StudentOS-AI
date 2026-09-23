import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { currentUserId } from '@/lib/async-context'
import { createTasksBulk } from '@/db/queries'

/**
 * AI → Action. Lets any agent turn part of its plan into real tasks
 * in the student's unified task system.
 */
export const createTasksTool = createTool({
  id: 'create_tasks',
  description:
    'Create one or more tasks in the student’s unified task system. Use this whenever the student asks for a plan, schedule, weekly prep, or a to-do list that should become real trackable tasks. Each task needs a short title and an optional due date (format YYYY-MM-DD).',
  inputSchema: z.object({
    tasks: z
      .array(
        z.object({
          title: z.string().min(1).max(200).describe('Short actionable task title'),
          dueDate: z
            .string()
            .optional()
            .describe('Optional due date, ISO format YYYY-MM-DD'),
        })
      )
      .min(1)
      .max(10),
  }),
  outputSchema: z.object({
    created: z.number().describe('Number of tasks successfully created'),
    errors: z.array(z.string()).describe('Any issues while creating tasks'),
  }),
  execute: async ({ tasks: input }) => {
    const userId = currentUserId()
    const res = await createTasksBulk(userId, input)
    if (res.error || !res.data) {
      return { created: 0, errors: [res.error ?? 'Could not create tasks.'] }
    }
    return { created: res.data.created, errors: res.data.errors }
  },
})