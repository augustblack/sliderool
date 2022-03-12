import React, { MouseEventHandler, MutableRefObject, ReactNode } from 'react'

export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonKind = 'plain' | 'outline' | 'round' | 'group' | 'none'

export type ButtonProps = {
  show ?: boolean
  disabled ?: boolean
  type?: ButtonType
  kind?: ButtonKind
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  label ?: string
  children ?: ReactNode
}

const getColorClass = (kind: ButtonKind) => kind === 'plain'
  ? 'bg-primary-1 hover:bg-primary-2 text-write-1 border border-primary-1 text-primary-4 '
  : kind === 'outline' || kind === 'round'
    ? 'hover:bg-primary-1 bg-base-2 text-primary-3 border border-primary-3 hover:border-primary-4'
    : 'hover:bg-base-1' // for icons, use none and carry color in from container

const getBorderClass = (kind: ButtonKind) => kind === 'plain'
  ? 'border border-primary-1 text-primary-4'
  : kind === 'outline'
    ? 'border border-primary-3 hover:border-primary-4'
    : ''

const getRoundedClass = (kind: ButtonKind) => kind === 'round'
  ? 'rounded-full'
  : kind !== 'group'
    ? 'rounded-md'
    : ''

const Button = React.forwardRef(({
  show = true,
  disabled = false,
  type = 'button',
  kind = 'none',
  className = '',
  onClick,
  label,
  children
}: ButtonProps, ref: MutableRefObject<HTMLButtonElement>) => show
  ? (
    <button
      ref={ref}
      disabled={disabled}
      aria-label={label}
      type={type}
      className={[
        'active:scale-90 p-2 outline-none focus:ring-primary-4 focus:ring-def focus:drop-shadow-def flex items-center justify-center',
        getColorClass(kind),
        getBorderClass(kind),
        getRoundedClass(kind),
        className
      ].join(' ')}
      onClick={onClick || null}>{children || label}</button>
    )
  : null
)
Button.displayName = 'Button'

export default Button
