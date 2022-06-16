import React from 'react'


function Scroller({ steps, progress, variant }: { steps: React.ReactNode[]; progress: number; variant: string }) {
  return (
    <div
      sx={{
        variant: `styles.waves.${variant}.ScrollerContainer`,
      }}
      className="scroller"
    >
      {steps.map((step, i) => (
        <div
          style={{
            opacity: Math.max(0.1, 1 - Math.abs(i - progress)),
          }}
          sx={{
            variant: `styles.waves.${variant}.ScrollerStep`,
          }}
          key={i}
        >
          {step}
        </div>
      ))}
    </div>
  )
}

export default Scroller
