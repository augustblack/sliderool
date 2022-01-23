import React, {
  ReactNode,
  FC,
  useRef,
  useState,
  useEffect
} from 'react'
import ClientOnlyPortal from './clientOnlyPortal'
import { Clear } from './icons'
import Button, { ButtonProps } from './button'

const getLevel = (lev:number, num:number) => lev === 1
  ? ({ zIndex: 30 + num })
  : lev === 2
    ? ({ zIndex: 40 + num })
    : ({})

export type ModalProps = {
  buttonProps: ButtonProps
  level ?:number
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children?: ReactNode
}

export const Modal:FC<ModalProps> = ({
  buttonProps,
  level = 1,
  open,
  setOpen,
  children
}) => {
  const modalRef = useRef(null)
  const buttonRef = useRef(null)
  const [state, setState] = useState({
    open: false,
    style: {
      opacity: 0.0,
      transition: 'opacity 0.25s ease'
    }
  })
  const esc = (event) => event.keyCode === 27
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
        modalRef.current.focus()
        return mounted
          ? setState(s => ({
            open: true,
            style: Object.assign({}, s.style, { opacity: 1.0 })
          }))
          : null
      }, 1)
    } else if (mounted) {
      if (buttonRef.current) {
        buttonRef.current.focus()
      }
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
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        {...buttonProps}
      />
      { state.open
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
    </>
  )
}

export type ModalWithCloseProps = ModalProps & {
  menu?: ReactNode
}

export const ModalWithClose: FC<ModalWithCloseProps> = ({
  buttonProps,
  level = 1,
  menu,
  open,
  setOpen,
  children
}) => (
  <Modal open={open} setOpen={setOpen} level={level} buttonProps={buttonProps}>
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
