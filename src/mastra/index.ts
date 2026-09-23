import { Mastra } from '@mastra/core'
import { supervisorAgent } from './agents/supervisor'
import { studyAgent } from './agents/study'
import { productivityAgent } from './agents/productivity'
import { careerAgent } from './agents/career'

/**
 * The StudentOS Mastra instance.
 * Agents are the same objects imported directly by route handlers —
 * this registry is used by the Mastra Studio / dev tooling.
 */
export const mastra = new Mastra({
  agents: {
    supervisor: supervisorAgent,
    study: studyAgent,
    productivity: productivityAgent,
    career: careerAgent,
  },
})