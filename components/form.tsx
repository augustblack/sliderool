import React, { FC, ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { ErrorDisplay, Button, ButtonGroup } from './index'
import { baseRingClass, Colors } from './utils'

const isNil = (v: unknown) => v === null || v === undefined

type Options = {
  f: string
  l: ReactNode
}

type RadioProps = {
  state: Record<string, unknown>
  className?: string
  field: string
  options: Array<Options>
  label: ReactNode
  validated: boolean
  update: (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Radio: FC<RadioProps> = ({
  state,
  field,
  className = '',
  options,
  validated,
  label,
  update
}: RadioProps) => (
  <React.Fragment>
    <div className='font-bold mr-2 grid-flow-col sm:text-right' >{label}</div>
    <div className='p-2 w-full'>
      {options.map((o, idx) => (
        <div key={field + idx} className={idx !== (options.length - 1) ? 'pb-2' : ''}>
          <input
            className={'pr-4 ' + className + ' ' + (validated ? '' : ' bg-error-1 text-error-con')}
            id={o.f}
            name={field}
            type='radio'
            value={o.f}
            checked={state[field] === o.f}
            onChange={update(field)}
          />
          <label
            className={'p-2 pr-4' + (validated ? '' : ' text-error-con')}
            htmlFor={o.f}>{o.l}</label>
        </div>
      ))
      }
    </div>
  </React.Fragment>
)

type Item = {
  field: string
  init?: string
  label: ReactNode
  type?: string
  options?: Array<Options>
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  args?: Record<string, string>
}

type InputProps = Item & {
  state: Record<string, unknown>
  className?: string
  validated: boolean
  update: (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({
  state,
  className = '',
  field,
  validated,
  options = [],
  label,
  update,
  placeholder = '',
  disabled = false,
  hidden = false,
  type = 'text',
  args
}: InputProps) => type === 'radio'
    ? (<Radio state={state} field={field} label={label} options={options} update={update} validated={validated} className={className} />)
    : (
      <>
        <label
          className={
            baseRingClass +
            'block font-bold mr-2 sm:text-right' +
            (hidden ? ' hidden ' : ' ')
          }
          htmlFor={field}
        >{label}</label>
        <input
          className={
            baseRingClass +
            'p-2 w-full rounded transition-colors border ' + (hidden ? ' hidden' : '') +
            (validated ? className : ' bg-error-1 border-error-con focus:ring-error-con placeholder:text-error-con/50  ')
          }
          name={field}
          placeholder={placeholder}
          type={type}
          value={String(state[field]) || ''}
          onChange={update(field)}
          disabled={disabled}
          {...args}
        />
      </>
    )

const getInitState = (items: Array<Item>) => items && items.length
  ? items.reduce((acc, v) => Object.assign(acc, { [v.field]: v.init }), {})
  : {}

const getInitValidated = (items: Array<Item>): Record<string, boolean> => items && items.length
  ? items.reduce((acc, v) => Object.assign(acc, { [v.field]: true }), {})
  : {}

const allValidated = (validated: Record<string, boolean>) => isNil(Object.values(validated).find(v => v !== true))

type FormItem = Item & {
  verify?: (v: string) => Promise<unknown>
}
type FormProps = {
  name: string
  timeout?: number
  className?: string
  colors?: Colors
  items: Array<FormItem>
  onSubmit: ((state: Record<string, unknown>) => void) | ((state: Record<string, unknown>) => Promise<void>)
  onAction?: string
  afterSubmit?: ((state: Record<string, unknown>) => void) | (() => void)
  onCancel: () => void
}

export const Form: FC<FormProps> = ({
  name,
  items,
  colors = {
    track: "accent-base-con bg-base-1 text-base-con border-1 border-base-con ",
    thumb: "accent-base-1 bg-base-con text-base-1 border-1 border-base-1 "
  },
  onSubmit,
  afterSubmit,
  onAction,
  onCancel,
  timeout = 300
}: FormProps) => {
  const [state, setState] = useState<Record<string, string>>(getInitState(items))
  const [error, setError] = useState<Array<Error>>([])
  const [validated, setValidated] = useState(getInitValidated(items))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMounted = useRef(true)
  const isDisabled = useCallback(() => !allValidated(validated), [validated])
  const setErrorSafe = (e: Error) => {
    console.log('FORM ERROR:', e)
    return isMounted.current
      ? setError([e])
      : null
  }
  const clearError = () => isMounted.current ? setError([]) : null

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(Object.assign({}, state, { [field]: e.target.value }))
  }

  useEffect(() => {
    setState(s => items && items.length
      ? items.reduce((acc, v) => Object.assign({}, acc, acc.hasOwnProperty(v.field) ? { [v.field]: acc[v.field] } : { [v.field]: v.init }), s)
      : {}
    )
  }, [items])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const to = setTimeout(() => {
      Promise.all(items.map(i => i && i.verify
        ? i.verify(state[i.field])
          .then(() => ({ field: i.field, verified: true }))
          .catch(() => ({ field: i.field, verified: false }))
        : i.type === 'radio'
          ? Promise.resolve({ field: i.field, verified: state[i.field] || false })
          : Promise.resolve({ field: i.field, verified: true })
      ))
        .then(vals => vals
          .reduce((acc, v) => Object.assign(acc, { [v.field]: v.verified }), {})
        )
        .then(v => isMounted.current
          ? setValidated(v)
          : null
        )
        .catch(setErrorSafe)
    }, timeout)
    return () => {
      clearTimeout(to)
    }
  }, [state, items, timeout])

  const validate = () => Promise.all(items.map(i => i && i.verify
    ? i.verify(state[i.field])
    : Promise.resolve()
  ))

  const onSubmitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    validate()
      .then(() => isMounted.current && onSubmit
        ? onSubmit(state)
        : null
      )
      .then(() => setTimeout(() => isMounted.current
        ? setIsSubmitting(false)
        : null
        , 500))
      .then(() => setTimeout(() => isMounted.current && afterSubmit
        ? afterSubmit(state)
        : null
        , 500))
      .catch(setErrorSafe)
      .finally(() => setTimeout(() => {
        return isMounted.current
          ? setIsSubmitting(false)
          : null
      }, 500))
  }
  return (
    <div className="space-y-2 w-full">
      <ErrorDisplay pre={name} errors={error} clearErrors={clearError} />
      <form
        className={'rounded w-full items-middle items-center p-1 text-base lg:text-lg sm:grid sm:grid-cols-2 gap-4 space-y-2 sm:space-y-0 '}
        style={{ gridTemplateColumns: 'max-content auto' }}
        onSubmit={onSubmitEvent}
        action={onAction || undefined}
        method='post'
      >
        {items.map(i => (
          <Input
            className={colors.track}
            state={state}
            update={update}
            key={i.field}
            validated={validated[i.field]}
            field={i.field}
            label={i.label}
            options={i.options}
            type={i.type}
            placeholder={i.placeholder}
            disabled={i.disabled}
            hidden={i.hidden}
            args={i.args}
          />))
        }
        <div />
        <ButtonGroup className={'mt-2 ' + colors.thumb}>
          <Button
            kind='group'
            disabled={isDisabled() || isSubmitting}
            className={
              baseRingClass +
              (isDisabled() ? 'bg-error-1 text-error-con cursor-not-allowed' : colors.thumb)
            }
            label={isSubmitting ? 'submitting...' : 'submit'}
            type='submit'
          />
          <Button
            kind='group'
            label='cancel'
            onClick={onCancel}
            className={
              baseRingClass +
              colors.track
            }
          />
        </ButtonGroup>
      </form>
    </div>
  )
}
