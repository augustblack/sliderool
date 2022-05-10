import { useEffect, useRef, useCallback, useState } from 'react'
import {
  MotionValue,
  // useVelocity,
  useSpring,
  useTransform
} from 'framer-motion'

export enum ScaleType {
  Linear,
  Log,
  Db50,
  Db60,
  Db70
}

const linear = (min:number, max:number, val:number) => val * (max - min) + min
// for some background on volume scaling:
// https://www.dr-lex.be/info-stuff/volumecontrols.html
const db50 = (val:number) => 3.1623e-3 * Math.exp(val * 5.757) // approx x^3
const db60 = (val:number) => 1e-3 * Math.exp(val * 6.908) // approx x^4
const db70 = (val:number) => 3.1623e-4 * Math.exp(val * 8.059) // approx x^5
const pow4 = (val:number) => Math.pow(val, 4)

const linearInv = (min:number, max:number, scaledVal:number) => (scaledVal - min) / (max - min)
const db70Inv = (scaledVal:number) => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 3.1623e-4) / Math.log(Math.exp(1))) / 8.059
const db60Inv = (scaledVal:number) => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 1e-3) / Math.log(Math.exp(1))) / 6.908
const db50Inv = (scaledVal:number) => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 3.1623e-3) / Math.log(Math.exp(1))) / 5.757

const pow4Inv = (scaledVal:number) => Math.pow(scaledVal, 0.25)

const scaleIt = (min:number, max:number, scale:ScaleType, val:number) => scale === ScaleType.Log
  ? linear(min, max, pow4(val))
  : scale === ScaleType.Db50
    ? linear(min, max, db50(val))
    : scale === ScaleType.Db60
      ? linear(min, max, db60(val))
      : scale === ScaleType.Db70
        ? linear(min, max, db70(val))
        : linear(min, max, val)

export const scaleItInv = (min:number, max:number, scale:ScaleType, scaledVal:number) => scale === ScaleType.Log
  ? pow4Inv(linearInv(min, max, scaledVal))
  : scale === ScaleType.Db50
    ? db50Inv(linearInv(min, max, scaledVal))
    : scale === ScaleType.Db60
      ? db60Inv(linearInv(min, max, scaledVal))
      : scale === ScaleType.Db70
        ? db70Inv(linearInv(min, max, scaledVal))
        : linearInv(min, max, scaledVal)

type UseSlider = {
  // mounted: boolean
  value: number
  min: number
  max: number
  scale: ScaleType
  onChange: (v:number) => void
  formatFunc ?: (v:number) => string
}
export type UseSliderReturn = {
  val: MotionValue
  spring: MotionValue
  format: string
  opacity: number
  onPress: () => void
  onRelease: () => void
}
const wtf = (v : number) => v.toFixed(2).toString()
export const useSlider = ({
  value,
  min,
  max,
  scale,
  onChange,
  formatFunc
} : UseSlider) : UseSliderReturn => {
  const [opacity, setOpacity] = useState<number>(0.25)
  const [format, setFormat] = useState<string>('')
  const inVal = useRef(scaleItInv(min, max, scale, value))
  const springVal = useSpring(inVal.current, { stiffness: 300, damping: 45, mass: 0.1 }) // set duration for length, duration: 3000 })
  const scalar = useCallback(newVal => scaleIt(min, max, scale, newVal), [min, max, scale])
  // we tried setting an opacity motion val based on the velocity of the spring
  // const formatOpacityV = useVelocity(springVal)
  // const formatOpacityV = useSpring(useVelocity(springVal), { stiffness: 300, damping: 45, mass: 0.1 }) // set duration for length, duration: 3000 })
  // const formatOpacity = useTransform(useTransform(formatOpacityV, Math.abs), [0, 0.2], [0.25, 1])

  const outVal = useTransform(springVal, scalar)
  // const formatVal = useTransform(outVal, formatFunc)

  const ff = useRef(formatFunc || wtf)

  const pressed = useRef(false)
  const sto = useRef<ReturnType<typeof setTimeout>>()
  const onPress = () => {
    if (sto.current) clearTimeout(sto.current)
    pressed.current = true
    setOpacity(0.9)
  }
  const onRelease = () => {
    pressed.current = true
    if (sto.current) clearTimeout(sto.current)
    sto.current = setTimeout(() => {
      pressed.current = false
      setOpacity(0.25)
    }, 250)
  }

  useEffect(() => {
    const unsubscribeVal = outVal.onChange(v => {
      if (pressed.current) {
        onChange(v)
      }
      setFormat(ff.current(v))
    })
    return () => unsubscribeVal()
  }, [outVal, onChange])

  useEffect(() => {
    if (pressed.current === false) {
      const v = scaleItInv(min, max, scale, value)
      springVal.set(v)
    }
  }, [value, max, min, scale, springVal])

  return {
    val: outVal,
    opacity,
    format,
    spring: springVal,
    onPress,
    onRelease
  }
}
