import React from 'react'

type UnknownErrorProps = {
  error: { toString: () => string }
}

export function UnknownError({ error }: UnknownErrorProps) {
  // TODO link to create issue
  return <ErrorBox header="Oops, there's a problem" body={error.toString()} />
}

export function grammarNotFound({ lang }: { lang: string }) {
  return {
    element: (
      <ErrorBox
        header="Oops, there's a problem"
        body={
          <React.Fragment>
            Syntax highlighter for <Mark>"{lang}"</Mark> not found.
            <p>
              You can try importing it from prismjs with: <br />
              <Mark>import "prismjs/components/prism-{lang}"</Mark>
            </p>
            (See{' '}
            <a href="https://prismjs.com/#supported-languages" style={{ color: 'grey' }}>
              all the supported languages
            </a>
            )
          </React.Fragment>
        }
      />
    ),
  }
}

export function invalidFocusNumber(n: string) {
  return {
    withFocusString: (focusString: string) => ({
      withStepIndex: (stepIndex: number) => ({
        element: (
          <ErrorBox
            header={<StepErrorHeader stepIndex={stepIndex} />}
            body={
              <React.Fragment>
                <Mark>"{n}"</Mark> isn't a valid number {n != focusString && <Mark> (in "{focusString}")</Mark>}
              </React.Fragment>
            }
          />
        ),
      }),
    }),
  }
}

export function invalidLineOrColumnNumber() {
  return {
    withFocusString: (focusString: string) => ({
      withStepIndex: (stepIndex: number) => ({
        element: (
          <ErrorBox
            header={<StepErrorHeader stepIndex={stepIndex} />}
            body={
              <React.Fragment>
                Are you using "0" as a line or column number <Mark>in "{focusString}"</Mark>?
                <br />
                (Line and column numbers should start at 1, not 0) <br />
              </React.Fragment>
            }
          />
        ),
      }),
    }),
  }
}

type ErrorBoxProps = {
  header: React.ReactNode
  body: React.ReactNode
}

function ErrorBox({ header, body }: ErrorBoxProps) {
  return (
    <div
      style={{
        background: '#290000',
        color: '#b96f70',
        border: '2px solid #b96f70',
        padding: '10px 30px',
        maxWidth: '90vw',
        margin: '0 auto',
        fontFamily: 'monospace',
        fontSize: '1rem',
      }}
    >
      <h3>{header}</h3>
      <p>{body}</p>
    </div>
  )
}

function StepErrorHeader({ stepIndex }: { stepIndex: number }) {
  return (
    <React.Fragment>
      Oops, there's a problem with the{' '}
      <Mark>
        {stepIndex + 1}
        <sup>{ordinal(stepIndex + 1)}</sup> step
      </Mark>
    </React.Fragment>
  )
}

function Mark({ children }: { children: React.ReactNode }) {
  return <mark style={{ background: 'none', color: 'pink', fontWeight: 'bolder' }}>{children}</mark>
}

function ordinal(i: number) {
  const j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return 'st'
  }
  if (j == 2 && k != 12) {
    return 'nd'
  }
  if (j == 3 && k != 13) {
    return 'rd'
  }
  return 'th'
}
