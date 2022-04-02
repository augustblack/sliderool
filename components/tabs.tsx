import React, { ReactNode, FC, useState, useRef, useEffect } from 'react'

type TabHeaderProps = {
  name: string
  label: ReactNode
}

type TabHProps = TabHeaderProps & {
  selectTab: (name:string) => void
  selected ?: boolean
}

const base = ' md:text-base font-semibold rounded-t focus:outline-none mx-px py-px md:py-2 px-2 sm:px-3 md:px-4'
export const TabH : FC<TabHProps> = ({
  name,
  label,
  selectTab,
  selected
}) => selected
  ? (
    <button
      disabled={true}
      className={ 'bg-base-1 border-l border-t border-r border-black text-write-1 cursor-default' + base + ' px-3 md:px-4'}
      style={{ top: '1px', left: '-1px', zIndex: 2, position: 'relative' }}
    >{label}</button>
    )
  : (
    <button
      className={ 'bg-base-2 border-l border-t border-r border-black hover:bg-base-1 text-write-1 truncate w-8 sm:overlow-auto sm:w-auto ' + base }
      onClick={() => selectTab(name)}
      style={{ left: '-1px', zIndex: 2, position: 'relative' }}
    >{label}</button>

    )

export type TabProps = {
  name: string
  children : ReactNode
}
export const Tab : FC<TabProps> = ({
  name,
  children
}) => (
  <div className={'bg-base-1 rounded-b border border-black flex w-full h-full overflow-auto'} id={name}>
    {children}
  </div>
)

export type TabsProps = {
  headers: Array<TabHeaderProps>
  children: ReactNode
}

export const Tabs : FC<TabsProps> = ({
  headers,
  children
}) => {
  const [state, setState] = useState(headers[0].name)
  const cRef = useRef<HTMLDivElement>(({ offsetTop: 0 } as HTMLDivElement))
  const selectTab = (name:string) => setState(name)
  useEffect(() => {
    cRef.current.childNodes.forEach(c => (c as HTMLElement).classList.add('hidden'))
    const o = cRef.current.querySelector('#' + state)
    if (o) {
      o.classList.remove('hidden')
    }
  }, [state, cRef])

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='space-x-4'>
        { headers.map((h, idx) => <TabH key={h.name + idx} name={h.name} label={h.label} selectTab={selectTab} selected={state === h.name } />) }
      </div>
      <div ref={cRef} className='flex-grow overflow-auto'>
        { children }
      </div>
    </div>
  )
}
