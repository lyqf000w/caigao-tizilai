import { questionBank } from '../data/questionBank'
import type { GeneratorForm, PracticeSession, PracticeStats, Question } from '../types/practice'

export function createSession(form: GeneratorForm): PracticeSession {
  const topic = form.topic === '自定义方向' ? form.customTopic.trim() || 'AI 提示词工程师' : form.topic
  const targetPool = questionBank.filter((question) => {
    const topicMatched = question.topic === topic || topic.includes(question.topic) || question.topic.includes(topic)
    const typeMatched = form.questionType === 'mixed' || question.type === form.questionType
    return topicMatched && typeMatched
  })
  const fallbackPool = questionBank.filter(
    (question) => form.questionType === 'mixed' || question.type === form.questionType,
  )
  const pool = targetPool.length >= form.count ? targetPool : [...targetPool, ...fallbackPool]
  const deduped = unique(pool.map((question) => question.id))
    .map((id) => pool.find((question) => question.id === id))
    .filter(Boolean) as Question[]

  return {
    id: `session-${Date.now()}`,
    topic,
    difficulty: form.difficulty,
    questionType: form.questionType,
    questions: deduped.slice(0, form.count),
    answers: {},
    createdAt: new Date().toISOString(),
  }
}

export function completeSession(session: PracticeSession): PracticeSession {
  const scores = session.questions.map((question) => scoreQuestion(question, session.answers[question.id]))
  const score = Math.round(scores.reduce((sum, item) => sum + item, 0) / scores.length)
  const completedSession = {
    ...session,
    score,
    completedAt: new Date().toISOString(),
  }
  const review = buildAdvice(completedSession)

  return { ...completedSession, ...review }
}

export function calculateStats(sessions: PracticeSession[]): PracticeStats {
  const completed = sessions.filter((session) => session.completedAt)
  const practiced = completed.reduce((sum, session) => sum + session.questions.length, 0)
  const average = completed.length
    ? Math.round(completed.reduce((sum, session) => sum + (session.score || 0), 0) / completed.length)
    : 0
  const mistakes = completed.reduce((sum, session) => {
    return (
      sum + session.questions.filter((question) => scoreQuestion(question, session.answers[question.id]) < 70).length
    )
  }, 0)

  return { completed: completed.length, practiced, average, mistakes }
}

export function scoreQuestion(question: Question, value = '') {
  if (!value.trim()) return 0

  if (question.type === 'single') {
    return value === question.answer ? 100 : 0
  }

  const normalized = value.toLowerCase()
  const keywordHits = question.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length
  const keywordScore = Math.min(75, Math.round((keywordHits / question.keywords.length) * 75))
  const lengthScore = Math.min(25, Math.floor(value.trim().length / 10))

  return Math.min(100, keywordScore + lengthScore)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function buildAdvice(session: PracticeSession) {
  const questionScores = session.questions.map((question) => ({
    question,
    score: scoreQuestion(question, session.answers[question.id]),
  }))
  const weakTags = unique(
    questionScores.filter((item) => item.score < 70).flatMap((item) => item.question.tags),
  ).slice(0, 4)

  const advice =
    weakTags.length > 0
      ? weakTags.map((tag) => `围绕「${tag}」再练 3 道场景题，并要求自己给出结构化步骤。`)
      : ['本轮表现稳定，下一组可以提高难度，并加入追问模式练习表达深度。']

  return { weakTags, advice }
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}
