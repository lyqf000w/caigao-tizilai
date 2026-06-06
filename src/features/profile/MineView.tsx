import { questionBank } from '../../data/questionBank'
import { formatDate } from '../../lib/practiceEngine'
import type { PracticeSession } from '../../types/practice'

type MineViewProps = {
  sessions: PracticeSession[]
  favorites: string[]
  onReplay: (session: PracticeSession) => void
  onGenerate: () => void
}

export function MineView({ sessions, favorites, onReplay, onGenerate }: MineViewProps) {
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
