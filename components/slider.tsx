import { motion, useSpring, useTransform, useVelocity } from 'framer-motion'
import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  useState,
  PointerEventHandler,
  PointerEvent,
  RefObject,
  ReactNode
} from 'react'

export type Orientation = 'horizontal' | 'vertical'

export enum ScaleType {
  Linear,
  Log,
  Db50,
  Db60,
  Db70,
}

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
) =>
  scale === ScaleType.Log
    ? linear(min, max, pow4(val))
    : scale === ScaleType.Db50
      ? linear(min, max, db50(val))
      : scale === ScaleType.Db60
        ? linear(min, max, db60(val))
        : scale === ScaleType.Db70
          ? linear(min, max, db70(val))
          : linear(min, max, val)

export const scaleItInv = (
  min: number,
  max: number,
  scale: ScaleType,
  scaledVal: number
) =>
  scale === ScaleType.Log
    ? pow4Inv(linearInv(min, max, scaledVal))
    : scale === ScaleType.Db50
      ? db50Inv(linearInv(min, max, scaledVal))
      : scale === ScaleType.Db60
        ? db60Inv(linearInv(min, max, scaledVal))
        : scale === ScaleType.Db70
          ? db70Inv(linearInv(min, max, scaledVal))
          : linearInv(min, max, scaledVal)

const getDimensions =
  (orientation: Orientation) => (ref: RefObject<HTMLDivElement>) =>
    !ref.current
      ? 0
      : orientation === 'vertical'
        ? ref.current.offsetHeight
        : ref.current.offsetWidth

const transXY = (
  orientation: Orientation,
  trackRef: RefObject<HTMLDivElement>,
  thumbRef: RefObject<HTMLDivElement>
) => {
  const getDims = getDimensions(orientation)
  return (latest: number) =>
    orientation === 'vertical'
      ? -1 * latest * (getDims(trackRef) - getDims(thumbRef))
      : latest * (getDims(trackRef) - getDims(thumbRef))
}

const getChildVal = (
  orientation: Orientation,
  trackRef: RefObject<HTMLDivElement>,
  childRef: RefObject<HTMLDivElement>
) => {
  const getDims = getDimensions(orientation)
  return orientation === 'vertical'
    ? (latest: number) =>
        latest < 0.50001 ? 0 : getDims(trackRef) - getDims(childRef)
    : (latest: number) =>
        latest < 0.50001 ? getDims(trackRef) - getDims(childRef) : 0
}

export type SpringOpts = {
  stiffness: number
  damping: number
  mass: number
}

