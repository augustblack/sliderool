import React, { FC, MouseEventHandler } from 'react'
import Icons, { IconOnOffProps, IconProps } from './icons'

const baseToggleClass = 'rounded p-2 outline-none focus:ring-primary-4 focus:ring-def focus:drop-shadow-def transition-transform '

type ToggleProps = {
  description: string // use a unique description
  disabled?: boolean
  Icon: FC<IconProps>
  pressed?: boolean
  className?: string
  size?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const IconToggle: FC<ToggleProps> = ({
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
    aria-checked={pressed}
    aria-label={description}
    className={[
      baseToggleClass,
      className
    ].join(' ')}
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
    aria-checked={pressed}
    aria-label={description}
    disabled={disabled}
    className={[
      baseToggleClass,
      className
    ].join(' ')}
    onClick={onClick}>
    <Icon on={!pressed} size={size} className='active:scale-75' />
  </button>
)

type FOnOffProps = OnOffProps & {
  layout?: boolean | 'position' | 'size' | 'preserve-aspect'
  layoutId?: string
}

export const FToggle: FC<FOnOffProps> = ({
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
    aria-checked={pressed}
    aria-label={description}
    disabled={disabled}
    className={[
      baseToggleClass,
      className
    ].join(' ')}
    onClick={onClick}>
    <Icon on={!pressed} size={size} className='active:scale-75' />
  </button>
)

type SwitchProps = {
  description: string // use a unique description
  disabled?: boolean
  pressed?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
}

export const Switch: FC<SwitchProps> = ({
  description,
  disabled = false,
  className = '',
  pressed = false,
  onClick
}) => (
  <button
    // layout={layout}
    // layoutId={layoutId}
    role="switch"
    aria-checked={pressed}
    aria-label={description}
    disabled={disabled}
    className={[
      'w-20 h-10 rounded-full p-1 flex transition-opacity ',
      pressed ? 'bg-info-2 justify-end' : 'bg-info-1 justify-start',
      className
    ].join(' ')}
    onClick={onClick}>
    <div className={'w-8 h-8 rounded-full bg-base-1 '} />
  </button>
)
