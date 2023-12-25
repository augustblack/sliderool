import React, { FC, ReactNode } from 'react'

export type AccordionProps = {
  id: string
  expanded: string
  setExpanded: (v: string) => void
  header?: ReactNode
  headerClass?: string
  childClass?: string
  children: ReactNode
}

export const Accordion: FC<AccordionProps> = ({
  id,
  expanded,
  setExpanded,
  header,
  headerClass = '',
  childClass = '',
  children
}) => {
  const isOpen = id === expanded

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <>
      <div
        className={'cursor-pointer transition-all duration-700 ' + headerClass}
        onClick={() => setExpanded(isOpen ? '' : id)}
      >{header}</div>
      <div
        className={'overflow-hidden transition-all duration-700 ' + childClass + (isOpen ? 'max-h-60' : 'max-h-0')}
      >
        {children}
      </div>
    </>
  )
}
