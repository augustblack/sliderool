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
// style="max-height: 0; transition: margin 0.5s ease-in-out, max-height 0.5s ease-in-out, opacity 0.5s ease-in-out; overflow: hidden;">
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

  return (
    <>
      <button
        className={'cursor-pointer transition-all duration-700 ' + headerClass}
        onClick={() => setExpanded(isOpen ? '' : id)}
      >{header}</button>
      <div
        className={'transition-all duration-700 ' + childClass + (isOpen ? 'max-h-screen overflow-scroll' : 'max-h-0 overflow-hidden')}
      >
        {children}
      </div>
    </>
  )
}
