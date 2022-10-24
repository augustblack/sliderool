import React, { MouseEventHandler, ForwardedRef, ReactNode } from 'react'

export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonKind = 'plain' | 'outline' | 'round' | 'group' | 'none'

export type ButtonProps = {
  show?: boolean
  disabled?: boolean
  type?: ButtonType
  kind?: ButtonKind
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  label?: string
  children?: ReactNode
}

const getColorClass = (kind: ButtonKind) => kind === 'plain'
  ? 'bg-primary-1 hover:bg-primary-2 text-write-1'
  : kind === 'outline' || kind === 'round'
    ? 'hover:bg-primary-1 bg-base-2 text-primary-3'
    : kind === 'group'
      ? 'hover:bg-primary-1'
      : '' // for icons, use none and carry color in from container

const getBorderClass = (kind: ButtonKind) => kind === 'plain'
  ? 'border border-primary-1 text-primary-4'
  : kind === 'outline' || kind === 'round'
    ? 'border border-primary-3 hover:border-primary-4'
    : kind === 'group'
      ? 'first:rounded-l last:rounded-r border-1 border-write-1 border-r last:border-none '
      : ''

const getRoundedClass = (kind: ButtonKind) => kind === 'round'
  ? 'rounded-full'
  : kind !== 'group'
    ? 'rounded-md'
    : ''
const getExtraClass = (kind: ButtonKind) => kind === 'group'
  ? 'flex-1'
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
}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => show
    ? (
      <div
        className={[
          'flex items-center justify-center ',
          getColorClass(kind),
          getBorderClass(kind),
          getRoundedClass(kind),
          getExtraClass(kind),
          className
        ].join(' ')}
        onClick={onClick || undefined}
      >
        <button
          ref={ref}
          disabled={disabled}
          aria-label={label}
          type={type}
          className='active:scale-75 p-2 outline-none focus:ring-primary-4 focus:ring-def focus:drop-shadow-def flex items-center justify-center w-full'
        >{children || label}</button></div>
    )
    : null
)
Button.displayName = 'Button'

export default Button
