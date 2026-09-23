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
      setStatus({ type: 'ok', text: 'Profile saved.' })
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
            <span className="mb-1 block text-xs font-medium text-zinc-600">{f.label}</span>
            <input
              type="text"
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {status ? (
          <span className={status.type === 'ok' ? 'text-sm text-green-700' : 'text-sm text-red-600'}>
            {status.text}
          </span>
        ) : null}
      </div>
    </div>
  )
}