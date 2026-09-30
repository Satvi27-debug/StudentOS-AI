'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBasicProfileAction } from '@/actions/profile'

type Props = {
  name: string
  college: string
  degree: string
  branch: string
  year: string
  semester: string
}

const FIELDS: Array<{ key: keyof Props; label: string; placeholder: string; full?: boolean }> = [
  { key: 'name', label: 'Name', placeholder: 'Your name', full: true },
  { key: 'college', label: 'College', placeholder: 'College / university', full: true },
  { key: 'degree', label: 'Degree', placeholder: 'e.g. B.Tech' },
  { key: 'branch', label: 'Branch', placeholder: 'e.g. Computer Science' },
  { key: 'year', label: 'Year', placeholder: 'e.g. 3rd' },
  { key: 'semester', label: 'Semester', placeholder: 'e.g. 6' },
]

export function ProfileForm(initial: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Props>(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const save = async () => {
    setSaving(true)
    setStatus(null)
    const res = await updateBasicProfileAction({
      name: values.name,
      college: values.college,
      degree: values.degree,
      branch: values.branch,
      year: values.year,
      semester: values.semester,
    })
    setSaving(false)
    if (res.ok) {
      setStatus({ type: 'ok', text: 'Profile saved ✓' })
      router.refresh()
    } else {
      setStatus({ type: 'error', text: res.error ?? 'Could not save profile.' })
    }
  }

  return (
    <div>
      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className={`block ${f.full ? 'sm:col-span-2' : ''}`}>
            <span className="mb-1.5 block text-xs font-semibold text-zinc-500">{f.label}</span>
            <input
              type="text"
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {status ? (
          <span
            className={`text-sm font-medium ${
              status.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {status.text}
          </span>
        ) : null}
      </div>
    </div>
  )
}