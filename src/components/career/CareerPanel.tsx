'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCareerProfileAction } from '@/actions/profile'
import { IconPlus, IconTarget, IconTrendingUp } from '@/components/icons'

export function CareerPanel({
  targetRole,
  skills,
  interests,
}: {
  targetRole: string | null
  skills: string[] | null
  interests: string[] | null
}) {
  const router = useRouter()
  const [role, setRole] = useState(targetRole ?? '')
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const allSkills = skills ?? []

  const saveRole = async () => {
    setSaving(true)
    await updateCareerProfileAction({ targetRole: role.trim() })
    setSaving(false)
    setSavedAt('Saved ✓')
    setTimeout(() => setSavedAt(null), 2000)
    router.refresh()
  }

  const addSkill = async () => {
    const s = skillInput.trim()
    if (!s) return
    if (allSkills.includes(s)) {
      setSkillInput('')
      return
    }
    setSaving(true)
    await updateCareerProfileAction({ skills: [...allSkills, s] })
    setSaving(false)
    setSkillInput('')
    router.refresh()
  }

  const removeSkill = async (skill: string) => {
    setSaving(true)
    await updateCareerProfileAction({ skills: allSkills.filter((s) => s !== skill) })
    setSaving(false)
    router.refresh()
  }

  const inputCls =
    'rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <IconTarget className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-zinc-900">Target role</h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          The role you are working towards — used by the Career and Study agents to personalise guidance.
        </p>
        <div className="mt-2.5 flex max-w-lg gap-2">
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Machine Learning Intern"
            className={`flex-1 ${inputCls}`}
          />
          <button
            type="button"
            onClick={saveRole}
            disabled={saving}
            className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            {savedAt ?? 'Save'}
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <IconTrendingUp className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-zinc-900">Skills</h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          The StudentOS agents compare these against job requirements to show real skill gaps.
        </p>
        {allSkills.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {allSkills.map((s) => (
              <li
                key={s}
                className="group inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-indigo-300 hover:shadow"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  aria-label={`Remove ${s}`}
                  className="text-zinc-300 transition-colors hover:text-rose-500"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">No skills added yet.</p>
        )}
        <div className="mt-3 flex max-w-sm gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill (e.g. Python)"
            className={`flex-1 ${inputCls}`}
          />
          <button
            type="button"
            onClick={addSkill}
            aria-label="Add skill"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 active:scale-90"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-900">Career interests</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {interests?.length ? interests.slice(0, 8).join(' · ') : 'Not set yet.'}
        </p>
      </section>
    </div>
  )
}