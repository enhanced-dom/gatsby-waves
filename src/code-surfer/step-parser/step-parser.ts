import { applyPatch } from 'diff'

import { linesDiff } from './differ'
import { tokenize } from './tokenizer'
import { parseFocus, getFocusSize } from './focus-parser'
import { toEntries } from './object-entries'

type InputStep = {
  code: string
  focus?: string
  lang?: string
  title?: string
  subtitle?: string
  showNumbers?: boolean
}

export function parseSteps(inputSteps: InputStep[]) {
  const [firstStep] = inputSteps
  if (!firstStep) {
    return {
      tokens: [],
      types: [],
      steps: [],
    }
  }

  const { lang, showNumbers = false } = firstStep

  if (!lang) {
    throw new Error('Missing code language')
  }

  const codeList = getCodeList(inputSteps)

  const { lineIds, steps } = linesDiff(codeList)
  const allTokens: string[][] = []
  const allTypes: string[][] = []
  const allSteps: {
    lines: number[]
    focus: Record<number, true | number[]>
    focusCenter: number
    focusCount: number
    longestLineIndex: number
    title?: string
    subtitle?: string
  }[] = []

  steps.forEach((step, i) => {
    const code = codeList[i] ?? ''
    const inputStep = inputSteps[i]
    const { tokens, types } = tokenize(code, lang)
    const lineKeys: number[] = []
    step.forEach((lineId, lineIndex) => {
      const lineKey = lineIds.indexOf(lineId)
      allTokens[lineKey] = tokens[lineIndex] ?? []
      allTypes[lineKey] = types[lineIndex] ?? []
      lineKeys.push(lineKey)
    })

    const focusString = inputStep?.focus
    const prevLineKeys = allSteps[i - 1]?.lines ?? []
    const focus = focusString ? parseFocus(focusString) : getDefaultFocus(prevLineKeys, lineKeys)
    const { focusCenter, focusCount } = getFocusSize(focus)
    allSteps.push({
      lines: lineKeys,
      focus,
      focusCenter,
      focusCount,
      longestLineIndex: getLongestLineIndex(code),
      title: inputStep?.title,
      subtitle: inputStep?.subtitle,
    })
  })

  // split tokens into columns when needed
  allSteps.forEach(({ lines, focus }) => {
    toEntries(focus).forEach(([lineIndex, lineFocus]) => {
      if (Array.isArray(lineFocus)) {
        const lineKey = lines[lineIndex]
        if (lineKey === undefined) {
          return
        }
        const lineTypes = allTypes[lineKey] ?? []
        const lineTokens = allTokens[lineKey] ?? []
        const [newTypes, newTokens] = splitIntoColumns(lineTypes, lineTokens)
        allTypes[lineKey] = newTypes
        allTokens[lineKey] = newTokens
      }
    })
  })

  // add empty char to empty lines
  allTokens.forEach((line, lineKey) => {
    if (line.length === 0) {
      line.push(`\u200B`)
      allTypes[lineKey]?.push('plain')
    }
  })

  // get the line count from the step with more lines
  const maxLineCount = allSteps.reduce((max, step) => (step.lines.length > max ? step.lines.length : max), 0)

  return {
    tokens: allTokens,
    types: allTypes,
    steps: allSteps,
    maxLineCount,
    showNumbers,
  }
}

function getCodeList(inputSteps: Pick<InputStep, 'code' | 'lang'>[]) {
  const firstLang = inputSteps[0]?.lang
  if (firstLang === 'diff') {
    return inputSteps.map((s) => s.code)
  }

  let prevCode = ''
  return inputSteps.map(({ code, lang }) => {
    const stepCode = lang === 'diff' ? applyPatch(prevCode, code) : code
    if (stepCode === false) {
      throw new Error('Could not apply diff patch to previous step code')
    }
    prevCode = stepCode
    return stepCode
  })
}

function splitIntoColumns(types: string[], tokens: string[]): [string[], string[]] {
  const newTypes: string[] = []
  const newTokens: string[] = []
  tokens.forEach((token, i) => {
    const tokenType = types[i] ?? 'plain'
    Array.from(token).forEach((char) => {
      newTokens.push(char)
      newTypes.push(tokenType)
    })
  })
  return [newTypes, newTokens]
}

function getDefaultFocus(prevLineKeys: number[], lineKeys: number[]) {
  const focus = {} as Record<number, true>
  lineKeys.forEach((lineKey, lineIndex) => {
    if (!prevLineKeys.includes(lineKey)) {
      focus[lineIndex] = true
    }
  })

  if (Object.keys(focus).length === 0) {
    lineKeys.forEach((_, lineIndex) => {
      focus[lineIndex] = true
    })
  }

  return focus
}

function getLongestLineIndex(code: string) {
  const newlineRe = /\r\n|\r|\n/
  const lines = code.split(newlineRe)

  let longest = 0
  lines.forEach((line, i) => {
    if ((lines[longest]?.length ?? 0) < line.length) {
      longest = i
    }
  })

  return longest
}
