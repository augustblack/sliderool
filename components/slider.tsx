import {
  motion,
  useTransform,
  MotionValue
} from 'framer-motion'

import React, {
  ReactNode,
  FC,
  useState,
  useEffect,
  useRef,
  RefObject,
  SyntheticEvent
} from 'react'

import { UseSliderReturn } from './sliderHook'
interface SliderMotionProps {
  trackClass: string
  trackStyle: Record<string, string | MotionValue<number> | number>,
  trackRef: RefObject<HTMLDivElement>
  thumbClass: string
  thumbRef: RefObject<HTMLDivElement>
  thumbStyle: Record<string, MotionValue<number> | number>,
  infoStyle: Record<string, MotionValue<number>| number>,
  pointerUp: (e: SyntheticEvent<HTMLDivElement>) => void
  pointerDown: (e: SyntheticEvent<HTMLDivElement>) => void
  pointerMove: (e: SyntheticEvent<HTMLDivElement>) => void
  dragStart: (e: DragEvent) => void,
  opacity: number
  val: MotionValue
  children?: ReactNode
  formatVal: (v: number) => string
}

const SliderMotion : FC<SliderMotionProps> = ({
  trackClass,
  trackStyle,
  trackRef,
  thumbClass,
  thumbRef,
  thumbStyle,
  infoStyle,
  pointerUp,
  pointerDown,
  pointerMove,
  dragStart,
  opacity,
  val,
  formatVal,
  children
}: SliderMotionProps) => {
  const valRef = useRef(null)
  useEffect(() => {
    const unsubscribeVal = val.onChange(v => {
      valRef.current.innerHTML = formatVal(v)
    })
    return () => unsubscribeVal()
  }, [val, formatVal])

  return (
     <motion.div
       className={'relative ' + trackClass}
       ref={trackRef}
       // onPointerDown={e => trackRef.current.setPointerCapture(e.pointerId)}
       onPointerDown={pointerDown}
       onPointerUp={pointerUp}
       onPointerMove={pointerMove}
       onPointerCancel={pointerUp}
       // need this for pointer move
       style={ trackStyle }
       onDragStart={dragStart}
     >
       <motion.div
         className='absolute select-none pointer-action-none '
         style={infoStyle}
       >
         {children}
       </motion.div>
       <motion.div
         className={'absolute ' + thumbClass}
         style={thumbStyle}
         whileTap={{ scale: 1.2 }}
         ref={thumbRef}
         onPointerDown={pointerDown}
         onDragStart={dragStart}
         dragConstraints={trackRef}
       >
        <div
          ref={valRef}
          className='select-none bg-base-3 rounded ml-1 p-1 text-sm inline-block relative'
          style={{
            pointerEvents: 'none', // allow clicks to pass through
            touchAction: 'none',
            top: '-2rem',
            zIndex: 99,
            opacity,
            transition: 'opacity 0.75s ease-out'
          }}></div>

       </motion.div>
     </motion.div>
  )
}

type Orientation = 'horizontal' | 'vertical'

interface SliderProps {
  orientation?: Orientation
  slider: UseSliderReturn
  trackSize ?: number,
  children?: ReactNode
  formatVal ?: (v: number) => string
}

const Slider: FC<SliderProps> = ({
  slider,
  orientation = 'vertical',
  trackSize = 192,
  formatVal = (v) => `${v.toFixed(2)}`,
  children
}: SliderProps) => {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const childRef = useRef(null)
  const [opacity, setOpacity] = useState(0)
  const thumbSize = 64
  const trackRatio = trackSize - thumbSize

  const xyTransVals = orientation === 'vertical' ? [1, 0] : [0, 1]
  const xy = useTransform(slider.spring, xyTransVals, [0, trackRatio])

  const thumbStyle = orientation === 'vertical'
    ? ({ y: xy, width: 48, height: thumbSize }) // w-12 h-16
    : ({ x: xy, width: thumbSize, height: 48 })

  const trackStyle = orientation === 'vertical'
    ? { touchAction: 'none', height: trackSize, width: 49 }
    : { touchAction: 'none', width: trackSize, height: 49 }

  const getDimensions = (ref) => !ref.current
    ? 0
    : orientation === 'vertical'
      ? ref.current.offsetHeight
      : ref.current.offsetWidth

  const getChildValVert = latest => latest < 0.50001
    ? 0
    : getDimensions(trackRef) - getDimensions(childRef)

  const getChildValHoriz = latest => latest < 0.50001
    ? getDimensions(trackRef) - getDimensions(childRef)
    : 0

  const getChildVal = (orientation: Orientation) => orientation === 'vertical'
    ? getChildValVert
    : getChildValHoriz

  const childVal = useTransform(slider.spring, getChildVal(orientation))
  const infoStyle = orientation === 'vertical'
    ? ({ y: childVal })
    : ({ x: childVal })

  const trackClass = orientation === 'vertical'
    ? 'bg-gradient-to-b from-base-2 to-base-3 inline-block rounded border border-1 border-write-1'
    : 'bg-gradient-to-r from-base-2 to-base-3 inline-block rounded border border-1 border-write-1'

  const thumbClass = 'bg-write-2 rounded'

  const getY = (e) => {
    const pos = e.pageY - trackRef.current.offsetTop - (thumbRef.current.offsetHeight / 2)
    const h = trackRef.current.offsetHeight - thumbRef.current.offsetHeight
    const newpos = pos < 0
      ? 0
      : pos > h
        ? h
        : pos
    const yval = (h - newpos) / h
    // const rval = h - (yval * h)
    return yval
  }

  const getX = e => {
    const pos = e.pageX - trackRef.current.offsetLeft - (thumbRef.current.offsetWidth / 2)
    const w = trackRef.current.offsetWidth - thumbRef.current.offsetWidth
    const newpos = pos < 0
      ? 0
      : pos > w
        ? w
        : pos
    const xval = (w - newpos) / w
    return 1 - xval
    // return w - (xval * w)
  }
  const pointerDown = e => {
    trackRef.current.setPointerCapture(e.pointerId)
    slider.onPress()
    setOpacity(1)
  }
  // setState(s => R.merge(s, { opacity: 1.0 }))
  const pointerUp = (e) => {
    if (!(trackRef.current.hasPointerCapture && trackRef.current.hasPointerCapture(e.pointerId))) {
      return
    }
    const v = orientation === 'vertical' ? getY(e) : getX(e)
    slider.spring.set(v)
    slider.onRelease()
    if (e.target === trackRef.current || e.target === childRef.current) {
      setOpacity(1)
      setTimeout(() => setOpacity(0), 1000)
    } else {
      setOpacity(0)
    }
  }
  const pointerMove = e => {
    // console.log('move', e.pointerId)
    if ((trackRef.current.hasPointerCapture && trackRef.current.hasPointerCapture(e.pointerId))) {
      const v = orientation === 'vertical' ? getY(e) : getX(e)
      slider.spring.set(v)
    }
  }

  // see https://javascript.info/pointer-events
  // need to prevent browser drag n drop
  const dragStart = e => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  return (<SliderMotion
    trackClass={trackClass}
    trackRef={trackRef}
    trackStyle={trackStyle}
    thumbClass={thumbClass}
    thumbRef={thumbRef}
    thumbStyle={thumbStyle}
    infoStyle={infoStyle}
    pointerUp={pointerUp}
    pointerDown={pointerDown}
    pointerMove={pointerMove}
    dragStart={dragStart}
    opacity={opacity}
    formatVal={formatVal}
    val={slider.val}
  >
  <div ref={childRef}>
    {children}
  </div>
  </SliderMotion>)
}
export default React.memo(Slider)
