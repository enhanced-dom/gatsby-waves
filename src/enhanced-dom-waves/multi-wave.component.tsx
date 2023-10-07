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
    let processedItem: React.ReactNode = item
    const isImage = item.type === 'img'
    const isCode = item.type === 'pre'
    const isRaw = item.type === 'raw'
    if (isRaw) {
      processedItem = item.props?.children ?? null
    }
    if (isImage) {
      processedItem = React.cloneElement(item, {
        style: { objectFit: 'contain', margin: 0, maxWidth: '100%', maxHeight: '100%' },
      })
    }

    if (isImage || isCode || isRaw) {
      columns[0].push(processedItem)
      columns[1].push(React.createElement('div', {}, []))
    } else {
      const lastStep = columns[0].length - 1
      columns[1][lastStep].props.children.push(item)
    }
  })

  return columns as [React.ReactElement[], React.ReactElement[]]
}

export const MultiWave = (props: Omit<React.ComponentProps<typeof Wave>, 'columnComponents' | 'childrenToStepColumns'>) => {
  return <Wave columnComponents={[Sticker, BarScroller]} childrenToStepColumns={toColumns} {...props} />
}

MultiWave.ComponentSlot = ComponentWaveSlot
