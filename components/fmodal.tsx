import React, {
  ReactNode,
  FC,
  KeyboardEvent,
  useState,
  useRef,
  useEffect
} from 'react'
import {
  motion,
  AnimatePresence
} from 'framer-motion'

import ClientOnlyPortal from './clientOnlyPortal'

import Button, { ButtonProps } from './button'

const getLevel = (lev:number, num:number) => lev === 1
  ? ({ zIndex: 30 + num })
  : lev === 2
    ? ({ zIndex: 40 + num })
    : ({})

export type BackdropProps = {
  onClick: () => void
  children?: ReactNode
}

export const Backdrop: FC<BackdropProps> = ({
  children,
  onClick
}) => (
  <motion.div
    onClick={onClick}
    className="backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
)

export type ModalProps = {
  level ?:number
  open: boolean
  setOpen: (open:boolean) => void // React.Dispatch<React.SetStateAction<boolean>>
  children?: ReactNode
}
/*
const dropIn = {
  hidden: {
    x: '100vw',
    opacity: 0,
    scale: 0.1
  },
  visible: {
    x: '0',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    x: '-100vw',
    opacity: 0,
    scale: 0.1,
    transition: {
      duration: 1,
      damping: 25,
      stiffness: 500
    }

  }
}
 */

export const Modal:FC<ModalProps> = ({
  level = 1,
  open,
  setOpen,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const mounted = useRef<boolean>(false)
  const esc = (event: KeyboardEvent<HTMLDivElement>) => event.key === 'Escape'
    ? setOpen(false)
    : null

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (modalRef.current && mounted.current) {
          modalRef.current.focus()
        }
      }, 1)
    }
  }, [open])

  return (
          <ClientOnlyPortal>
            <div
              className={'absolute top-0 left-0 flex flex-col justify-center select-none w-screen h-screen'}
              style={getLevel(level, 2)}
              onClick={() => setOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
                role='dialog'
                aria-modal={true}
                tabIndex={0}
                className={'bg-base-1 text-write-1 shadow-lg w-full h-full md:w-5/6 md:h-5/6 lg:w-3/4 lg:h-3/4 m-auto  md:rounded '}
                style={getLevel(level, 3)}
                onKeyDown={esc}
                initial={{
                  opacity: 0,
                  scale: 0.1
                }}
                animate ={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.2,
                    damping: 25,
                    stiffness: 500
                  }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.1,
                  transition: {
                    duration: 0.2,
                    damping: 25,
                    stiffness: 500
                  }
                }}
              >
                {children}
              </motion.div>
            </div>
          </ClientOnlyPortal>
  )
}
type FModalProps = ModalProps & {
  open:boolean
}
export const FModal : FC<FModalProps> = ({
  level = 1,
  open,
  setOpen,
  children
}) => (
  <AnimatePresence
    // Disable any initial animations on children that
    // are present when the component is first rendered
    initial={false}
    // Only render one component at a time.
    // The exiting component will finish its exit
    // animation before entering component is rendered
    exitBeforeEnter={true}
    // Fires when all exiting nodes have completed animating out
    onExitComplete={() => null}
  >
    {
      open && <Modal open={open} setOpen={setOpen} level={level}>
        {children}
      </Modal>
    }
  </AnimatePresence>
)
type FModalButtonProps = {
  level?: 1
  buttonProps: ButtonProps
  children?: ReactNode
}
export const FModalButton : FC<FModalButtonProps> = ({
  level = 1,
  buttonProps,
  children
}) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mounted = useRef<boolean>(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (open === false && buttonRef.current && mounted.current) {
      buttonRef.current.focus()
    }
  }, [open])

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        {...buttonProps}
      />
      <FModal open={open} setOpen={setOpen} level={level} >
        {children}
      </FModal>
    </>
  )
}
