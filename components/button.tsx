import React, { MouseEventHandler, ReactNode } from 'react'
import { baseRingClass } from './utils'

export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonKind = 'plain' | 'outline' | 'round' | 'group' | 'none'

export type ButtonProps = {
  disabled?: boolean
  type?: ButtonType
  kind?: ButtonKind
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement | HTMLButtonElement>
  label?: string
  children?: ReactNode
}

const getBorderClass = (kind: ButtonKind) => kind === 'group'
  ? baseRingClass + ' border-1 border-r last:border-none flex-1'
  : baseRingClass + ' border-1 '

const getRoundedClass = (kind: ButtonKind) => kind === 'round'
  ? ' rounded-full '
  : kind !== 'group'
    ? ' rounded '
    : ' first:rounded-l last:rounded-r '

// we forward the ref so that we can call button.current.focus in <Modal />
// among other things
const Button = React.forwardRef(({
  disabled = false,
  type = 'button',
  kind = 'plain',
  className = 'bg-primary-con text-primary-1 hover:bg-primary-1 hover:text-primary-con ',
  onClick = undefined,
  label,
  children
}: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) =>
(
  <button
    ref={ref}
    aria-label={label}
    disabled={disabled}
    type={type}
    className={[
      getBorderClass(kind),
      getRoundedClass(kind),
      className
    ].join(' ')}
    onClick={onClick}
  ><div className="flex items-center justify-center p-2 active:scale-90 transition-transform">{children || label}</div></button >
))
Button.displayName = "Button"

export type ButtonGroupProps = {
  className?: string
  children?: React.ReactElement<ButtonProps>[]
}

export const ButtonGroup = ({
  className = '',
  children
}: ButtonGroupProps) =>
(
  <div className={"flex flex-row w-auto border border-1 rounded-md " + className}>{children}</div>
)


export default Button
