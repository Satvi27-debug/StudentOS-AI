'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addSubjectAction,
  addTopicAction,
  deleteSubjectAction,
  setTopicStatusAction,
} from '@/actions/subjects'
import { formatDate } from '@/lib/date'
import { IconPlus, IconTrash } from '@/components/icons'

export type TopicView = {
  id: number
  name: string
  status: 'todo' | 'in_progress' | 'done'
}
export type SubjectView = {
  id: number
  name: string
  examDate: string | null
  topics: TopicView[]
}

const STATUS_CYCLE: Array<TopicView['status']> = ['todo', 'in_progress', 'done']

function statusStyle(status: TopicView['status']) {
  switch (status) {
    case 'done':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    default:
      return 'bg-zinc-100 text-zinc-500 border-zinc-200'
  }
}

function AddSubjectForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!name.trim() || busy) return
    setBusy(true)
    setError('')
    const res = await addSubjectAction({ name, examDate })
    setBusy(false)
    if (res.ok) {
      setName('')
      setExamDate('')
      onDone()
    } else {
      setError(res.error ?? 'Could not add subject.')
    }
  }

  const inputCls =
    'flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="border-t border-zinc-100 px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Subject name (e.g. Operating Systems)"
          className={inputCls}
        />
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          aria-label="Exam date"
          className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !name.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          <IconPlus />
          Add subject
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export function SubjectCard({ subject, onChanged }: { subject: SubjectView; onChanged: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newTopic, setNewTopic] = useState('')
  const [busy, setBusy] = useState(false)

  const doneCount = subject.topics.filter((t) => t.status === 'done').length
  const total = subject.topics.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const cycleStatus = async (topicId: number, current: TopicView['status']) => {
    if (busy) return
    setBusy(true)
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length]
    const res = await setTopicStatusAction({ topicId, status: next })
    setBusy(false)
    if (res.ok) onChanged()
  }

  const addTopic = async () => {
    const name = newTopic.trim()
    if (!name || busy) return
    setBusy(true)
    const res = await addTopicAction({ subjectId: subject.id, name })
    setBusy(false)
    if (res.ok) {
      setNewTopic('')
      onChanged()
    }
  }

  const removeSubject = async () => {
    if (!confirm(`Delete "${subject.name}" and its topics?`)) return
    const res = await deleteSubjectAction(subject.id)
    if (res.ok) onChanged()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-zinc-900">{subject.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {subject.examDate ? `Exam: ${formatDate(subject.examDate)}` : 'No exam date'} ·{' '}
            <span className={doneCount === total && total > 0 ? 'font-medium text-emerald-600' : ''}>
              {doneCount}/{total} topics
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-zinc-500">{pct}%</span>
            </div>
          ) : null}
          <button
            type="button"
            onClick={removeSubject}
            aria-label={`Delete ${subject.name}`}
            className="rounded-lg p-1.5 text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {subject.topics.length > 0 ? (
        <ul className="divide-y divide-zinc-50 border-t border-zinc-100">
          {subject.topics.map((topic) => (
            <li
              key={topic.id}
              className="group flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-zinc-50/60"
            >
              <button
                type="button"
                onClick={() => cycleStatus(topic.id, topic.status)}
                disabled={busy}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all active:scale-90 ${statusStyle(topic.status)}`}
              >
                {topic.status === 'todo'
                  ? 'To do'
                  : topic.status === 'in_progress'
                    ? 'In progress'
                    : 'Done'}
              </button>
              <span
                className={`text-sm transition-all ${
                  topic.status === 'done'
                    ? 'text-zinc-400 line-through decoration-zinc-300'
                    : 'text-zinc-800'
                }`}
              >
                {topic.name}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-t border-zinc-100 px-5 py-3">
        {showAdd ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              placeholder="New topic"
              autoFocus
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              onClick={addTopic}
              disabled={busy || !newTopic.trim()}
              className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:shadow-none"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95"
          >
            <IconPlus className="h-3.5 w-3.5" />
            Add topic
          </button>
        )}
      </div>
    </div>
  )
}

export function SubjectBoard({
  subjects,
  addable = true,
}: {
  subjects: SubjectView[]
  addable?: boolean
}) {
  const router = useRouter()
  const refresh = () => router.refresh()
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-4">
      {subjects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 px-5 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            📚
          </div>
          <p className="text-sm font-semibold text-zinc-900">No subjects yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-500">
            Add your first subject to start tracking your syllabus and exam prep.
          </p>
        </div>
      ) : (
        subjects.map((s) => <SubjectCard key={s.id} subject={s} onChanged={refresh} />)
      )}

      {addable ? (
        showAdd ? (
          <AddSubjectForm onDone={refresh} />
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-300 bg-white/60 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm active:scale-95"
          >
            <IconPlus className="h-4 w-4" />
            Add subject
          </button>
        )
      ) : null}
    </div>
  )
}