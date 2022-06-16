import React from 'react'

export const Sticker = ({ progress = 0, steps, variant = 'default' }: { progress: number; steps: any[]; variant?: string }) => {
  const currentStep = Math.round(progress)
  const prev = steps[currentStep - 1]
  const curr = steps[currentStep]
  const next = steps[currentStep + 1]

  return (
    <div
      sx={{
        variant: `styles.waves.${variant}.StickerContainer`,
      }}
    >
      <div sx={{ variant: `styles.waves.${variant}.Sticker` }}>
        {prev && (
          <div
            sx={{
              variant: `styles.waves.${variant}.StickerStep`,
            }}
            style={{ opacity: Math.max(0, currentStep - progress) }}
            key={currentStep - 1}
          >
            {prev}
          </div>
        )}
        <div
          sx={{
            variant: `styles.waves.${variant}.StickerStep`,
          }}
          style={{ opacity: 1 - Math.abs(currentStep - progress) }}
          key={currentStep}
        >
          {curr}
        </div>
        {next && (
          <div
            sx={{
              variant: `styles.waves.${variant}.StickerStep`,
            }}
            style={{ opacity: Math.max(0, progress - currentStep) }}
            key={currentStep + 1}
          >
            {next}
          </div>
        )}
      </div>
    </div>
  )
}
