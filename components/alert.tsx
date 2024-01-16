import React, { FC, ReactNode } from 'react'
import { Clear } from './icons'
import Button from './button'
export type AlertKind = 'info' | 'success' | 'warning' | 'error'
export type AlertProps = {
  children: ReactNode
  kind?: AlertKind
  className?: string
  onClose?: () => void
}
const classes: Record<AlertKind, string> = {
  info: 'bg-info-1 border-info-con text-info-con focus:ring-info-con',
  success: 'bg-success-1 border-success-con text-success-con focus:ring-success-con',
  warning: 'bg-warning-1 border-warning-con text-warning-con focus:ring-warning-con',
  error: 'bg-error-1 border-error-2 text-error-con ring-error-con focus:ring-error-con'
}
const hoverClasses: Record<AlertKind, string> = {
  info: 'hover:bg-info-2 hover:text-info-con',
  success: 'hover:bg-success-2 hover:text-success-con',
  warning: 'hover:bg-warning-2 hover:text-warning-con',
  error: 'hover:bg-error-2 hover:text-error-con'
}

export const Alert: FC<AlertProps> = ({
  children,
  kind = 'error',
  onClose,
  className = ''
}) => (
  <div
    role={onClose ? 'alertdialog' : 'alert'} // if user is expected to close it, then use alertdialog
    aria-live={kind === 'error' ? 'assertive' : 'polite'}
    className={[
      'p-2 flex flex-row rounded border ',
      classes[kind],
      className
    ].join(' ')}
  >
    <div className="flex-grow p-2">{children}</div>
    {onClose
      ? (
        <Button
          kind="none"
          className={['flex-shrink', classes[kind], hoverClasses[kind]].join(' ')}
          onClick={onClose}
        >
          <Clear />
        </Button>
      )
      : null}
  </div>
)
type ErrorDisplayProps = {
  pre: string
  errors: Array<string | Error | ErrorEvent>
  clearErrors?: () => void
}
export const ErrorDisplay: FC<ErrorDisplayProps> = ({
  pre,
  errors,
  clearErrors
}: ErrorDisplayProps) =>
  errors && errors.length >= 1
    ? (
      <div
        className="flex flex-row bg-error-2 border border-error-con text-error-con p-1 rounded place-items-start"
        role="alert"
      >
        <div className="flex-grow flex flex-col gap-1">
          {errors.map((err, idx) => (
            <Alert key={pre + idx} className=' '>{String(err)}</Alert>
          ))}
        </div>

        {clearErrors
          ? (
            <button
              onClick={clearErrors}
              className="flex-shrink p-2 m-1 bg-error-2 hover:bg-error-1 rounded"
            >
              <Clear />
            </button>
          )
          : null}
      </div>
    )
    : null
