import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Home, Plus, Star, UserRound } from 'lucide-react'
import './App.css'

type Tab = 'home' | 'generate' | 'practice' | 'mine'
type Difficulty = '入门' | '进阶' | '面试冲刺'
type QuestionType = 'single' | 'open' | 'scenario' | 'mixed'

type Question = {
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

type PracticeSession = {
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

type GeneratorForm = {
  topic: string
  customTopic: string
  difficulty: Difficulty
  questionType: QuestionType
  count: number
}

const STORAGE_KEY = 'cgttl_sessions_v1'
const FAVORITE_KEY = 'cgttl_favorites_v1'

const topicOptions = ['AI 提示词工程师', '前端开发', '产品经理', '运营面试', '自定义方向']
const difficulties: Difficulty[] = ['入门', '进阶', '面试冲刺']
const questionTypes: { label: string; value: QuestionType }[] = [
  { label: '混合题', value: 'mixed' },
  { label: '单选题', value: 'single' },
  { label: '问答题', value: 'open' },
  { label: '场景题', value: 'scenario' },
]

const generateSteps = [
  '识别训练目标和岗位能力',
  '匹配题型、难度和评分标签',
  '生成题干、解析和追问问题',
  '整理成可练习的移动端题单',
]

const questionBank: Question[] = [
  {
    id: 'prompt-1',
    topic: 'AI 提示词工程师',
    difficulty: '入门',
    type: 'single',
    title: '下面哪一项最能体现一个高质量 Prompt 的基本结构？',
    options: ['只写一句简短命令', '角色、任务、上下文、约束、输出格式', '尽量使用复杂术语', '要求模型自由发挥'],
    answer: '角色、任务、上下文、约束、输出格式',
    keywords: ['角色', '任务', '上下文', '约束', '格式'],
    explanation: '高质量 Prompt 通常需要明确模型身份、任务目标、背景信息、边界条件和输出格式。',
    hint: '想想怎样减少模型误解。',
    tags: ['Prompt 结构化', '需求表达'],
    followUp: '如果用户只说“帮我写个方案”，你会补问哪些信息？',
  },
  {
    id: 'prompt-2',
    topic: 'AI 提示词工程师',
    difficulty: '进阶',
    type: 'open',
    title: '用户要求“帮我写一个爆款小红书文案”，你会如何设计追问，才能让 AI 输出更稳定？',
    keywords: ['目标人群', '产品', '语气', '平台', '卖点', '禁忌', '格式'],
    explanation: '优秀回答应先澄清目标人群、产品信息、传播目的、语气、结构、限制和评估标准。',
    hint: '不要直接写文案，先把需求补完整。',
    tags: ['需求澄清', 'Prompt 结构化', '结果评估'],
    followUp: '如果用户拒绝补充信息，你如何给出默认假设并标注风险？',
  },
  {
    id: 'prompt-3',
    topic: 'AI 提示词工程师',
    difficulty: '面试冲刺',
    type: 'scenario',
    title: '业务方反馈“模型输出太虚”，你作为提示词工程师会怎样定位和优化？',
    keywords: ['样例', '约束', '评价标准', '迭代', '上下文', '输出格式', '测试集'],
    explanation: '需要从输入信息、Prompt 结构、示例质量、输出格式、评价标准和迭代测试几个层面定位。',
    hint: '面试场景里要讲方法论，而不是只说“把 Prompt 写详细”。',
    tags: ['问题诊断', '迭代优化', '结果评估'],
    followUp: '请设计一个小型测试集，用来判断优化是否真的有效。',
  },
  {
    id: 'prompt-4',
    topic: 'AI 提示词工程师',
    difficulty: '面试冲刺',
    type: 'single',
    title: '当用户要求模型生成可能侵犯隐私的内容时，最合适的处理方式是？',
    options: ['直接生成，满足用户', '拒绝所有相关请求', '说明边界，提供安全替代方案', '把责任转给用户'],
    answer: '说明边界，提供安全替代方案',
    keywords: ['边界', '安全', '替代方案'],
    explanation: '提示词工程师需要理解安全边界，在拒绝不当请求的同时尽量提供合规替代方案。',
    hint: '既要守边界，也要解决用户真实需求。',
    tags: ['安全边界', '用户意图'],
    followUp: '请给出一段既礼貌又有帮助的拒绝话术。',
  },
  {
    id: 'prompt-5',
    topic: 'AI 提示词工程师',
    difficulty: '进阶',
    type: 'scenario',
    title: '请为“生成 10 道产品经理面试题”设计一个可复用 Prompt 模板。',
    keywords: ['变量', '岗位', '难度', '题型', '数量', '输出格式', '评分标准'],
    explanation: '模板应包含可替换变量，并约束题型、数量、难度、输出结构和评分维度。',
    hint: '重点是可复用，而不是只写一次性指令。',
    tags: ['模板设计', 'Prompt 结构化'],
    followUp: '这个模板如果要用于前端页面，哪些字段应该做成表单？',
  },
  {
    id: 'prompt-6',
    topic: 'AI 提示词工程师',
    difficulty: '入门',
    type: 'open',
    title: '请解释“给 AI 示例”为什么能提升输出质量。',
    keywords: ['few-shot', '示例', '格式', '风格', '边界', '参照'],
    explanation: '示例能帮助模型理解期望格式、语气、粒度和边界，降低输出不稳定性。',
    hint: '可以从格式、风格、标准三个角度回答。',
    tags: ['示例学习', '输出控制'],
    followUp: '什么时候示例反而会带来误导？',
  },
  {
    id: 'front-1',
    topic: '前端开发',
    difficulty: '入门',
    type: 'single',
    title: '移动端按钮推荐的最小可点击高度通常不应低于？',
    options: ['20px', '28px', '44px', '80px'],
    answer: '44px',
    keywords: ['44px', '点击面积'],
    explanation: '移动端需要保证足够点击面积，44px 是常见的可用性参考值。',
    hint: '想想手指点击，而不是鼠标点击。',
    tags: ['移动端适配', '交互可用性'],
    followUp: '如果页面空间很紧，你会如何兼顾信息密度和点击面积？',
  },
  {
    id: 'front-2',
    topic: '前端开发',
    difficulty: '进阶',
    type: 'scenario',
    title: 'H5 页面在 iPhone 底部被系统安全区遮挡，你会如何处理？',
    keywords: ['safe-area', 'env', 'padding', 'viewport', '底部导航'],
    explanation: '可使用 safe-area-inset-bottom、合理的底部 padding 和固定导航高度避免遮挡。',
    hint: '关注底部导航和主按钮。',
    tags: ['移动端适配', 'CSS'],
    followUp: '请说明如何在 Android 和 iOS 上验证这个问题。',
  },
  {
    id: 'pm-1',
    topic: '产品经理',
    difficulty: '进阶',
    type: 'open',
    title: '如果一款刷题工具留存下降，你会从哪些维度分析？',
    keywords: ['用户路径', '题目质量', '反馈', '激励', '数据', '分层'],
    explanation: '应从用户分层、题目匹配度、练习反馈、激励机制、使用场景和数据漏斗分析。',
    hint: '不要只说多做活动，先定位留存下降发生在哪里。',
    tags: ['产品分析', '数据思维'],
    followUp: '你会优先看哪三个指标？为什么？',
  },
  {
    id: 'ops-1',
    topic: '运营面试',
    difficulty: '入门',
    type: 'single',
    title: '活动复盘中最不应该只关注哪一项？',
    options: ['曝光', '转化', '成本', '主观感觉'],
    answer: '主观感觉',
    keywords: ['数据', '复盘'],
    explanation: '运营复盘应关注目标、数据、成本、转化和可复用经验，不能只凭主观感觉。',
    hint: '复盘要能指导下一次动作。',
    tags: ['运营复盘', '数据意识'],
    followUp: '请设计一个活动复盘模板。',
  },
]

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as PracticeSession[]
  } catch {
    return []
  }
}

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]') as string[]
  } catch {
    return []
  }
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function scoreQuestion(question: Question, value = '') {
  if (!value.trim()) return 0

  if (question.type === 'single') {
    return value === question.answer ? 100 : 0
  }

  const normalized = value.toLowerCase()
  const keywordHits = question.keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  ).length
  const keywordScore = Math.min(75, Math.round((keywordHits / question.keywords.length) * 75))
  const lengthScore = Math.min(25, Math.floor(value.trim().length / 10))

  return Math.min(100, keywordScore + lengthScore)
}

