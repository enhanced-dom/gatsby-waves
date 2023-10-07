import React from 'react'
import { InputStep, Step } from 'code-surfer-types'

import { parseSteps } from '../step-parser'
import { Styled } from '../themes'
import { UnknownError } from './errors'
import { CodeSurfer } from './code-surfer'
import './default-syntaxes'

export type ParsedSteps = {
  steps: Step[]
  tokens: string[][]
  types: string[][]
  maxLineCount: number
  showNumbers?: boolean
}

type CodeSurferProps = {
  steps?: InputStep[]
  parsedSteps?: ParsedSteps
  progress: number
  nonblocking?: boolean
}

function CodeSurferWrapper({ nonblocking, progress, steps: inputSteps, parsedSteps }: CodeSurferProps) {
  const [wait, setWait] = React.useState(nonblocking)

  React.useEffect(() => {
    if (!wait) return
    setWait(false)
  }, [])

  const { steps, tokens, types, maxLineCount, showNumbers } = React.useMemo(() => {
    if (wait) {
      return {
        tokens: [],
        types: [],
        steps: [],
      }
    }
    if (parsedSteps) return parsedSteps
    return parseSteps(inputSteps!)
  }, [inputSteps, parsedSteps])

  if ((!wait && !steps) || steps.length === 0) {
    throw new Error('No steps')
  }

  return wait ? (
    <Styled.Placeholder />
  ) : (
    <CodeSurfer progress={progress} steps={steps} tokens={tokens} types={types} maxLineCount={maxLineCount!} showNumbers={showNumbers} />
  )
}

export { CodeSurferWrapper as CodeSurfer, UnknownError }
