// https://koenvg.medium.com/infinite-carousel-with-framer-motion-b5f93b06ae9a
import React, { FC, ReactNode, useState, useRef, useEffect } from 'react'
import { Icons } from '../components'
import { Pagination, PaginationNumbers } from '../components/pagination'
import {
  motion,
  MotionStyle,
  AnimationOptions,
  animate,
  PanInfo,
  MotionValue,
  useMotionValue
} from 'framer-motion'

type SwiperState = {
  idx: number
  wrappedIdx: number
  length: number
}


interface PageProps {
  idx: number
  wrappedIdx: number
  length: number
  renderPage: (props: { idx: number, wrappedIdx: number, length: number }) => ReactNode
  x: MotionValue
  onDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void
}

const pageStyle: MotionStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
}

export const Page: FC<PageProps> = ({
  idx,
  length,
  wrappedIdx,
  renderPage,
  x,
  onDragEnd
}) => {
  const child = React.useMemo(() => renderPage({ idx, wrappedIdx, length }), [idx, wrappedIdx, renderPage, length])

  return (
    <motion.div
      style={{
        ...pageStyle,
        x,
        left: `${idx * 100}%`,
        right: `${idx * 100}%`,
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

export type SwiperConfig = {
  pagination?: {
    pos: 'top' | 'bottom'
    numbers: boolean
  }
}

type SwiperPaginationProps = {
  config ?: SwiperConfig
  currentIdx: number
  length: number
  onChange: (n: number) => void
}

const SwiperPagination: FC<SwiperPaginationProps> = ({
  config,
  currentIdx,
  length,
  onChange
}) => config?.pagination?.numbers
    ? <PaginationNumbers currentIdx={currentIdx} length={length} onChange={onChange} />
    : <Pagination currentIdx={currentIdx} length={length} onChange={onChange} />

export type SwiperProps = {
  index?: number
  length: number
  config ?: SwiperConfig
  onChange ?: (n: number) => void
  children: (props: SwiperState) => ReactNode
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

const getSwipeState = (index:number, length:number): SwiperState => {
  const modulo = index % length
  const wrappedIdx = modulo < 0 ? length + modulo : modulo
  return {
    idx: index,
    wrappedIdx,
    length
  }
}

const calculateNewX = (i: number, div: HTMLDivElement | null ) => -i * (div?.getBoundingClientRect().width || 0)

const baseIconClass = 'absolute z-10 place-items-center hidden sm:flex'
const iconClassL = baseIconClass + ' left-0'
const iconClassR = baseIconClass + ' right-0'
const arrowClass = 'text-gray-100 bg-opacity-10 bg-gray-900 cursor-pointer'

export const Swiper: FC<SwiperProps> = ({
  index = 0,
  onChange,
  config,
  length,
  children
}) => {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<SwiperState>(getSwipeState(index, length))

  const handleEndDrag = (_e: Event, dragProps: PanInfo) => {
    const clientWidth = containerRef.current?.clientWidth || 0

    const { offset, velocity } = dragProps
    if (Math.abs(velocity.y) > Math.abs(velocity.x)) {
      animate(x, calculateNewX(state.idx, containerRef.current), transition)
      return
    }

    if (offset.x > clientWidth / 4) {
      setState(s => getSwipeState(s.idx - 1, s.length))
    } else if (offset.x < -clientWidth / 4) {
      setState(s => getSwipeState(s.idx + 1, s.length))
    } else {
      animate(x, calculateNewX(state.idx, containerRef.current), transition)
    }
  }

  useEffect(() => {
    // need to set resize here
    const onResize = () => {
      x.set(calculateNewX(state.idx, containerRef.current))
    }
    window.addEventListener('resize', onResize)
    // onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [state.idx, x])


  useEffect(() => {
    const controls = animate(x, calculateNewX(state.idx, containerRef.current), transition)
    if (onChange) {
      onChange(state.idx)
    }
    return controls.stop
  }, [state.idx, x, onChange])

  const goLeft = () => setState(s => getSwipeState(s.idx - 1, s.length))
  const goRight = () => setState(s => getSwipeState(s.idx + 1, s.length))

  return (
    <motion.div ref={containerRef} style={containerStyle} className="flex items-center ">
      {range.map((rangeValue) => {
        const rngState = rangeValue === 0
          ? state
          : getSwipeState(state.idx + rangeValue, state.length)
        return (
          <Page
            key={rngState.wrappedIdx}
            x={x}
            onDragEnd={handleEndDrag}
            idx={rngState.idx}
            length={rngState.length}
            wrappedIdx={rngState.wrappedIdx}
            renderPage={children}
          />
        )
      })}
      { length > 1 && (
      <>
        <button className={iconClassL} onClick={goLeft}><Icons.ChevronLeft size='4rem' className={arrowClass} /></button>
        <button className={iconClassR} onClick={goRight}><Icons.ChevronRight size='4rem' className={arrowClass} /></button>
        { config?.pagination && (
          <div className={
          'absolute z-10 left-0 ' +
          (config.pagination.pos === 'bottom' ? 'bottom-0' : 'top-0') +
          ' h-8 text-xs w-full flex flex-row place-items-center place-content-center '
          }>
            <SwiperPagination
              config={config}
              currentIdx={state.wrappedIdx}
              length={state.length}
              onChange={(n:number) => setState(s => getSwipeState(n, s.length))}
            />
          </div>
          )
        }
      </>
          )
      }
    </motion.div>
  )
}

export default Swiper
