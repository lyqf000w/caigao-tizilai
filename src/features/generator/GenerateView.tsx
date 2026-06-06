import { Field } from '../../components/Field'
import { difficulties, generateSteps, questionTypes, topicOptions } from '../../data/practiceOptions'
import type { GeneratorForm } from '../../types/practice'

type GenerateViewProps = {
  form: GeneratorForm
  isGenerating: boolean
  stepIndex: number
  onChange: (value: GeneratorForm) => void
  onStart: () => void
}

export function GenerateView({ form, isGenerating, stepIndex, onChange, onStart }: GenerateViewProps) {
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
