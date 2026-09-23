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
      return 'bg-green-100 text-green-700 border-green-200'
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    default:
      return 'bg-zinc-100 text-zinc-600 border-zinc-200'
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

  return (
    <div className="border-t border-zinc-200 px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Subject name (e.g. Operating Systems)"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          aria-label="Exam date"
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !name.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <IconPlus />
          Add subject
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
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
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">{subject.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {subject.examDate ? `Exam: ${formatDate(subject.examDate)}` : 'No exam date'} ·{' '}
            {doneCount}/{total} topics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 ? (
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
            </div>
          ) : null}
          <button
            type="button"
            onClick={removeSubject}
            aria-label={`Delete ${subject.name}`}
            className="rounded-md p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {subject.topics.length > 0 ? (
        <ul className="border-t border-zinc-100 divide-y divide-zinc-100">
          {subject.topics.map((topic) => (
            <li key={topic.id} className="flex items-center gap-3 px-5 py-2">
              <button
                type="button"
                onClick={() => cycleStatus(topic.id, topic.status)}
                disabled={busy}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${statusStyle(topic.status)}`}
              >
                {topic.status === 'todo'
                  ? 'To do'
                  : topic.status === 'in_progress'
                    ? 'In progress'
                    : 'Done'}
              </button>
              <span
                className={`text-sm ${
                  topic.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-800'
                }`}
              >
                {topic.name}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-t border-zinc-100 px-5 py-2.5">
        {showAdd ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              placeholder="New topic"
              autoFocus
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addTopic}
              disabled={busy || !newTopic.trim()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
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
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white px-5 py-8 text-center text-sm text-zinc-500">
          No subjects yet. Add your first subject to start tracking your syllabus.
        </p>
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
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <IconPlus className="h-3.5 w-3.5" />
            Add subject
          </button>
        )
      ) : null}
    </div>
  )
}