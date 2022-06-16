import React from 'react'

import BarScroller from './bar-scroller'
import CodeSticker from './code-sticker'
import Wave from './wave'

/**
 *
 * There are two ways to use <CodeWave> in MDX:
 *
 *
 * <CodeWave>
 *
 * ```js 1:2
 * // some code
 * ```
 *
 * ## some
 *
 * ## markdown
 *
 * ```js
 * // more code
 * ```
 *
 * - more
 * - markdown
 *
 * </CodeWave>
 *
 *
 * Or, using the output of rehype-waves:
 *
 *
 * <CodeWave parsedSteps={...}>
 *
 * <div>
 *
 * ## some
 *
 * ## markdown
 *
 * </div>
 *
 * <div>
 *
 * - more
 * - markdown
 *
 * </div>
 *
 * </CodeWave>
 *
 *
 *
 */

function toColumns(items: React.ReactNode[]): [React.ReactNode[], React.ReactNode[]] {
  const columns = Array(2)
    .fill(undefined)
    .map(() => []) as [React.ReactNode[], React.DetailedReactHTMLElement<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>[]]

  items.forEach((item: React.ReactNode & { type?: string }) => {
    const isCode = item.type === 'pre'
    if (isCode) {
      columns[0].push(item)
      columns[1].push(React.createElement('div', {}, []))
    } else {
      const lastStep = columns[0].length - 1
      ;(columns[1][lastStep].props.children as React.ReactNode[]).push(item)
    }
  })

  return columns
}

function CodeWave(
  props: Omit<React.ComponentProps<typeof Wave>, 'columnComponents' | 'childrenToStepColumns'> & { parsedSteps?: boolean },
) {
  const { parsedSteps, ...rest } = props

  const childrenToColumns = (children: React.ReactNode): [React.ReactNode[], React.ReactNode[]] => {
    const kids = React.Children.toArray(children)
    if (parsedSteps) {
      return [[], React.Children.toArray(children)]
    } else {
      return toColumns(kids)
    }
  }

  return <Wave columnComponents={[CodeSticker, BarScroller]} childrenToStepColumns={childrenToColumns} {...rest} />
}

export default CodeWave
