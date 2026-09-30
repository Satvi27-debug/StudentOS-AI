import type { StudentState } from './types'

export function createSeedState(): StudentState {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  return {
    student: {
      name: 'Satvendra',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science',
      graduationYear: '2027',
      bio: 'AI/ML + Software Development',
      targetRole: 'Machine Learning Engineer',
      interests: ['AI/ML', 'Web Development', 'System Design'],
    },
    tasks: [
      { id: 't1', title: 'Complete DBMS assignment', priority: 'high', category: 'study', dueDate: today, status: 'todo', createdAt: now.toISOString(), completedAt: null },
      { id: 't2', title: 'Practice 3 DSA problems', priority: 'medium', category: 'coding', dueDate: today, status: 'todo', createdAt: now.toISOString(), completedAt: null },
      { id: 't3', title: 'Review Machine Learning notes', priority: 'medium', category: 'study', dueDate: today, status: 'todo', createdAt: now.toISOString(), completedAt: null },
      { id: 't4', title: 'Build dashboard UI', priority: 'high', category: 'project', dueDate: null, status: 'done', createdAt: now.toISOString(), completedAt: now.toISOString() },
    ],
    goals: [
      { id: 'g1', title: 'Complete DSA preparation', category: 'coding', targetDate: '2026-12-15', progress: 42, status: 'active', createdAt: now.toISOString(), completedAt: null },
      { id: 'g2', title: 'Build 3 portfolio projects', category: 'project', targetDate: '2026-11-30', progress: 67, status: 'active', createdAt: now.toISOString(), completedAt: null },
    ],
    subjects: [
      {
        id: 's1', name: 'Data Structures', examDate: null,
        topics: [
          { id: 's1t1', name: 'Arrays & Strings', status: 'done' },
          { id: 's1t2', name: 'Linked Lists', status: 'done' },
          { id: 's1t3', name: 'Trees', status: 'in_progress' },
          { id: 's1t4', name: 'Graphs', status: 'todo' },
          { id: 's1t5', name: 'Dynamic Programming', status: 'todo' },
        ],
      },
      {
        id: 's2', name: 'Database Management Systems', examDate: '2026-10-15',
        topics: [
          { id: 's2t1', name: 'SQL', status: 'done' },
          { id: 's2t2', name: 'Normalization', status: 'done' },
          { id: 's2t3', name: 'Transactions', status: 'in_progress' },
          { id: 's2t4', name: 'Indexing', status: 'todo' },
        ],
      },
      {
        id: 's3', name: 'Operating Systems', examDate: null,
        topics: [
          { id: 's3t1', name: 'Processes', status: 'done' },
          { id: 's3t2', name: 'Threads', status: 'in_progress' },
          { id: 's3t3', name: 'Scheduling', status: 'todo' },
          { id: 's3t4', name: 'Memory Management', status: 'todo' },
        ],
      },
      {
        id: 's4', name: 'Machine Learning', examDate: null,
        topics: [
          { id: 's4t1', name: 'Linear Regression', status: 'done' },
          { id: 's4t2', name: 'Classification', status: 'in_progress' },
          { id: 's4t3', name: 'Neural Networks', status: 'todo' },
        ],
      },
      {
        id: 's5', name: 'Computer Networks', examDate: null,
        topics: [
          { id: 's5t1', name: 'OSI Model', status: 'done' },
          { id: 's5t2', name: 'TCP/IP', status: 'in_progress' },
          { id: 's5t3', name: 'Routing', status: 'todo' },
        ],
      },
    ],
    studySessions: [
      { id: 'ss1', subjectId: 's2', topicId: 's2t3', duration: 45, date: today, notes: 'Practiced normalization problems', createdAt: now.toISOString() },
      { id: 'ss2', subjectId: 's1', topicId: 's1t3', duration: 60, date: today, notes: 'Tree traversals', createdAt: now.toISOString() },
    ],
    projects: [
      {
        id: 'p1', name: 'StudentOS AI', description: 'AI-powered student operating system', technology: 'Next.js, TypeScript, AI', status: 'in_progress', deadline: '2026-12-01',
        tasks: [
          { id: 'p1t1', title: 'Build dashboard', done: true },
          { id: 'p1t2', title: 'Create task system', done: true },
          { id: 'p1t3', title: 'Design data model', done: false },
          { id: 'p1t4', title: 'Implement AI assistant', done: false },
        ],
        createdAt: now.toISOString(),
      },
      {
        id: 'p2', name: 'Green City AI', description: 'Smart city sustainability platform', technology: 'React, Python, ML', status: 'planning', deadline: null,
        tasks: [
          { id: 'p2t1', title: 'Research phase', done: false },
          { id: 'p2t2', title: 'Data collection', done: false },
        ],
        createdAt: now.toISOString(),
      },
      {
        id: 'p3', name: 'Smart Hire', description: 'AI-powered recruitment platform', technology: 'Next.js, PostgreSQL', status: 'completed', deadline: null,
        tasks: [
          { id: 'p3t1', title: 'Frontend', done: true },
          { id: 'p3t2', title: 'Backend', done: true },
        ],
        createdAt: now.toISOString(),
      },
    ],
    skills: [
      { id: 'sk1', name: 'Python', level: 'intermediate' },
      { id: 'sk2', name: 'Machine Learning', level: 'intermediate' },
      { id: 'sk3', name: 'Git', level: 'advanced' },
      { id: 'sk4', name: 'SQL', level: 'intermediate' },
      { id: 'sk5', name: 'React', level: 'beginner' },
    ],
  }
}