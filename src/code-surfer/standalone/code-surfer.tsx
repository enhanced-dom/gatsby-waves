///<reference path="./types.d.ts" />
import React from 'react'
import type { Step } from 'code-surfer-types'

import useDimensions from './dimensions'
import Frame from './frame'

type CodeSurferProps = {
  steps: Step[]
  progress: number // float between [0, steps.lenght - 1]
  tokens: string[][]
  types: string[][]
  maxLineCount: number
  showNumbers?: boolean
}

export function CodeSurfer({ progress, steps, tokens, types, maxLineCount, showNumbers = false }: CodeSurferProps) {
  const fakeSteps = React.useMemo(() => getFakeSteps(steps, tokens), [steps])

  const ref = React.useRef<HTMLDivElement>(null)
  const { dimensions, steps: stepsWithDimensions } = useDimensions(ref, steps)
  if (!dimensions || !stepsWithDimensions) {
    return (
      <div ref={ref} style={{ overflow: 'auto', height: '100%', width: '100%' }}>
        {fakeSteps.map((_step, i) => (
          <div
            key={i}
            style={{
              overflow: 'auto',
              height: '100%',
              width: '100%',
            }}
          >
            <Frame steps={fakeSteps} progress={i} tokens={tokens} types={types} maxLineCount={maxLineCount} showNumbers={showNumbers} />
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div style={{ height: '100%', width: '100%', overflow: 'auto' }} ref={ref}>
        <Frame
          steps={stepsWithDimensions}
          progress={progress}
          dimensions={dimensions}
          tokens={tokens}
          types={types}
          maxLineCount={maxLineCount}
          showNumbers={showNumbers}
        />
      </div>
    )
  }
}

function getFakeSteps(parsedSteps: Step[], tokens: string[][]) {
  let shortLineKey = 0
  let length = 100
  for (let i = 1; i < tokens.length; i++) {
    const lineLength = tokens[i]?.length ?? length
    if (lineLength < length) {
      length = lineLength
      shortLineKey = i
    }
    if (length <= 1) {
      break
    }
  }

  return parsedSteps.map((step, i) => {
    if (i === 0) {
      return step
    }
    const fakeStep: Step = {
      ...step,
      lines: step.lines.map((_) => shortLineKey),
      longestLineIndex: 0,
    }
    fakeStep.lines[0] = step.lines[step.longestLineIndex] ?? shortLineKey
    return fakeStep
  })
}
