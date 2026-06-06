export type Tab = 'home' | 'generate' | 'practice' | 'mine'

export type Difficulty = '入门' | '进阶' | '面试冲刺'

export type QuestionType = 'single' | 'open' | 'scenario' | 'mixed'

export type Question = {
  id: string
  topic: string
  difficulty: Difficulty
  type: Exclude<QuestionType, 'mixed'>
  title: string
  options?: string[]
  answer?: string
  keywords: string[]
  explanation: string
  hint: string
  tags: string[]
  followUp: string
}

export type PracticeSession = {
  id: string
  topic: string
  difficulty: Difficulty
  questionType: QuestionType
  questions: Question[]
  answers: Record<string, string>
  score?: number
  weakTags?: string[]
  advice?: string[]
  createdAt: string
  completedAt?: string
}

export type GeneratorForm = {
  topic: string
  customTopic: string
  difficulty: Difficulty
  questionType: QuestionType
  count: number
}

export type PracticeStats = {
  completed: number
  practiced: number
  average: number
  mistakes: number
}
