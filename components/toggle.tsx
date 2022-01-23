import React, { FC, MouseEventHandler } from 'react'
import Icons, { IconOnOffProps, IconProps } from '../components/icons'

type ToggleProps = {
  description: string // use a unique description
  disabled ?: boolean
  Icon: FC<IconProps>
  pressed?: boolean
  className?: string
  size?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const IconToggle : FC<ToggleProps> = ({
  description,
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
    aria-pressed={pressed}
    aria-label={description}
    className={[
      'rounded p-2 outline-none focus:ring-primary-4 focus:ring-def focus:drop-shadow-def',
      className
    ].join(' ')}
    onClick={onClick || null}>
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

export const Toggle : FC<OnOffProps> = ({
  description,
  disabled = false,
  className = '',
  pressed = false,
  onClick,
  size,
  Icon
}) => (
  <button
    role="switch"
    aria-pressed={pressed}
    aria-label={description}
    disabled={disabled}
    className={[
      'rounded p-2 outline-none focus:ring-primary-4 focus:ring-def focus:drop-shadow-def ',
      className
    ].join(' ')}
    onClick={onClick || null}>
    <Icon on={!pressed} size={size} className='active:scale-75' />
  </button>
)
