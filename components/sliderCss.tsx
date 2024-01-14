import React, { useRef, useEffect } from 'react'
import { Colors, baseRingClass } from './utils'

// see for ideas https://ariya.io/2013/11/javascript-kinetic-scrolling-part-2

export enum ScaleType {
  Linear,
  Log,
  Db50,
  Db60,
  Db70,
}

const clamp = (min: number, max: number) => (num: number) => num <= min
  ? min
  : num >= max
    ? max
    : num

const linear = (min: number, max: number, val: number) =>
  val * (max - min) + min
// for some background on volume scaling:
// https://www.dr-lex.be/info-stuff/volumecontrols.html
const db50 = (val: number) => 3.1623e-3 * Math.exp(val * 5.757) // approx x^3
const db60 = (val: number) => 1e-3 * Math.exp(val * 6.908) // approx x^4
const db70 = (val: number) => 3.1623e-4 * Math.exp(val * 8.059) // approx x^5
const pow4 = (val: number) => Math.pow(val, 4)

const linearInv = (min: number, max: number, scaledVal: number) =>
  (scaledVal - min) / (max - min)
const db70Inv = (scaledVal: number) =>
  scaledVal === 0
    ? 0
    : Math.log(scaledVal / 3.1623e-4) / Math.log(Math.exp(1)) / 8.059
const db60Inv = (scaledVal: number) =>
  scaledVal === 0
    ? 0
    : Math.log(scaledVal / 1e-3) / Math.log(Math.exp(1)) / 6.908
const db50Inv = (scaledVal: number) =>
  scaledVal === 0
    ? 0
    : Math.log(scaledVal / 3.1623e-3) / Math.log(Math.exp(1)) / 5.757

const pow4Inv = (scaledVal: number) => Math.pow(scaledVal, 0.25)

export const scaleIt = (
  min: number,
  max: number,
  scale: ScaleType,
  val: number
) => clamp(min, max)(
  scale === ScaleType.Log
    ? linear(min, max, pow4(val))
    : scale === ScaleType.Db50
      ? linear(min, max, db50(val))
      : scale === ScaleType.Db60
        ? linear(min, max, db60(val))
        : scale === ScaleType.Db70
          ? linear(min, max, db70(val))
          : linear(min, max, val)
)

export const scaleItInv = (
  min: number,
  max: number,
  scale: ScaleType,
  scaledVal: number
) => clamp(0, 1)(
  scale === ScaleType.Log
    ? pow4Inv(linearInv(min, max, scaledVal))
    : scale === ScaleType.Db50
      ? db50Inv(linearInv(min, max, scaledVal))
      : scale === ScaleType.Db60
        ? db60Inv(linearInv(min, max, scaledVal))
        : scale === ScaleType.Db70
          ? db70Inv(linearInv(min, max, scaledVal))
          : linearInv(min, max, scaledVal)
)


export type Orientation = 'vertical' | 'horizontal'

const getChildStyle = (
  orientation: Orientation,
  latest: number
): React.CSSProperties => {
  return orientation === 'vertical'
    ? latest < 0.50001
      ? { flexDirection: 'column', placeContent: 'start' }
      : { flexDirection: 'column-reverse', placeContent: 'end' }
    : latest < 0.50001
      ? { flexDirection: 'row-reverse', placeContent: 'end' }
      : { flexDirection: 'row', placeContent: 'start' }
}

export type ThumbSize = 'sm' | 'md' | 'lg'

const ThumbSize: Record<Orientation, Record<ThumbSize, string>> = {
  "vertical": {
    'sm': 'h-12',
    'md': 'h-14',
    'lg': 'h-16'
  },
  "horizontal": {
    'sm': 'w-14',
    'md': 'w-20',
    'lg': 'w-24'
  }
}

const TrackWidth: Record<Orientation, Record<ThumbSize, string>> = {
  "vertical": {
    'sm': 'w-10',
    'md': 'w-14',
    'lg': 'w-20'
  },
  "horizontal": {
    'sm': 'h-10',
    'md': 'h-14',
    'lg': 'h-18'
  }
}

type SliderProps = {
  orientation?: Orientation
  value: number
  onChange: (val: number) => void
  children?: React.ReactNode
  min?: number
  max?: number
  formatFunc?: (v: number) => string
  scale?: ScaleType
  trackWidth?: ThumbSize
  thumbSize?: ThumbSize
  colors?: Colors
}

