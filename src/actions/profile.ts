'use server'

import { getCurrentUserId } from '@/lib/auth'
import { updateProfile } from '@/db/queries'

type ActionResult = { ok: boolean; error?: string }

export async function updateBasicProfileAction(input: {
  name?: string
  college?: string
  degree?: string
  branch?: string
  year?: string
  semester?: string
}): Promise<ActionResult> {
  const patch = Object.fromEntries(
    Object.entries(input).filter(
      ([, v]) => typeof v === 'string' && v.trim().length > 0
    )
  ) as Record<string, string>

  for (const [key, value] of Object.entries(patch)) {
    if (value.length > 200) return { ok: false, error: `${key} is too long.` }
  }

  const res = await updateProfile(await getCurrentUserId(), patch)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not save profile.' }
}

export async function updateCareerProfileAction(input: {
  targetRole?: string
  skills?: string[]
  interests?: string[]
}): Promise<ActionResult> {
  const patch: Record<string, unknown> = {}
  if (input.targetRole !== undefined) {
    if (input.targetRole.length > 200) return { ok: false, error: 'Target role is too long.' }
    patch.targetRole = input.targetRole
  }
  if (input.skills !== undefined) {
    const cleaned = [...new Set(input.skills.map((s) => s.trim()).filter(Boolean))].slice(0, 60)
    patch.skills = cleaned.map((s) => s.slice(0, 60))
  }
  if (input.interests !== undefined) {
    const cleaned = [...new Set(input.interests.map((s) => s.trim()).filter(Boolean))].slice(0, 60)
    patch.interests = cleaned.map((s) => s.slice(0, 60))
  }

  const res = await updateProfile(await getCurrentUserId(), patch)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not save profile.' }
}