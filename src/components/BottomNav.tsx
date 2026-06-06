import { Check, Home, Plus, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Tab } from '../types/practice'

type BottomNavProps = {
  activeTab: Tab
  hasActiveSession: boolean
  onNavigate: (tab: Tab) => void
}

export function BottomNav({ activeTab, hasActiveSession, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主要导航">
      <NavButton active={activeTab === 'home'} label="首页" icon={<Home size={17} />} onClick={() => onNavigate('home')} />
      <NavButton
        active={activeTab === 'generate'}
        label="生成"
        icon={<Plus size={18} />}
        onClick={() => onNavigate('generate')}
      />
      <NavButton
        active={activeTab === 'practice'}
        label="练习"
        icon={<Check size={18} />}
        onClick={() => onNavigate(hasActiveSession ? 'practice' : 'generate')}
      />
      <NavButton
        active={activeTab === 'mine'}
        label="我的"
        icon={<UserRound size={17} />}
        onClick={() => onNavigate('mine')}
      />
    </nav>
  )
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
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
