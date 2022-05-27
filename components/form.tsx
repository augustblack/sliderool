import React, { FC, ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import Button from './button'
import ErrorDisplay from './alert'

const isNil = (v: unknown) => v === null || v === undefined

type Options = {
  f: string
  l: string
}

type RadioProps = {
  state: Record<string, unknown>
  field: string
  options: Array<Options>
  label: ReactNode
  update: (f:string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Radio: FC<RadioProps> = ({
  state,
  field,
  options,
  label,
  update
}: RadioProps) => (
  <React.Fragment>
    <div className='font-bold mr-2 grid-flow-col sm:text-right' >{label}</div>
    <div className='p-2 w-auto w-full'>
      { options.map((o, idx) => (
        <div key={field + idx} className={ idx !== (options.length - 1) ? 'pb-2' : '' }>
          <input
            className='pr-4'
            id={o.f}
            name={field}
            type='radio'
            value={o.f}
            checked={state[field] === o.f}
            onChange={update(field)}
          />
          <label className='p-2 pr-4' htmlFor={o.f}>{o.l}</label>
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
  placeholder?:string
  disabled?:boolean
  hidden?:boolean
  args ?: Record<string, string>
}

type InputProps = Item & {
  state: Record<string, unknown>
  validated: boolean
  update: (f:string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: FC<InputProps> = ({
  state,
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
  ? (<Radio state={state} field={field} label={label} options={options} update={update} />)
  : (
    <React.Fragment>
      <label
        className={'font-bold mr-2 sm:text-right' + (hidden ? ' hidden' : '')}
        htmlFor={field}
      >{label}</label>
      <input
        className={'mb-2 p-2 w-auto w-full rounded' + (hidden ? ' hidden' : '') + (
          validated ? ' bg-gray-100 border border-gray-800' : ' bg-red-100 border border-red-700'
        )}
        name={field}
        placeholder={placeholder}
        type={type}
        value={String(state[field]) || ''}
        onChange={update(field)}
        disabled={disabled}
        {...args}
      />
    </React.Fragment>
    )

const getInitState = (items: Array<Item>) => items && items.length
  ? items.reduce((acc, v) => Object.assign(acc, { [v.field]: v.init }), {})
  : {}

const getInitValidated = (items: Array<Item>) : Record<string, boolean> => items && items.length
  ? items.reduce((acc, v) => Object.assign(acc, { [v.field]: true }), {})
  : {}

const allValidated = (validated: Record<string, boolean>) => isNil(Object.values(validated).find(v => v !== true))

type FormItem = Item & {
  verify?: (v: string) => Promise<unknown>
}
type FormProps = {
  name: string
  timeout?: number
  items: Array<FormItem>
  onSubmit: ((state: Record<string, unknown>) => void) | ((state: Record<string, unknown>) => Promise<void>)
  onAction?: string
  afterSubmit?: (() => void)
  onCancel: () => void
}

export const Form : FC<FormProps> = ({
  name,
  items,
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
  const setErrorSafe = (e : Error) => isMounted.current
    ? setError([e])
    : null
  const clearError = () => isMounted.current ? setError([]) : null

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(Object.assign({}, state, { [field]: e.target.value }))
  }

  useEffect(() => () => { isMounted.current = false }, [])

  useEffect(() => {
    const to = setTimeout(() => {
      Promise.all(items.map(i => i && i.verify
        ? i.verify(state[i.field])
          .then(() => ({ field: i.field, verified: true }))
          .catch(() => ({ field: i.field, verified: false }))
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
        ? afterSubmit()
        : null
      , 500))
      .catch(setErrorSafe)
      .finally(() => setTimeout(() => isMounted.current
        ? setIsSubmitting(false)
        : null
      , 500))
  }
  return (
    <div className='space-y-2'>
      <ErrorDisplay pre={name} errors={error} clearErrors={clearError} />
    <form
      className='rounded w-full sm:items-baseline sm:grid sm:grid-cols-2 text-xs p-1 md:text-base sm:gap-2 '
      style={{ gridTemplateColumns: 'max-content auto' }}
      onSubmit={onSubmitEvent}
      action={onAction || undefined }
      method='post'
    >
      { items.map(i => (
        <Input
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
      <div className='mt-2 flex flex-row w-auto border border-1 border-write-1 rounded'>
        <Button
          kind='group'
          disabled={isDisabled() || isSubmitting}
          className={isDisabled() ? '' : 'bg-green-200'}
          label={isSubmitting ? 'submitting...' : 'submit'}
          type='submit'
        />
        <Button
          kind='group'
          label='cancel'
          onClick={onCancel}
        />
      </div>
    </form>
  </div>
  )
}
