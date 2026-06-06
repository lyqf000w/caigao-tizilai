import type { Tab } from '../types/practice'

type BrandHeaderProps = {
  onNavigate: (tab: Tab) => void
}

export function BrandHeader({ onNavigate }: BrandHeaderProps) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => onNavigate('home')}>
        <span className="brand-mark">才</span>
        <span>
          <strong>才高题自来</strong>
          <small>AI 面试题训练</small>
        </span>
      </button>
      <span className="status-pill">H5 Demo</span>
    </header>
  )
}
