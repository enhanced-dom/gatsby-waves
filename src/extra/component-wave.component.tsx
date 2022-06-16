import React from 'react'

import { Wave, BarScroller } from '../gatsby-theme-waves'
import { Sticker } from './sticker.component'

const ComponentWaveSlot = ({ children }) => {
  return children || null
}

const toColumns = (items: React.ReactElement[]) => {
  const columns = Array(2)
    .fill(null)
    .map(() => [])

  items.forEach((item) => {
    const isComponentSlot = item.type && typeof item.type === typeof ComponentWaveSlot
    if (isComponentSlot) {
      columns[0].push(item)
      columns[1].push(React.createElement('div', {}, []))
    } else {
      const step = columns[0].length - 1
      columns[1][step].props.children.push(item)
    }
  })

  return columns as [React.ReactElement[], React.ReactElement[]]
}

export const ComponentWave = (props: Omit<React.ComponentProps<typeof Wave>, 'columnComponents' | 'childrenToStepColumns'>) => {
  return <Wave columnComponents={[Sticker, BarScroller]} childrenToStepColumns={toColumns} {...props} />
}

ComponentWave.Slot = ComponentWaveSlot
