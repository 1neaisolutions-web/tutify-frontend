import { useEffect, useState } from 'react'

type ConfettiBurstProps = {
  active: boolean
  onComplete?: () => void
}

const COLORS = ['#0ea5e9', '#f97316', '#22c55e', '#eab308', '#a855f7', '#ec4899']

const ConfettiBurst = ({ active, onComplete }: ConfettiBurstProps) => {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    if (!active) return
    setPieces(
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
      })),
    )
    const timer = window.setTimeout(() => {
      setPieces([])
      onComplete?.()
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [active, onComplete])

  if (!pieces.length) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-0 block h-2.5 w-1.5 rounded-sm opacity-90"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          animation: confetti-fall 1.6s ease-in forwards;
        }
      `}</style>
    </div>
  )
}

export default ConfettiBurst
