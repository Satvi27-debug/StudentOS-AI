'use client'

import { useState } from 'react'
import { useStudent, useStudentActions } from '@/lib/local/store'
import { todayKey } from '@/lib/date'
import { IconClock } from '@/components/icons'

export function StudySessionForm() {
  const { state } = useStudent()
  const actions = useStudentActions()
  const [subjectId, setSubjectId] = useState(state?.subjects[0]?.id ?? '')
  const [topicId, setTopicId] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(todayKey())
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')

  const selectedSubject = state?.subjects.find((s) => s.id === subjectId)

  const submit = () => {
    const mins = Number(duration)
    if (!subjectId) {
      setFormError('Pick a subject.')
      return
    }
    if (!mins || mins <= 0) {
      setFormError('Duration must be greater than 0.')
      return
    }
    if (mins > 1440) {
      setFormError('Duration cannot exceed 24 hours.')
      return
    }
    if (!date) {
      setFormError('Pick a date.')
      return
    }
    actions.addStudySession({
      subjectId,
      topicId: topicId || null,
      duration: mins,
      date,
      notes: notes || undefined,
    })
    setDuration('')
    setNotes('')
    setFormError('')
  }

  const inputCls =
    'rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <IconClock className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-zinc-900">Log a study session</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={subjectId}
          onChange={(e) => {
            setSubjectId(e.target.value)
            setTopicId('')
          }}
          className={inputCls}
        >
          {state?.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className={inputCls}
        >
          <option value="">General</option>
          {selectedSubject?.topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Minutes"
          className={inputCls}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCls}
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className={inputCls}
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
        >
          Log session
        </button>
        {formError ? <p className="text-xs text-rose-600">{formError}</p> : null}
      </div>
    </div>
  )
}