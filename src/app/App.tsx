import { useEffect, useMemo, useRef, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { BrandHeader } from '../components/BrandHeader'
import { defaultGeneratorForm, generateSteps } from '../data/practiceOptions'
import { GenerateView } from '../features/generator/GenerateView'
import { HomeView } from '../features/home/HomeView'
import { MineView } from '../features/profile/MineView'
import { PracticeView } from '../features/practice/PracticeView'
import { calculateStats, completeSession, createSession } from '../lib/practiceEngine'
import { persistFavorites, persistSessions, readFavorites, readSessions } from '../lib/storage'
import type { GeneratorForm, PracticeSession, Tab } from '../types/practice'
import '../styles/app.css'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessions, setSessions] = useState<PracticeSession[]>(() => readSessions())
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [generator, setGenerator] = useState<GeneratorForm>(defaultGeneratorForm)
  const [isGenerating, setIsGenerating] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [resultSession, setResultSession] = useState<PracticeSession | null>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    persistSessions(sessions)
  }, [sessions])

  useEffect(() => {
    persistFavorites(favorites)
  }, [favorites])

  useEffect(() => {
    screenRef.current?.scrollTo({ top: 0 })
  }, [tab, questionIndex, currentSession?.id, resultSession?.id])

  useEffect(() => {
    if (!isGenerating) return

    const timers = generateSteps.map((_, index) => window.setTimeout(() => setStepIndex(index), index * 620))
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

  const stats = useMemo(() => calculateStats(sessions), [sessions])
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

    const finalSession = completeSession(currentSession)
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

  function startGenerating() {
    setStepIndex(0)
    setIsGenerating(true)
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="才高题自来移动端演示">
        <BrandHeader onNavigate={setTab} />

        <div className="screen" ref={screenRef}>
          {tab === 'home' && (
            <HomeView
              stats={stats}
              onGenerate={() => setTab('generate')}
              onPractice={() => {
                setTab(currentSession ? 'practice' : 'generate')
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
              onStart={startGenerating}
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

        <BottomNav activeTab={tab} hasActiveSession={Boolean(currentSession)} onNavigate={setTab} />
      </section>
    </main>
  )
}
