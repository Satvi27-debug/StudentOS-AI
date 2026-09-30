'use client'

import { useState } from 'react'
import { useStudent, useStudentActions } from '@/lib/local/store'
import { IconUser } from '@/components/icons'

export default function ProfilePage() {
  const { state } = useStudent()
  const actions = useStudentActions()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: state.student.name ?? '',
    college: state.student.college ?? '',
    degree: state.student.degree ?? '',
    branch: state.student.branch ?? '',
    graduationYear: state.student.graduationYear ?? '',
    bio: state.student.bio ?? '',
  })

  const save = () => {
    actions.updateStudent({
      name: form.name.trim() || 'Student',
      college: form.college.trim(),
      degree: form.degree.trim(),
      branch: form.branch.trim(),
      graduationYear: form.graduationYear.trim(),
      bio: form.bio.trim(),
    })
    setEditing(false)
  }

  const inputCls =
    'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your basic academic information — the context every StudentOS agent uses.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">College</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Degree</label>
                <input
                  type="text"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Branch</label>
                <input
                  type="text"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Graduation year</label>
                <input
                  type="text"
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Bio</label>
                <input
                  type="text"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={save}
                className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
              >
                Save profile
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
                {state.student.name?.[0]?.toUpperCase() ?? <IconUser className="h-6 w-6" />}
              </span>
              <div>
                <p className="text-lg font-bold text-zinc-900">{state.student.name}</p>
                <p className="text-sm text-zinc-500">
                  {state.student.degree}{state.student.branch ? ` · ${state.student.branch}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="ml-auto rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95"
              >
                Edit
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'College', value: state.student.college },
                { label: 'Degree', value: state.student.degree },
                { label: 'Branch', value: state.student.branch },
                { label: 'Graduation', value: state.student.graduationYear },
              ].map((f) => (
                <div key={f.label} className="rounded-xl bg-zinc-50 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold text-zinc-400">{f.label}</p>
                  <p className="text-sm font-medium text-zinc-800">{f.value || '—'}</p>
                </div>
              ))}
            </div>
            {state.student.bio ? (
              <div className="rounded-xl bg-zinc-50 px-3.5 py-2.5">
                <p className="text-[11px] font-semibold text-zinc-400">Bio</p>
                <p className="text-sm font-medium text-zinc-800">{state.student.bio}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}