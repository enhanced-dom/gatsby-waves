import React from 'react'

import { CodeSurfer, ParsedSteps } from '../../code-surfer/standalone'
import { readStepFromElement } from '../stuff/step-reader'

function CodeSticker({
  steps: stepElements,
  progress,
  variant,
  parsedSteps,
}: {
  steps: React.ReactElement[]
  progress: number
  variant: string
  parsedSteps: ParsedSteps
}) {
  const steps = React.useMemo(
    () =>
      parsedSteps
        ? undefined
        : stepElements.map((element) => {
            const parsedStep = readStepFromElement(element)
            return parsedStep
          }),
    [],
  )

  return (
    <div
      sx={{
        variant: `styles.waves.${variant}.StickerContainer`,
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <div sx={{ variant: `styles.waves.${variant}.Sticker` }}>
          <CodeSurfer progress={progress} steps={steps} parsedSteps={parsedSteps} />
        </div>
      </div>
    </div>
  )
}

export default CodeSticker
