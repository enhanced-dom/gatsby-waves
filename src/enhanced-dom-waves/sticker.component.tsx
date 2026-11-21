import { isValidElement, useMemo, type ReactElement, type ReactNode, type PropsWithChildren } from 'react'

import type { WaveColumnProps } from '../gatsby-theme-waves'
import { CodeSurfer as CodeStickerSteps } from '../code-surfer/standalone'
import { readStepFromElement } from '../gatsby-theme-waves/stuff/step-reader'

const isCode = (e: ReactNode): e is ReactElement => isValidElement(e) && e.type === 'pre'

const getParsedCodeStepsSlice = (steps: ReactNode[], curr: ReactElement) => {
  const stepsSlice = [curr]
  const currentStepIndex = steps.indexOf(curr)
  for (const step of steps.slice(currentStepIndex + 1, steps.length)) {
    if (!isCode(step)) {
      break
    }
    stepsSlice.push(step)
  }
  for (const step of steps.slice(0, currentStepIndex).reverse()) {
    if (!isCode(step)) {
      break
    }
    stepsSlice.unshift(step)
  }
  return stepsSlice.flatMap((element) => {
    const parsedStep = readStepFromElement(element)
    return parsedStep ? [{ ...parsedStep, absoluteProgress: steps.indexOf(element) }] : []
  })
}

const OpacityStickerStep = ({ variant = 'default', visible, children }: PropsWithChildren<{ variant?: string; visible?: boolean }>) => {
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
}: Pick<WaveColumnProps, 'progress' | 'steps'> & Partial<Pick<WaveColumnProps, 'variant'>>) => {
  const currentIndex = Math.round(progress)
  let prevIndex = currentIndex - 1
  let prevStep = steps[currentIndex - 1]
  const currStep = steps[currentIndex]
  let nextIndex = currentIndex + 1
  let nexStep = steps[currentIndex + 1]

  const currentCodeStepsSlice = useMemo(() => (isCode(currStep) ? getParsedCodeStepsSlice(steps, currStep) : undefined), [currStep, steps])

  const firstCodeStep = currentCodeStepsSlice?.[0]
  const lastCodeStep = currentCodeStepsSlice?.at(-1)
  if (firstCodeStep && lastCodeStep) {
    prevIndex = firstCodeStep.absoluteProgress - 1
    prevStep = prevIndex < 0 ? undefined : steps[prevIndex]

    nextIndex = lastCodeStep.absoluteProgress + 1
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
      {currentCodeStepsSlice ? (
        <OpacityStickerStep key={`${currentIndex}-${currentIndex + currentCodeStepsSlice.length}`} variant={variant} visible>
          <CodeStickerSteps
            key={currentIndex}
            progress={currentCodeStepsSlice.findIndex((c) => c.absoluteProgress === currentIndex)}
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
