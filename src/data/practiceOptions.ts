import type { Difficulty, GeneratorForm, QuestionType } from '../types/practice'

export const topicOptions = ['AI 提示词工程师', '前端开发', '产品经理', '运营面试', '自定义方向']

export const difficulties: Difficulty[] = ['入门', '进阶', '面试冲刺']

export const questionTypes: { label: string; value: QuestionType }[] = [
  { label: '混合题', value: 'mixed' },
  { label: '单选题', value: 'single' },
  { label: '问答题', value: 'open' },
  { label: '场景题', value: 'scenario' },
]

export const generateSteps = [
  '识别训练目标和岗位能力',
  '匹配题型、难度和评分标签',
  '生成题干、解析和追问问题',
  '整理成可练习的移动端题单',
]

export const defaultGeneratorForm: GeneratorForm = {
  topic: 'AI 提示词工程师',
  customTopic: '',
  difficulty: '面试冲刺',
  questionType: 'mixed',
  count: 5,
}
