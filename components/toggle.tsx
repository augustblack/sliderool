import React, { FC, MouseEventHandler } from 'react'
import Icons, { IconOnOffProps, IconProps } from './icons'
import { Colors, baseRingClass } from './utils'

const baseToggleClass = 'rounded p-2 transition-transform '

type ToggleProps = {
  label: string // use a unique description
  disabled?: boolean
  Icon: FC<IconProps>
  pressed?: boolean
  className?: string
  size?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const IconToggle: FC<ToggleProps> = ({
  label,
  disabled = false,
  className = '',
  pressed = false,
  onClick,
  size,
  Icon
}) => (
  <button
    disabled={disabled}
    role="switch"
    aria-checked={pressed}
    aria-label={label}
    className={baseToggleClass + baseRingClass + className}
    onClick={onClick}>
    <div className='relative active:scale-75'>
      <Icon size={size} className={pressed ? 'scale-75' : ''} />
      {
        pressed
          ? <Icons.DoNotDisturb size={size} className='absolute left-0 top-0 scale-150 text-red-900 opacity-50' />
          : null
      }
    </div>

  </button>
)

type OnOffProps = ToggleProps & {
  Icon: FC<IconOnOffProps>
}

export const Toggle: FC<OnOffProps> = ({
  label,
  disabled = false,
  className = '',
  pressed = false,
  onClick,
  size,
  Icon
}) => (
  <button
    role="switch"
    aria-checked={pressed}
    aria-label={label}
    disabled={disabled}
    className={baseToggleClass + baseRingClass + className}
    onClick={onClick}>
    <Icon on={!pressed} size={size} className='active:scale-75' />
  </button>
)

type SwitchProps = {
  label: string // use a unique description
  disabled?: boolean
  pressed?: boolean
  className?: string
  colors?: Colors
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Switch: FC<SwitchProps> = ({
  label,
  disabled = false,
  className = '',
  pressed = false,
  colors = { track: 'bg-primary-2', thumb: 'bg-primary-con' },
  onClick
}) => (
  <button
    role="switch"
    aria-checked={pressed}
    aria-label={label}
    disabled={disabled}
    className={[
      'w-20 h-10 rounded-full p-1 flex transition-colors ',
      baseRingClass,
      pressed ? ('justify-end ' + colors.track) : ('justify-start ' + colors.thumb),
      className
    ].join(' ')}
    onClick={onClick}>
    <div className={'w-8 h-8 rounded-full transition-colors ' + (pressed ? colors.thumb : colors.track)} />
  </button>
)
