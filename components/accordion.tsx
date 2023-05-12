import React, { FC, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import Icons, { IconOnOffProps, IconProps } from './icons'

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
    headerClass='',
    childClass='',
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
          className={'overflow-hidden transition-all duration-700 ' + childClass + (isOpen ? 'max-h-60' : 'max-h-0' )}
      >
        {children}
      </div>
    </>
  )
}

export const AccordionOld: FC<AccordionProps> = ({
    id,
    expanded,
    setExpanded,
    header,
    headerClass='',
    childClass='',
    children
}) => {
  const isOpen = id === expanded;

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <>
      <motion.div
        layout
        className={'cursor-pointer ' + headerClass}
        initial={false}
        onClick={() => setExpanded(isOpen ? '' : id)}
      >{header}</motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={'overflow-hidden ' + childClass}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
