import React from 'react'
// @ts-ignore
import { useSpring } from 'use-spring'
import { useThemeUI } from 'theme-ui'

const DEFAULT_FOCUS: [number, number] = [0.7, 0.5]

function getProgress(scroller: HTMLElement, focusPoint: number) {
  const [first, ...rest] = Array.from(scroller.children)
  if (!first) {
    return 0
  }
  const middle = window.innerHeight * focusPoint
  let prevBottom = first.getBoundingClientRect().bottom
  for (const [restIndex, child] of rest.entries()) {
    const { top, bottom } = child.getBoundingClientRect()
    const breakpoint = (prevBottom + top) / 2
    if (middle < breakpoint) {
      return restIndex
    }
    prevBottom = bottom
  }
  return rest.length
}

const readProperty = (source: unknown, key: string): unknown =>
  typeof source === 'object' && source !== null ? Reflect.get(source, key) : undefined

const isFocusTuple = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number')

// theme-ui does not type custom `styles.waves.<variant>` keys, so read them defensively
function readThemeFocus(styles: unknown, variant: string) {
  const focus = readProperty(readProperty(readProperty(styles, 'waves'), variant), 'focus')
  return isFocusTuple(focus) ? focus : DEFAULT_FOCUS
}

function useFocusPoint(variant: string) {
  const { theme } = useThemeUI()
  if (typeof window === 'undefined') return 0
  //TODO keep focus point in ref and update on window resize
  const focus = readThemeFocus(theme.styles, variant)
  //TODO find out how to get default breakpoints from theme-ui
  const breakpoint = theme.breakpoints?.[0] ?? '40em'
  const mql = window.matchMedia(`(min-width: ${breakpoint})`)
  return mql.matches ? focus[1] : focus[0]
}

function useCurrentStep(ref: React.RefObject<HTMLElement>, variant: string) {
  const [progress, setProgress] = React.useState(0)
  const focusPoint = useFocusPoint(variant)

  React.useEffect(() => {
    const scroller = ref.current?.querySelector<HTMLElement>('.scroller')
    if (!scroller) {
      return
    }
    function onScroll() {
      if (scroller) {
        setProgress(getProgress(scroller, focusPoint))
      }
    }
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return progress
}

export type WaveColumnProps = {
  steps: React.ReactNode[]
  progress: number
  variant: string
  currentStep: number
}

export type WaveProps = {
  children: React.ReactNode[]
  variant?: string
  columnComponents: React.ComponentType<WaveColumnProps>[]
  childrenToStepColumns: (children: React.ReactNode[]) => React.ReactNode[][]
}

const Wave = ({ children, variant = 'default', columnComponents = [], childrenToStepColumns }: WaveProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const currentStep = useCurrentStep(ref, variant)

  const [progress] = useSpring(currentStep, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  })

  const columns = React.useMemo(() => {
    return childrenToStepColumns(children)
  }, [])

  return (
    <div ref={ref} sx={{ variant: `styles.waves.${variant}.Wave` }}>
      {columns.map((columnSteps, columnIndex) => {
        const Component = columnComponents[columnIndex]
        if (!Component) {
          return null
        }
        //TODO rename currentStep to currentStepIndex
        return <Component key={columnIndex} steps={columnSteps} progress={progress} variant={variant} currentStep={currentStep} />
      })}
    </div>
  )
}

export default Wave
