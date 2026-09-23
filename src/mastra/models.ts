/** Model configuration. Mastra resolves 'provider/model' strings itself. */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? 'google/gemini-2.5-flash'

export const aiConfigured = Boolean(process.env.GOOGLE_API_KEY)