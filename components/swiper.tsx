// https://koenvg.medium.com/infinite-carousel-with-framer-motion-b5f93b06ae9a
import React, { FC, ReactNode, useState, useRef, useEffect } from 'react'
import { Icons } from '../components'
import {
  motion,
  MotionStyle,
  AnimationOptions,
  animate,
  PanInfo,
  MotionValue,
  useMotionValue
} from 'framer-motion'


interface PageProps {
  index: number
  renderPage: (props: { index: number }) => ReactNode
  x: MotionValue
  onDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void
}

const pageStyle: MotionStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
}

export const Page: FC<PageProps> = ({ index, renderPage, x, onDragEnd }) => {
  const child = React.useMemo(() => renderPage({ index }), [index, renderPage])

  return (
    <motion.div
      style={{
        ...pageStyle,
        x,
        left: `${index * 100}%`,
        right: `${index * 100}%`,
      }}
      draggable
      drag="x"
      dragElastic={1}
      onDragEnd={onDragEnd}
    >
      {child}
    </motion.div>
  )
}


const range = [-1, 0, 1]

type SwiperProps = {
  index?: number
  children: (props: {index: number}) => ReactNode
}

const containerStyle: MotionStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflowX: 'hidden'
}

const transition: AnimationOptions<number> = {
  type: 'spring',
  bounce: 0
}

// const calculateNewX = (i: number, div: HTMLElement ) => -i * (div?.clientWidth || 0)
const calculateNewX = (i: number, div: HTMLDivElement | null ) => -i * (div?.getBoundingClientRect().width || 0)

const baseIconClass = 'absolute z-10 flex place-items-center'
const iconClassL = baseIconClass + ' left-0'
const iconClassR = baseIconClass + ' right-0'
const arrowClass = 'text-gray-100 bg-opacity-10 bg-gray-900 cursor-pointer'

export const Swiper: FC<SwiperProps> = ({
  index = 0,
  children
}) => {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [idx, setIndex] = useState(index)

  const handleEndDrag = (_e: Event, dragProps: PanInfo) => {
    const clientWidth = containerRef.current?.clientWidth || 0

    const { offset, velocity } = dragProps

    if (Math.abs(velocity.y) > Math.abs(velocity.x)) {
      animate(x, calculateNewX(idx, containerRef.current), transition)
      return
    }

    if (offset.x > clientWidth / 4) {
      setIndex(idx - 1)
    } else if (offset.x < -clientWidth / 4) {
      setIndex(idx + 1)
    } else {
      animate(x, calculateNewX(idx, containerRef.current), transition)
    }
  }

  useEffect(() => {
    // need to set resize here
    const onResize = () => {
      x.set(calculateNewX(idx, containerRef.current))
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [idx, x])

  useEffect(() => {
    const controls = animate(x, calculateNewX(idx, containerRef.current), transition)
    return controls.stop
  }, [idx, x])

  const goLeft = () => setIndex(idx => idx - 1)
  const goRight = () => setIndex(idx => idx + 1)


  return (
    <motion.div ref={containerRef} style={containerStyle} className="flex items-center">
      <button className={iconClassL} onClick={goLeft}><Icons.ChevronLeft size='4rem' className={arrowClass} /></button>
      {range.map((rangeValue) => {
        return (
          <Page
            key={rangeValue + idx}
            x={x}
            onDragEnd={handleEndDrag}
            index={rangeValue + idx}
            renderPage={children}
          />
        )
      })}
      <button className={iconClassR} onClick={goRight}><Icons.ChevronRight size='4rem' className={arrowClass} /></button>
    </motion.div>
  )
}

export default Swiper