function buildAdvice(session: PracticeSession) {
  const questionScores = session.questions.map((question) => ({
    question,
    score: scoreQuestion(question, session.answers[question.id]),
  }))
  const weakTags = unique(
    questionScores
      .filter((item) => item.score < 70)
      .flatMap((item) => item.question.tags),
  ).slice(0, 4)

  const advice =
    weakTags.length > 0
      ? weakTags.map((tag) => `围绕「${tag}」再练 3 道场景题，并要求自己给出结构化步骤。`)
      : ['本轮表现稳定，下一组可以提高难度，并加入追问模式练习表达深度。']

  return { weakTags, advice }
}

function createSession(form: GeneratorForm): PracticeSession {
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessions, setSessions] = useState<PracticeSession[]>(() => readSessions())
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [generator, setGenerator] = useState<GeneratorForm>({
    topic: 'AI 提示词工程师',
    customTopic: '',
    difficulty: '面试冲刺',
    questionType: 'mixed',
    count: 5,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [resultSession, setResultSession] = useState<PracticeSession | null>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    screenRef.current?.scrollTo({ top: 0 })
  }, [tab, questionIndex, currentSession?.id, resultSession?.id])

  useEffect(() => {
    if (!isGenerating) return

    const timers = generateSteps.map((_, index) =>
      window.setTimeout(() => setStepIndex(index), index * 620),
    )
    const doneTimer = window.setTimeout(() => {
      const session = createSession(generator)
      setCurrentSession(session)
      setQuestionIndex(0)
      setShowHint(false)
      setResultSession(null)
      setIsGenerating(false)
      setTab('practice')
    }, generateSteps.length * 620 + 280)

    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(doneTimer)
    }
  }, [generator, isGenerating])

  const stats = useMemo(() => {
    const completed = sessions.filter((session) => session.completedAt)
    const practiced = completed.reduce((sum, session) => sum + session.questions.length, 0)
    const average = completed.length
      ? Math.round(completed.reduce((sum, session) => sum + (session.score || 0), 0) / completed.length)
      : 0
    const mistakes = completed.reduce((sum, session) => {
      return (
        sum +
        session.questions.filter((question) => scoreQuestion(question, session.answers[question.id]) < 70).length
      )
    }, 0)

    return { completed: completed.length, practiced, average, mistakes }
  }, [sessions])

  const activeQuestion = currentSession?.questions[questionIndex]

  function updateAnswer(questionId: string, answer: string) {
    if (!currentSession) return
    setCurrentSession({
      ...currentSession,
      answers: {
        ...currentSession.answers,
        [questionId]: answer,
      },
    })
  }

  function finishPractice() {
    if (!currentSession) return
    const scores = currentSession.questions.map((question) =>
      scoreQuestion(question, currentSession.answers[question.id]),
    )
    const score = Math.round(scores.reduce((sum, item) => sum + item, 0) / scores.length)
    const completedSession = {
      ...currentSession,
      score,
      completedAt: new Date().toISOString(),
    }
    const review = buildAdvice(completedSession)
    const finalSession = { ...completedSession, ...review }
    setSessions((prev) => [finalSession, ...prev].slice(0, 20))
    setResultSession(finalSession)
  }

  function toggleFavorite(questionId: string) {
    setFavorites((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  function startFromSession(session: PracticeSession) {
    setCurrentSession({ ...session, answers: {}, score: undefined, completedAt: undefined })
    setQuestionIndex(0)
    setResultSession(null)
    setShowHint(false)
    setTab('practice')
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="才高题自来移动端演示">
        <header className="topbar">
          <button className="brand" type="button" onClick={() => setTab('home')}>
            <span className="brand-mark">才</span>
            <span>
              <strong>才高题自来</strong>
              <small>AI 面试题训练</small>
            </span>
          </button>
          <span className="status-pill">H5 Demo</span>
        </header>

        <div className="screen" ref={screenRef}>
          {tab === 'home' && (
            <HomeView
              stats={stats}
              onGenerate={() => setTab('generate')}
              onPractice={() => {
                if (currentSession) setTab('practice')
                else setTab('generate')
              }}
              onPreset={(topic) => {
                setGenerator((prev) => ({ ...prev, topic }))
                setTab('generate')
              }}
            />
          )}

          {tab === 'generate' && (
            <GenerateView
              form={generator}
              isGenerating={isGenerating}
              stepIndex={stepIndex}
              onChange={setGenerator}
              onStart={() => {
                setStepIndex(0)
                setIsGenerating(true)
              }}
            />
          )}

          {tab === 'practice' && (
            <PracticeView
              session={currentSession}
              question={activeQuestion}
              questionIndex={questionIndex}
              showHint={showHint}
              favorites={favorites}
              resultSession={resultSession}
              onAnswer={updateAnswer}
              onPrev={() => {
                setQuestionIndex((prev) => Math.max(0, prev - 1))
                setShowHint(false)
              }}
              onNext={() => {
                if (!currentSession) return
                if (questionIndex === currentSession.questions.length - 1) {
                  finishPractice()
                } else {
                  setQuestionIndex((prev) => prev + 1)
                  setShowHint(false)
                }
              }}
              onHint={() => setShowHint((prev) => !prev)}
              onFavorite={toggleFavorite}
              onGenerate={() => setTab('generate')}
              onMine={() => setTab('mine')}
            />
          )}

          {tab === 'mine' && (
            <MineView
              sessions={sessions}
              favorites={favorites}
              onReplay={startFromSession}
              onGenerate={() => setTab('generate')}
            />
          )}
        </div>

        <nav className="bottom-nav" aria-label="主要导航">
          <NavButton active={tab === 'home'} label="首页" icon={<Home size={17} />} onClick={() => setTab('home')} />
          <NavButton active={tab === 'generate'} label="生成" icon={<Plus size={18} />} onClick={() => setTab('generate')} />
          <NavButton
            active={tab === 'practice'}
            label="练习"
            icon={<Check size={18} />}
            onClick={() => (currentSession ? setTab('practice') : setTab('generate'))}
          />
          <NavButton active={tab === 'mine'} label="我的" icon={<UserRound size={17} />} onClick={() => setTab('mine')} />
        </nav>
      </section>
    </main>
  )
}

function HomeView({
  stats,
  onGenerate,
  onPractice,
  onPreset,
}: {
  stats: { completed: number; practiced: number; average: number; mistakes: number }
  onGenerate: () => void
  onPractice: () => void
  onPreset: (topic: string) => void
}) {
  return (
    <div className="view stack">
      <section className="hero-panel">
        <p className="eyebrow">AI Prompt Interview Trainer</p>
        <h1>输入目标，题目自来。</h1>
        <p className="hero-copy">
          为求职者生成岗位题单、模拟追问、评分复盘，把面试准备从“刷题”变成“有方向地训练”。
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={onGenerate}>
            生成题单
          </button>
          <button className="ghost-button" type="button" onClick={onPractice}>
            继续练习
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="练习概览">
        <Metric label="完成练习" value={`${stats.completed} 轮`} />
        <Metric label="累计题数" value={`${stats.practiced} 题`} />
        <Metric label="平均得分" value={`${stats.average || '--'} 分`} />
        <Metric label="待复习" value={`${stats.mistakes} 题`} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>推荐训练</span>
          <small>适合本次 HR 演示</small>
        </div>
        <div className="training-list">
          {['AI 提示词工程师', '前端开发', '产品经理'].map((topic) => (
            <button className="training-row" key={topic} type="button" onClick={() => onPreset(topic)}>
              <span>
                <strong>{topic}</strong>
                <small>{topic === 'AI 提示词工程师' ? '场景题、追问、评分建议' : '岗位基础题与面试题'}</small>
              </span>
              <b>开始</b>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function GenerateView({
  form,
  isGenerating,
  stepIndex,
  onChange,
  onStart,
}: {
  form: GeneratorForm
  isGenerating: boolean
  stepIndex: number
  onChange: (value: GeneratorForm) => void
  onStart: () => void
}) {
  return (
    <div className="view stack">
      <section className="page-title">
        <p className="eyebrow">AI 出题台</p>
        <h2>把模糊目标变成可练题单</h2>
      </section>

      <section className="form-panel">
        <Field label="训练方向">
          <div className="chip-grid">
            {topicOptions.map((topic) => (
              <button
                className={form.topic === topic ? 'chip active' : 'chip'}
                key={topic}
                type="button"
                onClick={() => onChange({ ...form, topic })}
              >
                {topic}
              </button>
            ))}
          </div>
        </Field>

        {form.topic === '自定义方向' && (
          <Field label="自定义目标">
            <input
              className="text-input"
              value={form.customTopic}
              placeholder="例如：新媒体运营面试"
              onChange={(event) => onChange({ ...form, customTopic: event.target.value })}
            />
          </Field>
        )}

        <Field label="难度">
          <div className="segmented">
            {difficulties.map((difficulty) => (
              <button
                className={form.difficulty === difficulty ? 'active' : ''}
                key={difficulty}
                type="button"
                onClick={() => onChange({ ...form, difficulty })}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </Field>

        <Field label="题型">
          <div className="chip-grid two">
            {questionTypes.map((item) => (
              <button
                className={form.questionType === item.value ? 'chip active' : 'chip'}
                key={item.value}
                type="button"
                onClick={() => onChange({ ...form, questionType: item.value })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label={`题目数量：${form.count} 题`}>
          <input
            className="range"
            type="range"
            min="3"
            max="6"
            value={form.count}
            onChange={(event) => onChange({ ...form, count: Number(event.target.value) })}
          />
        </Field>
      </section>

      {isGenerating && (
        <section className="ai-process" aria-label="AI 生成过程">
          {generateSteps.map((step, index) => (
            <div className={index <= stepIndex ? 'process-step done' : 'process-step'} key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </section>
      )}

      <button className="sticky-action" type="button" disabled={isGenerating} onClick={onStart}>
        {isGenerating ? 'AI 正在生成...' : '生成专属题单'}
      </button>
    </div>
  )
}

function PracticeView({
  session,
  question,
  questionIndex,
  showHint,
  favorites,
  resultSession,
  onAnswer,
  onPrev,
  onNext,
  onHint,
  onFavorite,
  onGenerate,
  onMine,
}: {
  session: PracticeSession | null
  question?: Question
  questionIndex: number
  showHint: boolean
  favorites: string[]
  resultSession: PracticeSession | null
  onAnswer: (questionId: string, answer: string) => void
  onPrev: () => void
  onNext: () => void
  onHint: () => void
  onFavorite: (questionId: string) => void
  onGenerate: () => void
  onMine: () => void
}) {
  if (!session || !question) {
    return (
      <div className="empty-state">
        <p className="eyebrow">暂无题单</p>
        <h2>先生成一组适合你的题目</h2>
        <button className="primary-button" type="button" onClick={onGenerate}>
          去生成
        </button>
      </div>
    )
  }

  if (resultSession) {
    return <ResultView session={resultSession} onAgain={onGenerate} onMine={onMine} />
  }

  const currentAnswer = session.answers[question.id] || ''
  const progress = Math.round(((questionIndex + 1) / session.questions.length) * 100)

  return (
    <div className="view practice-view">
      <section className="practice-head">
        <div>
          <p className="eyebrow">{session.topic}</p>
          <h2>
            第 {questionIndex + 1} / {session.questions.length} 题
          </h2>
        </div>
        <button
          className={favorites.includes(question.id) ? 'icon-button active' : 'icon-button'}
          type="button"
          title="收藏题目"
          onClick={() => onFavorite(question.id)}
        >
          <Star size={21} fill={favorites.includes(question.id) ? 'currentColor' : 'none'} />
        </button>
      </section>

      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="question-card">
        <div className="question-meta">
          <span>{question.type === 'single' ? '单选题' : question.type === 'open' ? '问答题' : '场景题'}</span>
          <span>{question.difficulty}</span>
        </div>
        <h3>{question.title}</h3>

        {question.type === 'single' && (
          <div className="option-list">
            {question.options?.map((option) => (
              <button
                className={currentAnswer === option ? 'option active' : 'option'}
                key={option}
                type="button"
                onClick={() => onAnswer(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type !== 'single' && (
          <textarea
            className="answer-box"
            value={currentAnswer}
            placeholder="写下你的回答。建议按：判断 → 步骤 → 风险 → 结果评估 来组织。"
            onChange={(event) => onAnswer(question.id, event.target.value)}
          />
        )}

        {showHint && (
          <aside className="hint-box">
            <strong>提示</strong>
            <p>{question.hint}</p>
          </aside>
        )}
      </section>

      <section className="tag-row">
        {question.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </section>

      <div className="practice-actions">
        <button className="ghost-button" type="button" onClick={onPrev} disabled={questionIndex === 0}>
          上一题
        </button>
        <button className="ghost-button" type="button" onClick={onHint}>
          {showHint ? '收起提示' : '查看提示'}
        </button>
        <button className="primary-button" type="button" onClick={onNext} disabled={!currentAnswer.trim()}>
          {questionIndex === session.questions.length - 1 ? '完成复盘' : '下一题'}
        </button>
      </div>
    </div>
  )
}

function ResultView({
  session,
  onAgain,
  onMine,
}: {
  session: PracticeSession
  onAgain: () => void
  onMine: () => void
}) {
  const score = session.score || 0
  const summary = score >= 85 ? '表达稳定，可以进入追问训练。' : score >= 70 ? '基础不错，建议补足结构和案例。' : '建议先强化答题框架。'

  return (
    <div className="view stack result-view">
      <section className="score-panel">
        <p className="eyebrow">AI 复盘报告</p>
        <div className="score-ring">
          <strong>{score}</strong>
          <span>分</span>
        </div>
        <h2>{summary}</h2>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>薄弱能力</span>
          <small>{session.weakTags?.length ? '根据本轮回答生成' : '本轮暂无明显短板'}</small>
        </div>
        <div className="tag-row spacious">
          {(session.weakTags?.length ? session.weakTags : ['提高难度', '追问表达']).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>下一步建议</span>
          <small>模拟 AI 教练</small>
        </div>
        <div className="advice-list">
          {session.advice?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>追问样例</span>
          <small>用于面试冲刺</small>
        </div>
        <p className="follow-up">{session.questions[0]?.followUp}</p>
      </section>

      <div className="hero-actions">
        <button className="primary-button" type="button" onClick={onAgain}>
          再来一组
        </button>
        <button className="ghost-button" type="button" onClick={onMine}>
          查看记录
        </button>
      </div>
    </div>
  )
}

function MineView({
  sessions,
  favorites,
  onReplay,
  onGenerate,
}: {
  sessions: PracticeSession[]
  favorites: string[]
  onReplay: (session: PracticeSession) => void
  onGenerate: () => void
}) {
  const favoriteQuestions = questionBank.filter((question) => favorites.includes(question.id))

  return (
    <div className="view stack">
      <section className="page-title">
        <p className="eyebrow">我的训练</p>
        <h2>历史记录与错题沉淀</h2>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>练习记录</span>
          <small>{sessions.length} 轮</small>
        </div>
        {sessions.length === 0 ? (
          <div className="soft-empty">
            <p>还没有完成练习。先生成一组题单，系统会自动保存记录。</p>
            <button className="ghost-button" type="button" onClick={onGenerate}>
              去生成
            </button>
          </div>
        ) : (
          <div className="history-list">
            {sessions.map((session) => (
              <button className="history-card" key={session.id} type="button" onClick={() => onReplay(session)}>
                <span>
                  <strong>{session.topic}</strong>
                  <small>
                    {formatDate(session.createdAt)} · {session.questions.length} 题 · {session.difficulty}
                  </small>
                </span>
                <b>{session.score}分</b>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span>收藏题</span>
          <small>{favoriteQuestions.length} 题</small>
        </div>
        <div className="favorite-list">
          {favoriteQuestions.length === 0 ? (
            <p className="muted">练习时点击星标，可以把高价值题目放到这里。</p>
          ) : (
            favoriteQuestions.map((question) => (
              <article className="favorite-card" key={question.id}>
                <strong>{question.title}</strong>
                <p>{question.explanation}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button className={active ? 'nav-button active' : 'nav-button'} type="button" onClick={onClick}>
      <span>{icon}</span>
      {label}
    </button>
  )
}

export default App
