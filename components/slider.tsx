import {
  motion,
  useTransform
} from 'framer-motion'

import React, {
  ReactNode,
  FC,
  useRef,
  RefObject,
  PointerEvent, // careful, there is a global PointerEvent too
  PointerEventHandler
} from 'react'

import {
  UseSliderReturn,
  useSlider,
  ScaleType
} from './sliderHook'

export type Orientation = 'horizontal' | 'vertical'

interface SliderProps {
  layoutId ?: string
  orientation?: Orientation
  slider: UseSliderReturn
  trackSize ?: number,
  children?: ReactNode
}

const SliderNoMemo: FC<SliderProps> = ({
  layoutId,
  slider,
  orientation = 'vertical',
  trackSize = 192,
  children
}: SliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)
  const posInThumb = useRef<{left:number, top:number}>({ left: 0, top: 0 })
  const trackRect = useRef<{left:number, top:number}>({ left: 0, top: 0 })

  const thumbSize = 64
  const trackRatio = trackSize - thumbSize - 4 // account for 2 px border
  const xyTransVals = orientation === 'vertical' ? [1, 0] : [0, 1]
  const xy = useTransform(slider.spring, xyTransVals, [2, trackRatio])

  const thumbStyle = orientation === 'vertical'
    ? ({ y: xy, x: 2, width: 44, height: thumbSize, opacity: 0.75 }) // w-12 h-16
    : ({ x: xy, y: 2, width: thumbSize, height: 44, opacity: 0.75 })

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
    ? 'bg-gradient-to-t from-base-1/25 via-base-3/25 to-base-2/50 inline-block rounded border border-write-1 '
    : 'bg-gradient-to-r from-base-1/25 via-base-3/25 to-base-2/25 inline-block rounded border border-write-1'

  const thumbClass = 'bg-write-2 rounded '

  const getY = (e:PointerEvent) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientY - trackRect.current.top - posInThumb.current.top
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
    return 0
  }

  const getX = (e: PointerEvent) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientX - trackRect.current.left - posInThumb.current.left // x position within the element.
      const w = trackRef.current?.offsetWidth - thumbRef.current?.offsetWidth
      const newpos = pos < 0
        ? 0
        : pos > w
          ? w
          : pos
      const xval = (w - newpos) / w
      return 1 - xval
    }
    return 0
    // return w - (xval * w)
  }
  const pointerDown: PointerEventHandler<HTMLDivElement> = e => {
    // set the capture pointer
    trackRef.current?.setPointerCapture(e.pointerId)

    // save bounding rect here so we aren't updating while moving
    trackRect.current = trackRef.current?.getBoundingClientRect() || { top: 0, left: 0 }

    //  only save bounding rect for thumb here if we hit the thumb
    if (e.target === thumbRef.current) {
      const thumbRect = thumbRef.current?.getBoundingClientRect() || { top: 0, left: 0 }
      posInThumb.current = {
        top: e.clientY - thumbRect.top,
        left: e.clientX - thumbRect.left
      }
    } else {
      posInThumb.current = {
        top: 0,
        left: 0
      }
    }
    slider.onPress()
  }
  const pointerUp: PointerEventHandler<HTMLDivElement> = e => {
    if (!(trackRef.current?.hasPointerCapture(e.pointerId))) {
      return
    }
    const v = orientation === 'vertical' ? getY(e) : getX(e)
    slider.spring.set(v)
    slider.onRelease()
  }
  const pointerMove: PointerEventHandler<HTMLDivElement> = e => {
    if ((trackRef.current?.hasPointerCapture && trackRef.current.hasPointerCapture(e.pointerId))) {
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
  return (
    <motion.div
      layoutId={layoutId ? layoutId + '_track' : undefined}
      className={'relative cursor-pointer ' + trackClass}
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
        layoutId={layoutId ? layoutId + '_info' : undefined}
        className='absolute select-none pointer-action-none '
        style={infoStyle}
      >
        <div ref={childRef}>
          {children}
        </div>
      </motion.div>
      <motion.div
        layoutId={layoutId ? layoutId + '_thumb' : undefined}
        className={'flex justify-center cursor-grab ' + thumbClass}
        style={thumbStyle}
        whileTap={{ scale: 1.1, opacity: 1.0 }}
        ref={thumbRef}
        onPointerDown={pointerDown}
        onDragStart={dragStart}
        dragConstraints={trackRef}
        role='slider'
        tabIndex={0}
      >
        <div
          className='select-none text-base-1 text-sm inline-block'
          style={{
            pointerEvents: 'none', // allow clicks to pass through
            touchAction: 'none',
            zIndex: 99,
            opacity: slider.opacity,
            transition: 'opacity 0.75s ease-out'
          }}>{slider.format}</div>
      </motion.div>
    </motion.div>
  )
}

const Slider = React.memo(SliderNoMemo)

type SliderInputProps = {
  orientation?: Orientation
  value:number
  onChange: (val:number) => void
  children?: ReactNode
  trackSize ?: number
  min ?: number
  max ?: number
  formatFunc ?: (v: number) => string
  scale ?: ScaleType
  layoutId ?: string
}
const SliderInput: FC<SliderInputProps> = ({
  value,
  onChange,
  orientation = 'vertical',
  trackSize = 192,
  min = 0,
  max = 1,
  formatFunc,
  scale,
  layoutId,
  children
}) => {
  const slider = useSlider({
    formatFunc,
    value,
    onChange,
    min,
    max,
    scale: scale || ScaleType.Linear
  })

  return (<Slider slider={slider} trackSize={trackSize} orientation={orientation} layoutId={layoutId} >
    {children}
  </Slider>
  )
}

export default SliderInput
