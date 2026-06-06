import { Metric } from '../../components/Metric'
import type { PracticeStats } from '../../types/practice'

type HomeViewProps = {
  stats: PracticeStats
  onGenerate: () => void
  onPractice: () => void
  onPreset: (topic: string) => void
}

export function HomeView({ stats, onGenerate, onPractice, onPreset }: HomeViewProps) {
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
