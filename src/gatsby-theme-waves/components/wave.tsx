import React from 'react'
// @ts-ignore
import { useSpring } from 'use-spring'
import { useThemeUI } from 'theme-ui'

function getProgress(scroller: HTMLElement, focusPoint: number) {
  const children = scroller.children
  const middle = window.innerHeight * focusPoint
  let prevBottom = children[0].getBoundingClientRect().bottom
  for (let i = 1; i < children.length; i++) {
    const { top, bottom } = children[i].getBoundingClientRect()
    const breakpoint = (prevBottom + top) / 2
    if (middle < breakpoint) {
      return i - 1
    }
    prevBottom = bottom
  }
  return children.length - 1
}

function useFocusPoint(variant: string) {
  if (typeof window === 'undefined') return 0
  //TODO keep focus point in ref and update on window resize
  const { theme } = useThemeUI()
  const focus: [number, number] = theme.styles.waves[variant].focus || [0.7, 0.5]
  //TODO find out how to get default breakpoints from theme-ui
  const breakpoint = theme.breakpoints ? theme.breakpoints[0] : '40em'
  const mql = window.matchMedia(`(min-width: ${breakpoint})`)
  return mql.matches ? focus[1] : focus[0]
}

function useCurrentStep(ref: React.MutableRefObject<HTMLElement>, variant: string) {
  const [progress, setProgress] = React.useState(0)
  const focusPoint = useFocusPoint(variant)

  React.useEffect(() => {
    const scroller = ref.current.querySelector('.scroller') as HTMLElement
    function onScroll() {
      const newProgress = getProgress(scroller, focusPoint)
      setProgress(newProgress)
    }
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return progress
}

const Wave: React.FunctionComponent<{
  children: React.ReactNode[]
  variant?: string
  columnComponents: React.ComponentType<any>[]
  childrenToStepColumns: (children: React.ReactNode[]) => [React.ReactNode[], React.ReactNode[]]
}> = ({ children, variant = 'default', columnComponents = [], childrenToStepColumns }) => {
  const ref = React.useRef()
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
        //TODO rename currentStep to currentStepIndex
        return <Component key={columnIndex} steps={columnSteps} progress={progress} variant={variant} currentStep={currentStep} />
      })}
    </div>
  ) as any
}

export default Wave
