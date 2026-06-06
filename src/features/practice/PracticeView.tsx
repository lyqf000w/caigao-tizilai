import { Star } from 'lucide-react'
import type { PracticeSession, Question } from '../../types/practice'
import { ResultView } from './ResultView'

type PracticeViewProps = {
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
}

export function PracticeView({
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
}: PracticeViewProps) {
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
  const isFavorite = favorites.includes(question.id)

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
          className={isFavorite ? 'icon-button active' : 'icon-button'}
          type="button"
          title="收藏题目"
          onClick={() => onFavorite(question.id)}
        >
          <Star size={21} fill={isFavorite ? 'currentColor' : 'none'} />
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
