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
  PointerEvent, // careful, there is a global PointerEvent too
  PointerEventHandler
} from 'react'

import { UseSliderReturn } from './sliderHook'

type InfoStyle ={
  y?: MotionValue<number>
  x?: MotionValue<number>
}

type ThumbStyle = InfoStyle & {
  width: number
  height: number
  opacity: number
}

type SliderMotionProps = {
  trackClass: string
  trackStyle: Record<string, string | MotionValue<number> | number>
  trackRef: RefObject<HTMLDivElement>
  thumbClass: string
  thumbRef: RefObject<HTMLDivElement>
  thumbStyle: ThumbStyle
  infoStyle: InfoStyle
  pointerUp: PointerEventHandler<HTMLDivElement>
  pointerDown: PointerEventHandler<HTMLDivElement>
  pointerMove: PointerEventHandler<HTMLDivElement>
  dragStart: (e: DragEvent) => void
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
  const valRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const unsubscribeVal = val.onChange(v => {
      if (valRef.current) {
        valRef.current.innerHTML = formatVal(v)
      }
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
         className={'flex justify-center ' + thumbClass}
         style={thumbStyle}
         whileTap={{ scale: 1.1, opacity: 1.0 }}
         ref={thumbRef}
         onPointerDown={pointerDown}
         onDragStart={dragStart}
         dragConstraints={trackRef}
       >
        <div
          ref={valRef}
          className='select-none text-base-1 text-sm inline-block'
          style={{
            pointerEvents: 'none', // allow clicks to pass through
            touchAction: 'none',
            zIndex: 99,
            opacity,
            transition: 'opacity 0.75s ease-out'
          }} />
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
const blankDiv = {
  offsetTop: 0,
  offsetHeight: 0,
  offsetWidth: 0,
  offsetLeft: 0
}
const Slider: FC<SliderProps> = ({
  slider,
  orientation = 'vertical',
  trackSize = 192,
  formatVal = (v) => `${v.toFixed(2)}`,
  children
}: SliderProps) => {
  const trackRef = useRef<HTMLDivElement>(blankDiv as HTMLDivElement)
  const thumbRef = useRef<HTMLDivElement>(blankDiv as HTMLDivElement)
  const childRef = useRef<HTMLDivElement>(blankDiv as HTMLDivElement)
  const [opacity, setOpacity] = useState(0)
  const thumbSize = 64
  const trackRatio = trackSize - thumbSize

  const xyTransVals = orientation === 'vertical' ? [1, 0] : [0, 1]
  const xy = useTransform(slider.spring, xyTransVals, [0, trackRatio])

  const thumbStyle = orientation === 'vertical'
    ? ({ y: xy, width: 48, height: thumbSize, opacity: 0.75 }) // w-12 h-16
    : ({ x: xy, width: thumbSize, height: 48, opacity: 0.75 })

  const trackStyle = orientation === 'vertical'
    ? { touchAction: 'none', height: trackSize, width: 50 }
    : { touchAction: 'none', width: trackSize, height: 50 }

  const getDimensions = (ref: RefObject<HTMLDivElement>) => !ref.current
    ? 0
    : orientation === 'vertical'
      ? ref.current.offsetHeight
      : ref.current.offsetWidth

  const getChildValVert = (latest:number) => latest < 0.50001
    ? 0
    : getDimensions(trackRef) - getDimensions(childRef)

  const getChildValHoriz = (latest:number) => latest < 0.50001
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
    ? 'bg-gradient-to-t from-base-1/25 via-base-3/25 to-base-2/50 inline-block rounded border border-1 border-write-1 '
    : 'bg-gradient-to-r from-base-1/25 via-base-3/25 to-base-2/25 inline-block rounded border border-1 border-write-1'

  const thumbClass = 'bg-write-2 rounded '

  const getY = (e:PointerEvent) => {
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

  const getX = (e: PointerEvent) => {
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
  const pointerDown: PointerEventHandler<HTMLDivElement> = e => {
    trackRef.current.setPointerCapture(e.pointerId)
    slider.onPress()
    setOpacity(1)
  }
  // setState(s => R.merge(s, { opacity: 1.0 }))
  const pointerUp: PointerEventHandler<HTMLDivElement> = e => {
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
  const pointerMove: PointerEventHandler<HTMLDivElement> = e => {
    // console.log('move', e.pointerId)
    if ((trackRef.current.hasPointerCapture && trackRef.current.hasPointerCapture(e.pointerId))) {
      const v = orientation === 'vertical' ? getY(e) : getX(e)
      slider.spring.set(v)
    }
  }

  // see https://javascript.info/pointer-events
  // need to prevent browser drag n drop
  const dragStart = (e:DragEvent) => {
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
