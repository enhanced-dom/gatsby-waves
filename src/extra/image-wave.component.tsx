import React from 'react'

import { Wave, BarScroller } from '../gatsby-theme-waves'
import { Sticker } from './sticker.component'

const toColumns = (items: React.ReactElement[]) => {
  const columns = Array(2)
    .fill(null)
    .map(() => [])

  items.forEach((item) => {
    const isImg = item.type === 'img'
    if (isImg) {
      const img = React.cloneElement(item, {
        style: { objectFit: 'contain', margin: 0, maxWidth: '100%', maxHeight: '100%' },
      })
      columns[0].push(img)
      columns[1].push(React.createElement('div', {}, []))
    } else {
      const step = columns[0].length - 1
      columns[1][step].props.children.push(item)
    }
  })

  return columns as [React.ReactElement[], React.ReactElement[]]
}

export const ImageWave = (props: Omit<React.ComponentProps<typeof Wave>, 'columnComponents' | 'childrenToStepColumns'>) => {
  return <Wave columnComponents={[Sticker, BarScroller]} childrenToStepColumns={toColumns} {...props} />
}
