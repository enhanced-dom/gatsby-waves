import React, { useMemo } from 'react'

import { CodeSurfer as CodeStickerSteps } from '../code-surfer/standalone'
import { readStepFromElement } from '../gatsby-theme-waves/stuff/step-reader'

const isCode = (e?: React.ReactElement) => e?.type === 'pre'

const getParsedCodeStepsSlice = (steps: React.ReactElement[], curr: React.ReactElement) => {
  const stepsSlice = [curr]
  const currentStepIndex = steps.indexOf(curr)
  for (const step of steps.slice(currentStepIndex + 1, steps.length)) {
    if (!isCode(step)) {
      break
    }
    stepsSlice.push(step)
  }
  for (const step of steps.slice(0, Math.max(currentStepIndex - 1, 0)).reverse()) {
    if (!isCode(step)) {
      break
    }
    stepsSlice.unshift(step)
  }
  const parsedStepsSlice = stepsSlice.map((element) => {
    const parsedStep = readStepFromElement(element)
    return { ...parsedStep, absoluteProgress: steps.indexOf(element) }
  })
  return parsedStepsSlice
}

const OpacityStickerStep = ({
  variant = 'default',
  visible,
  children,
}: React.PropsWithChildren<{ variant?: string; visible?: boolean }>) => {
  if (!children) {
    return null
  }

  return (
    <div
      sx={{
        variant: `styles.waves.${variant}.StickerStep`,
      }}
      style={{ opacity: visible ? 1 : 0, position: visible ? undefined : 'absolute' }}
    >
      {children}
    </div>
  )
}

export const Sticker = ({
  progress = 0,
  steps,
  variant = 'default',
}: {
  progress: number
  steps: React.ReactElement[]
  variant?: string
}) => {
  const currentIndex = Math.round(progress)
  let prevIndex = currentIndex - 1
  let prevStep = steps[currentIndex - 1]
  const currStep = steps[currentIndex]
  let nextIndex = currentIndex + 1
  let nexStep = steps[currentIndex + 1]

  const currentCodeStepsSlice = useMemo(() => (isCode(currStep) ? getParsedCodeStepsSlice(steps, currStep) : undefined), [currStep, steps])

  if (currentCodeStepsSlice) {
    prevIndex = currentCodeStepsSlice[0].absoluteProgress - 1
    prevStep = prevIndex < 0 ? undefined : steps[prevIndex]

    nextIndex = currentCodeStepsSlice[currentCodeStepsSlice.length - 1].absoluteProgress + 1
    nexStep = nextIndex > steps.length + 1 ? undefined : steps[nextIndex]
  }

  return (
    <div
      sx={{
        variant: `styles.waves.${variant}.StickerContainer`,
      }}
    >
      <OpacityStickerStep key={prevIndex} variant={variant}>
        {prevStep}
      </OpacityStickerStep>
      {isCode(currStep) ? (
        <OpacityStickerStep key={`${currentIndex}-${currentIndex + currentCodeStepsSlice.length}`} variant={variant} visible>
          <CodeStickerSteps
            key={currentIndex}
            progress={currentCodeStepsSlice.indexOf(currentCodeStepsSlice.find((c) => c.absoluteProgress === currentIndex))}
            steps={currentCodeStepsSlice}
          />
        </OpacityStickerStep>
      ) : (
        <OpacityStickerStep key={currentIndex} variant={variant} visible>
          {currStep}
        </OpacityStickerStep>
      )}
      <OpacityStickerStep key={nextIndex} variant={variant}>
        {nexStep}
      </OpacityStickerStep>
    </div>
  )
}
