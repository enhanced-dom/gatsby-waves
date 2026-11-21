///<reference path="../../code-surfer/standalone/types.d.ts" />
import type { InputStep } from 'code-surfer-types'
import { parse } from 'shell-quote'

export function readStepFromElement(element: React.ReactElement): InputStep | null {
  const codeProps = element.props.children?.props
  if (!codeProps) {
    return null
  }
  const { className = '', children, metastring } = codeProps
  return {
    code: children,
    lang: className.substring('language-'.length),
    ...parseMetastring(metastring),
  }
}

function parseMetastring(metastring?: string) {
  if (!metastring) {
    return {}
  }

  const argv = parse(metastring)

  const result: Record<string, any> = {}
  argv.forEach((arg) => {
    if (!arg.includes('=')) {
      result.focus = arg
    } else {
      const [key, value] = arg.split(/=(.*)/)
      if (key) {
        result[key] = value
      }
    }
  })
  return result
}
