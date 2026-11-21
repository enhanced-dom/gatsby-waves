import { cloneElement, createElement, isValidElement, type ReactNode, type ComponentProps, type PropsWithChildren } from 'react'

import { Wave, BarScroller } from '../gatsby-theme-waves'
import { Sticker } from './sticker.component'

enum StickerElementType {
  IMAGE = 'img',
  CODE = 'pre',
  RAW = 'raw',
}

const ComponentWaveSlot = ({ children }: PropsWithChildren) => {
  return children || null
}

const isStickerElementType = (type: unknown): type is StickerElementType => Object.values<unknown>(StickerElementType).includes(type)

const toStickerStep = (item: ReactNode): ReactNode | undefined => {
  if (!isValidElement<PropsWithChildren<{ style?: object }>>(item) || !isStickerElementType(item.type)) {
    return undefined
  }
  switch (item.type) {
    case StickerElementType.RAW:
      return item.props.children ?? null
    case StickerElementType.IMAGE:
      return cloneElement(item, {
        style: { objectFit: 'contain', margin: 0, maxWidth: '100%', maxHeight: '100%' },
      })
    case StickerElementType.CODE:
      return item
  }
}

// Each sticker element (image/code/raw) starts a step; the items that follow it become that step's text.
// Text items appearing before the first sticker element are dropped.
const toColumns = (items: ReactNode[]): [ReactNode[], ReactNode[]] => {
  const stickerSteps: ReactNode[] = []
  const textSteps: ReactNode[][] = []

  items.forEach((item) => {
    const stickerStep = toStickerStep(item)
    if (stickerStep !== undefined) {
      stickerSteps.push(stickerStep)
      textSteps.push([])
    } else {
      textSteps.at(-1)?.push(item)
    }
  })

  return [stickerSteps, textSteps.map((textItems, stepIndex) => createElement('div', { key: stepIndex }, ...textItems))]
}

export const MultiWave = (props: Omit<ComponentProps<typeof Wave>, 'columnComponents' | 'childrenToStepColumns'>) => {
  return <Wave columnComponents={[Sticker, BarScroller]} childrenToStepColumns={toColumns} {...props} />
}

MultiWave.ComponentSlot = ComponentWaveSlot
