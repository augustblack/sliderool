import React, {
  ReactNode,
  FC,
  useRef,
  useState,
  useEffect,
  KeyboardEvent
} from 'react'
import ClientOnlyPortal from './clientOnlyPortal'
import { Clear } from './icons'
import Button, { ButtonProps } from './button'

const getLevel = (lev:number, num:number) => lev === 1
  ? ({ zIndex: 30 + num })
  : lev === 2
    ? ({ zIndex: 40 + num })
    : ({})

export type ButtonWithFocusProps = {
  buttonProps: ButtonProps
  open: boolean
  setOpen: (open: boolean) => void
}

export const ButtonWithFocus :FC<ButtonWithFocusProps> = ({
  buttonProps,
  open,
  setOpen
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  useEffect(() => {
    if (open === false && mounted.current && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [open])

  return (
      <Button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        {...buttonProps}
      />
  )
}

export type ModalProps = {
  level ?:number
  open: boolean
  setOpen: (open:boolean) => void
  children?: ReactNode
}

export const Modal:FC<ModalProps> = ({
  level = 1,
  open,
  setOpen,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({
    open: false,
    style: {
      opacity: 0.0,
      transition: 'opacity 0.25s ease'
    }
  })
  const esc = (event: KeyboardEvent<HTMLDivElement>) => event.key === 'Escape'
    ? setOpen(false)
    : null

  useEffect(() => {
    let mounted = true
    if (open && mounted) {
      setState(s => ({
        open: true,
        style: Object.assign({}, s.style, { opacity: 0.0 })
      }))
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus()
        }
        return mounted
          ? setState(s => ({
            open: true,
            style: Object.assign({}, s.style, { opacity: 1.0 })
          }))
          : null
      }, 1)
    } else if (mounted) {
      setState(s => ({
        open: true,
        style: Object.assign({}, s.style, { opacity: 0.0 })
      }))
      setTimeout(() => mounted
        ? setState(s => Object.assign({}, s, { open: false }))
        : null
      , 250)
    }
    return () => {
      mounted = false
    }
  }, [open])

  return state.open
    ? (
      <ClientOnlyPortal>
        <div
          className={'fixed w-full h-full top-0 left-0 flex justify-center select-none'}
          style={Object.assign({}, state.style, getLevel(level, 1))}
        >
          <div
            className={'absolute w-full h-full bg-gray-900 opacity-50'}
            style={getLevel(level, 2)}
            onMouseDown={() => setOpen(false)}
          />
          <div
            ref={modalRef}
            role='dialog'
            aria-modal={true}
            tabIndex={0}
            className={'bg-base-1 text-write-1 shadow-lg w-full h-full m-0 md:w-auto md:h-auto md:rounded md:m-auto'}
            style={getLevel(level, 3)}
            onKeyDown={esc}
          >
            {children}
          </div>
        </div>
      </ClientOnlyPortal>
      )
    : null
}

export type ModalWithCloseProps = ModalProps & {
  menu?: ReactNode
}

export const ModalWithClose: FC<ModalWithCloseProps> = ({
  level = 1,
  menu,
  open,
  setOpen,
  children
}) => (
  <Modal open={open} setOpen={setOpen} level={level}>
    <div className="flex flex-col w-full h-full" style={getLevel(level, 4)} >
      <div className="flex flex-row flex-none items-start">
        { menu
          ? (<div className='flex-grow'>{menu}</div>)
          : null
        }
        <div className="flex-grow" />
        <Button kind='none' className="flex-none " onClick={() => setOpen(false)}><Clear /></Button>
      </div>
      <div className="flex-grow m-1 md:m-2 h-full overflow-auto" style={getLevel(level, 4)} >
        {children}
      </div>
    </div>
  </Modal>
)

export type ModalButtonProps = {
  buttonProps: ButtonProps
  level ?:number
  children?: ReactNode
}

export const ModalButton:FC<ModalButtonProps> = ({
  buttonProps,
  level = 1,
  children
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ButtonWithFocus
        open={open}
        setOpen={setOpen}
        buttonProps={buttonProps}
      />
      <Modal open={open} setOpen={setOpen} level={level}>
        {children}
      </Modal>
    </>
  )
}

export type ModalButtonWithCloseProps = ModalButtonProps & {
  menu?: ReactNode
}

export const ModalButtonWithClose: FC<ModalButtonWithCloseProps> = ({
  buttonProps,
  level = 1,
  menu,
  children
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ButtonWithFocus
        open={open}
        setOpen={setOpen}
        buttonProps={buttonProps}
      />
      <Modal open={open} setOpen={setOpen} level={level}>
        <div className="flex flex-col w-full h-full" style={getLevel(level, 4)} >
          <div className="flex flex-row flex-none items-start">
            { menu
              ? (<div className='flex-grow'>{menu}</div>)
              : null
            }
            <div className="flex-grow" />
            <Button kind='none' className="flex-none " onClick={() => setOpen(false)}><Clear /></Button>
          </div>
          <div className="flex-grow m-1 md:m-2 h-full overflow-auto" style={getLevel(level, 4)} >
            {children}
          </div>
        </div>
      </Modal>
    </>
  )
}