type SliderProps = {
  orientation?: Orientation
  value: number
  onChange: (val: number) => void
  children?: ReactNode
  min?: number
  max?: number
  formatFunc?: (v: number) => string
  scale?: ScaleType
  // layoutId?: string
  springOpts?: SpringOpts
}
export const DefaultSpringOpts = {
  stiffness: 100,
  damping: 45,
  mass: 0.9
}
const Slider: FC<SliderProps> = ({
  onChange,
  value = 0,
  min = 0,
  max = 1.0,
  scale = ScaleType.Linear,
  orientation = 'vertical',
  springOpts = DefaultSpringOpts,
  formatFunc = (v: number) => v.toFixed(2),
  children
}) => {
  // we do this to in order to cause redraw.
  // we want redraw because the first time we render we don't know the size of the track
  // we need to re-render to get the size and set the xy transform correctly
  const [opacity, setOpacity] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)
  const pressed = useRef(false)
  const defVal = scaleItInv(min, max, scale, value)
  const sopts = useRef({
    stiffness: springOpts.stiffness,
    damping: springOpts.damping,
    mass: springOpts.mass
  })
  const spring = useSpring(defVal, sopts.current)
  const vel = useVelocity(spring)
  const posInThumb = useRef({ left: 0, top: 0 })
  const trackRect = useRef({ left: 0, top: 0 })

  const xy = useTransform(spring, transXY(orientation, trackRef, thumbRef))

  const scalar = useCallback(
    (newVal: number) => scaleIt(min, max, scale, newVal),
    [min, max, scale]
  )

  const outVal = useTransform(spring, scalar)

  const childVal = useTransform(
    spring,
    getChildVal(orientation, trackRef, childRef)
  )
  const infoStyle =
    orientation === 'vertical' ? { y: childVal } : { x: childVal }

  const trackClass =
    'cursor-pointer inline-block rounded border border-write-1 relative overflow-hidden ' +
    (orientation === 'vertical'
      ? 'bg-gradient-to-t from-base-1/25 via-base-3/25 to-base-2/50 h-full w-14 '
      : 'bg-gradient-to-r from-base-1/25 via-base-3/25 to-base-2/25 w-full h-14 flex flex-col place-content-center')

  const thumbClass =
    'bg-write-1 rounded text-base-2 text-sm absolute left-0 bottom-0 rounded cursor-grab select-none pointer-action-none flex p-1 ' +
    (orientation === 'vertical'
      ? ' w-full h-20 place-content-center place-items-center'
      : ' h-full w-20 place-content-center place-items-center ')

  const thumbStyle = {
    y: orientation === 'vertical' ? xy : undefined,
    x: orientation === 'horizontal' ? xy : undefined,
    scale: 0.9,
    opacity
  }

  useEffect(() => {
    // set on load to get re-render started
    setOpacity(0.8)
  }, [])

  useEffect(() => {
    sopts.current = {
      stiffness: springOpts.stiffness,
      damping: springOpts.damping,
      mass: springOpts.mass
    }
  }, [springOpts])

  useEffect(() => {
    return outVal.onChange((v) =>
      window.requestAnimationFrame(() => (pressed.current ? onChange(v) : null))
    )
  }, [outVal, onChange])

  useEffect(() => {
    return vel.onChange((latestVelocity) => {
      if (latestVelocity === 0) {
        window.requestAnimationFrame(() => (pressed.current = false))
      }
    })
  }, [vel, onChange])

  useEffect(() => {
    if (pressed.current === false) {
      const v = scaleItInv(min, max, scale, value)
      spring.set(v, false)
    }
  }, [value, spring, min, max, scale])

  const getX = (e: PointerEvent) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientX - trackRect.current.left - posInThumb.current.left // x position within the element.
      const w = trackRef.current?.offsetWidth - thumbRef.current?.offsetWidth
      const newpos = pos < 0 ? 0 : pos > w ? w : pos
      const xval = (w - newpos) / w
      return 1 - xval
    }
    return 0
  }

  const getY = (e: PointerEvent) => {
    if (trackRef.current && thumbRef.current) {
      const pos = e.clientY - trackRect.current.top - posInThumb.current.top
      const h = trackRef.current.offsetHeight - thumbRef.current.offsetHeight
      const newpos = pos < 0 ? 0 : pos > h ? h : pos
      const yval = (h - newpos) / h
      return yval
    }
    return 0
  }
  const pointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // set the capture pointer
    pressed.current = true
    trackRef.current?.setPointerCapture(e.pointerId)
    // save bounding rect here so we aren't updating while moving
    trackRect.current = trackRef.current?.getBoundingClientRect() || {
      top: 0,
      left: 0
    }

    //  only save bounding rect for thumb here if we hit the thumb
    if (e.target === thumbRef.current) {
      const thumbRect = thumbRef.current?.getBoundingClientRect() || {
        top: 0,
        left: 0
      }
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
    const v = orientation === 'vertical' ? getY(e) : getX(e)
    spring.set(v)
  }

  const pointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      trackRef.current?.hasPointerCapture &&
      trackRef.current.hasPointerCapture(e.pointerId) &&
      pressed.current
    ) {
      const v = orientation === 'vertical' ? getY(e) : getX(e)
      spring.set(v)
    }
  }
  useEffect(() => {
    const onResize = () => {
      trackRect.current = trackRef.current?.getBoundingClientRect() || {
        top: 0,
        left: 0
      }
      const xyTmp = transXY(orientation, trackRef, thumbRef)(spring.get())
      // console.log('on resize', xyTmp, spring.get(), xy.get())
      xy.set(xyTmp)
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [orientation, xy, spring])
  /*
  // see https://javascript.info/pointer-events
  // need to prevent browser drag n drop
  const dragStart = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
   */

  return (
    <div
      role="slider"
      tabIndex={0}
      ref={trackRef}
      className={trackClass}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
    >
      <motion.div
        className={
          'absolute select-none pointer-action-none ' +
          (orientation === 'vertical'
            ? ' flex place-content-center w-full'
            : ' ')
        }
        style={infoStyle}
      >
        <div ref={childRef} className="p-1">
          {children}
        </div>
      </motion.div>

      <motion.div
        ref={thumbRef}
        className={thumbClass}
        dragConstraints={trackRef}
        dragElastic={1}
        whileTap={{
          scale: 1.025,
          opacity: 1
        }}
        style={thumbStyle}
      >
        {formatFunc(value)}
      </motion.div>
    </div>
  )
}

export const SliderInput = () => {
  const [vol, setVol] = useState(0)
  return <Slider onChange={setVol} value={vol} />
}
export default Slider