export const Slider: React.FC<SliderProps> = ({
  onChange,
  value,
  min = 0,
  max = 1,
  scale = ScaleType.Linear,
  orientation = 'vertical',
  formatFunc = (v) => v.toFixed(3),
  trackWidth = 'md',
  thumbSize = 'md',
  colors = { track: "bg-gradient-to-t from-base-1 to-base-3", thumb: "bg-base-con text-base-1" },
  children
}) => {
  // const [value, setValue] = useState<number>(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const posInThumb = useRef({ left: 0, top: 0 })
  const trackRect = useRef({ left: 0, top: 0 })
  const lastpos = useRef(0)
  const localVal = useRef(value)
  const delta = useRef(0)
  const pressed = useRef(false)
  const done = useRef(true)

  const getX = (e: React.PointerEvent, delta?: number) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientX - trackRect.current.left - posInThumb.current.left + (delta ? delta * delta * delta : 0)
      const w = trackRef.current?.offsetWidth - thumbRef.current?.offsetWidth
      const newpos = pos < 0 ? 0 : pos > w ? w : pos
      const xval = (w - newpos) / w
      return 1 - xval
    }
    return 0
  }

  const getY = (e: React.PointerEvent, delta?: number) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientY - trackRect.current.top - posInThumb.current.top + (delta ? delta * delta * delta : 0)
      const h = trackRef.current.offsetHeight - thumbRef.current.offsetHeight
      const newpos = pos < 0 ? 0 : pos > h ? h : pos
      const yval = (h - newpos) / h
      return yval
    }
    return 0
  }

  const pointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!trackRef.current || !thumbRef.current) return
    const tr = trackRef.current
    tr.setPointerCapture(e.pointerId)
    pressed.current = true
    // save bounding rect here so we aren't updating while moving
    trackRect.current = tr.getBoundingClientRect()

    thumbRef.current.style.transitionProperty = "transform"
    //  only save bounding rect for thumb here if we hit the thumb
    if (e.target === thumbRef.current) {
      const thumbRect = thumbRef.current.getBoundingClientRect() || {
        top: 0,
        left: 0
      }
      posInThumb.current = {
        top: e.clientY - thumbRect.top,
        left: e.clientX - thumbRect.left
      }
      thumbRef.current.style.transitionTimingFunction = "cubic-bezier(0.390, 0.575, 0.565, 1.000)" //"ease-out"
      thumbRef.current.style.transitionDuration = "750ms"
    } else if (thumbRef.current) {
      posInThumb.current = {
        top: 0,
        left: 0
      }
      thumbRef.current.style.transitionTimingFunction = "ease-in-out"
      thumbRef.current.style.transitionDuration = "2s"
    }
  }

  const pointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      thumbRef.current &&
      trackRef.current?.hasPointerCapture &&
      trackRef.current.hasPointerCapture(e.pointerId)
    ) {
      thumbRef.current.style.transitionProperty = "transform"
      delta.current = e.clientY - lastpos.current
      lastpos.current = e.clientY

      const v = orientation === 'vertical' ? getY(e) : getX(e)
      const pos = orientation === 'vertical'
        ? -1 * v * (trackRef.current.offsetHeight - thumbRef.current.offsetHeight)
        : v * (trackRef.current.offsetWidth - thumbRef.current.offsetWidth)

      thumbRef.current.style.transform = orientation === 'vertical'
        ? `translateY(${pos}px)`
        : `translateX(${pos}px)`
    }
  }

  const pointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      thumbRef.current &&
      trackRef.current?.hasPointerCapture &&
      trackRef.current.hasPointerCapture(e.pointerId)
    ) {
      const { top, left } = posInThumb.current
      if (top === 0 && left === 0) {
        // if we didn't pointerDown on the thumb, then no delta
        delta.current = 0
      }

      const v = orientation === 'vertical' ? getY(e, delta.current) : getX(e, delta.current)
      const pos = orientation === 'vertical'
        ? -1 * v * (trackRef.current.offsetHeight - thumbRef.current.offsetHeight)
        : v * (trackRef.current.offsetWidth - thumbRef.current.offsetWidth)

      thumbRef.current.style.transform = orientation === 'vertical'
        ? `translateY(${pos}px)`
        : `translateX(${pos}px)`
      trackRef.current.releasePointerCapture(e.pointerId)
    }
    pressed.current = false
  }

  useEffect(() => {
    if (!trackRef.current || !thumbRef.current) return
    const thr = thumbRef.current
    const trk = trackRef.current
    const resizeObserver = new ResizeObserver(() => {
      trackRect.current = trk.getBoundingClientRect()
      const pos = orientation === 'vertical'
        ? -1 * localVal.current * (trk.offsetHeight - thr.offsetHeight)
        : localVal.current * (trk.offsetWidth - thr.offsetWidth)
      console.log('resize', localVal.current, pos, trk.offsetHeight, thr.offsetHeight)
      done.current = true
      thr.style.transitionProperty = "none"
      thr.style.transform = orientation === 'vertical'
        ? `translateY(${pos}px)`
        : `translateX(${pos}px)`
    })
    resizeObserver.observe(trk)
    return () => {
      resizeObserver.unobserve(trk)
    }
  }, [orientation])

  useEffect(() => {
    if (done.current && !pressed.current && trackRef.current && thumbRef.current) {
      const v = scaleItInv(min, max, scale, value)
      localVal.current = v
      const pos = orientation === 'vertical'
        ? -1 * v * (trackRef.current.offsetHeight - thumbRef.current.offsetHeight)
        : v * (trackRef.current.offsetWidth - thumbRef.current.offsetWidth)

      thumbRef.current.style.transitionProperty = "none"
      thumbRef.current.style.transform = orientation === 'vertical'
        ? `translateY(${pos}px)`
        : `translateX(${pos}px)`
    }
  }, [value, min, max, scale, orientation])

  useEffect(() => {

    if (!thumbRef.current) return
    if (!trackRef.current) return
    const thr = thumbRef.current
    const trk = trackRef.current

    let currentRequest: number
    let lasttime = 0
    const reqAnim = (timestamp: number) => {
      if (timestamp - lasttime > 10) {
        const track = trk.getBoundingClientRect()
        const thumb = thr.getBoundingClientRect()
        const v = orientation === 'vertical'
          ? 1 - ((thumb.top - track.top) / (trk.offsetHeight - thr.offsetHeight))
          : (thumb.left - track.left) / (trk.offsetWidth - thr.offsetWidth)
        localVal.current = v // always keep in range of 0-1
        onChange(scaleIt(min, max, scale, v))
        lasttime = timestamp
      }
      if (!done.current)
        currentRequest = window.requestAnimationFrame(reqAnim)
    }
    const onStart = () => {
      done.current = false
      if (currentRequest)
        cancelAnimationFrame(currentRequest)
      currentRequest = window.requestAnimationFrame(reqAnim)
    }

    const onEnd = () => {
      console.log('done')
      done.current = true
    }

    thr.addEventListener("transitionstart", onStart)
    thr.addEventListener("transitionend", onEnd)
    return () => {
      thr.removeEventListener("transitionstart", onStart)
      thr.removeEventListener("transitionend", onEnd)
    }

  }, [orientation, min, max, scale, onChange])

  const trackClass =
    'flex-none select-none pointer-action-none touch-none cursor-pointer rounded relative overflow-hidden ' +
    colors.track +
    (
      orientation === 'vertical'
        ? ' h-full ' + TrackWidth['vertical'][trackWidth]
        : ' w-full flex flex-col place-content-center ' + TrackWidth['horizontal'][trackWidth]
    )

  const thumbClass =
    ' rounded text-sm absolute left-0 bottom-0 rounded cursor-grab select-none pointer-action-none flex p-1 ' +
    colors.thumb +
    (
      orientation === 'vertical'
        ? ' w-full place-content-center place-items-center justify-center ' + ThumbSize['vertical'][thumbSize]
        : ' h-full place-content-center place-items-center ' + ThumbSize['horizontal'][thumbSize]
    )

  // https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
  return (
    <div
      ref={trackRef}
      className={trackClass}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
    >
      <div
        className='flex w-full h-full place-items-center gap-1 p-1'
        style={getChildStyle(orientation, scaleItInv(min, max, scale, value))}
      >
        {children}
      </div>
      <div
        ref={thumbRef}
        className={baseRingClass + thumbClass}
        style={{
          transitionProperty: 'transform',
          transitionDuration: '750ms',
          transitionTimingFunction: 'ease-out'
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuenow={value}
        aria-valuemax={max}
        aria-orientation={orientation}
        tabIndex={0}
      >{formatFunc(clamp(min, max)(value))}</div>
      <input type="number" className='hidden' defaultValue={value} />
    </div>
  )
}
