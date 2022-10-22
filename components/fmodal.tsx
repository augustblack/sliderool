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
import { ButtonWithFocus, ModalProps } from './modal'
import { Clear } from './icons'

const getLevel = (lev: number, num: number) => lev === 1
  ? { zIndex: 30 + num }
  : lev === 2 ? { zIndex: 40 + num } : {}

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

const Modal: FC<ModalProps> = ({
  level = 1,
  open,
  setOpen,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const mounted = useRef<boolean>(false)
  const esc = (event: KeyboardEvent<HTMLDivElement>) =>
    event.key === 'Escape' ? setOpen(false) : null

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
        className={
          'absolute top-0 left-0 flex flex-col justify-center select-none w-screen h-screen'
        }
      >
        <motion.div
          className={'absolute w-screen h-screen bg-gray-900'}
          style={getLevel(level, 2)}
          onMouseDown={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
          role="dialog"
          aria-modal={true}
          tabIndex={0}
          className={
            'bg-base-1 text-write-1 shadow-lg w-full h-full md:w-5/6 md:h-5/6 lg:w-3/4 lg:h-3/4 m-auto  md:rounded '
          }
          style={getLevel(level, 3)}
          onKeyDown={esc}
          initial={{
            opacity: 0,
            scale: 0.1
          }}
          animate={{
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
  open: boolean
}
export const FModal: FC<FModalProps> = ({
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
    mode="wait"
    // Fires when all exiting nodes have completed animating out
    onExitComplete={() => null}
  >
    {open && (
      <Modal open={open} setOpen={setOpen} level={level}>
        {children}
      </Modal>
    )}
  </AnimatePresence>
)

export type FModalWithCloseProps = ModalProps & {
  menu?: ReactNode
}
export const FModalWithClose: FC<FModalWithCloseProps> = ({
  level = 1,
  menu,
  open,
  setOpen,
  children
}) => (
  <FModal open={open} setOpen={setOpen} level={level}>
    <div className="flex flex-col w-full h-full" style={getLevel(level, 4)}>
      <div className="flex flex-row flex-none items-start">
        {menu ? <div className="flex-grow">{menu}</div> : null}
        <div className="flex-grow" />
        <Button
          kind="none"
          className="flex-none "
          onClick={() => setOpen(false)}
        >
          <Clear />
        </Button>
      </div>
      <div
        className="flex-grow m-1 md:m-2 h-full overflow-auto"
        style={getLevel(level, 4)}
      >
        {children}
      </div>
    </div>
  </FModal>
)

type FModalButtonProps = {
  level?: 1
  buttonProps: ButtonProps
  children?: ReactNode
}
export const FModalButton: FC<FModalButtonProps> = ({
  level = 1,
  buttonProps,
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
      <FModal open={open} setOpen={setOpen} level={level}>
        {children}
      </FModal>
    </>
  )
}

type FModalButtonWithCloseProps = {
  level?: 1
  buttonProps: ButtonProps
  menu: ReactNode
  children?: ReactNode
}

export const FModalButtonWithClose: FC<FModalButtonWithCloseProps> = ({
  level = 1,
  buttonProps,
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
      <FModalWithClose open={open} setOpen={setOpen} level={level} menu={menu}>
        {children}
      </FModalWithClose>
    </>
  )
}
