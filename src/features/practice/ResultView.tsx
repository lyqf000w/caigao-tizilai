import type { PracticeSession } from '../../types/practice'

type ResultViewProps = {
  session: PracticeSession
  onAgain: () => void
  onMine: () => void
}

export function ResultView({ session, onAgain, onMine }: ResultViewProps) {
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
