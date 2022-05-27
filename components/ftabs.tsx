import React, { ReactNode, FC, useState, useRef } from 'react'
import {
  motion,
  AnimatePresence
} from 'framer-motion'

type FTabHProps = {
  index: number,
  label: ReactNode,
  selectTab: (idx:number) => void
  selected ?: boolean
}

export const FTabH : FC<FTabHProps> = ({
  index,
  label,
  selectTab,
  selected
}) => (
  <div className={ selected ? '' : 'opacity-50'}>
    <button
      disabled={!!selected}
      className={'text-write-1  ' + (selected ? 'cursor-default' : ' cursor-pointer truncate w-8 sm:w-auto') }
      onClick={selected ? () => null : () => selectTab(index)}
    >{label}</button>

    { selected
      ? <motion.div className="h-1 w-full bg-primary-1" layoutId="underline" />
      : null
    }
  </div>
)

export type FTabProps = {
  name: string
  className ?: string
  children : ReactNode
}
export const FTab : FC<FTabProps> = ({
  name,
  className = '',
  children
}) => (
  <div className={'flex w-full h-full overflow-auto' + className} id={name}>
    {children}
  </div>
)

export type FTabsProps = {
  headers: Array<ReactNode>
  rightside ?: ReactNode
  children: Array<ReactNode>
}

export const FTabs : FC<FTabsProps> = ({
  headers,
  rightside,
  children
}) => {
  const [state, setState] = useState<number>(0)
  const rando = useRef<string>(
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 5)
  )
  const selectTab = (idx:number) => setState(idx)

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-row space-x-4 p-2'>
        { headers.map((h, idx) => <FTabH key={'tab' + idx} index={idx} label={h} selectTab={selectTab} selected={state === idx} />) }
        <div className='flex-grow' />
        {
          rightside
        }
      </div>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={'tab_' + rando.current + '_' + state }
          className='flex-grow overflow-auto'
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          { children[state] }
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
