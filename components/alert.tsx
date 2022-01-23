import React, { FC, ReactNode } from 'react'
import { Clear } from './icons'
import Button from './button'
export type AlertKind = 'info' | 'success' | 'warning' | 'error'

export type AlertProps = {
  children: ReactNode
  kind: AlertKind
  className ?: string
  onClose ?: () => void
}
const classes: Record<AlertKind, string> = {
  info: 'bg-info-1 border-info-2 text-info-2',
  success: 'bg-success-1 border-success-2 text-success-2',
  warning: 'bg-warning-1 border-warning-2 text-warning-2',
  error: 'bg-error-1 border-error-2 text-error-2'
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
    <div className='flex-grow p-2'>
    {children}
    </div>
    {
      onClose
        ? (
          <Button kind='none' className="flex-shrink" onClick={onClose}><Clear /></Button>
          )
        : null
    }
  </div>
)
