import { useEffect, useRef, useCallback } from 'react'
import {
  MotionValue,
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

const linear = (min, max, val) => val * (max - min) + min
// for some background on volume scaling:
// https://www.dr-lex.be/info-stuff/volumecontrols.html
const db50 = val => 3.1623e-3 * Math.exp(val * 5.757) // approx x^3
const db60 = val => 1e-3 * Math.exp(val * 6.908) // approx x^4
const db70 = val => 3.1623e-4 * Math.exp(val * 8.059) // approx x^5
const pow4 = val => Math.pow(val, 4)

const linearInv = (min, max, scaledVal) => (scaledVal - min) / (max - min)
const db70Inv = scaledVal => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 3.1623e-4) / Math.log(Math.exp(1))) / 8.059
const db60Inv = scaledVal => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 1e-3) / Math.log(Math.exp(1))) / 6.908
const db50Inv = scaledVal => scaledVal === 0
  ? 0
  : (Math.log(scaledVal / 3.1623e-3) / Math.log(Math.exp(1))) / 5.757

const pow4Inv = scaledVal => Math.pow(scaledVal, 0.25)

const scaleIt = (min, max, scale, val) => scale === ScaleType.Log
  ? linear(min, max, pow4(val))
  : scale === ScaleType.Db50
    ? linear(min, max, db50(val))
    : scale === ScaleType.Db60
      ? linear(min, max, db60(val))
      : scale === ScaleType.Db70
        ? linear(min, max, db70(val))
        : linear(min, max, val)

const scaleItInv = (min, max, scale, scaledVal) => scale === ScaleType.Log
  ? pow4Inv(linearInv(min, max, scaledVal))
  : scale === ScaleType.Db50
    ? db50Inv(linearInv(min, max, scaledVal))
    : scale === ScaleType.Db60
      ? db60Inv(linearInv(min, max, scaledVal))
      : scale === ScaleType.Db70
        ? db70Inv(linearInv(min, max, scaledVal))
        : linearInv(min, max, scaledVal)

type UseSlider = {
  value: number
  min: number
  max: number
  scale: ScaleType
  onChange: (v:number) => void
}
export type UseSliderReturn = {
  val: MotionValue
  spring: MotionValue
  onPress: () => void
  onRelease: () => void
}

export const useSlider = ({
  value,
  min,
  max,
  scale,
  onChange
} : UseSlider) : UseSliderReturn => {
  const inVal = scaleItInv(min, max, scale, value)
  const springVal = useSpring(inVal, { stiffness: 300, damping: 45, mass: 0.1 }) // set duration for length, duration: 3000 })
  const scalar = useCallback(newVal => scaleIt(min, max, scale, newVal), [min, max, scale])

  const outVal = useTransform(springVal, scalar)
  const pressed = useRef(false)
  const sto = useRef<ReturnType<typeof setTimeout>>()
  const onPress = () => {
    if (sto.current) clearTimeout(sto.current)
    pressed.current = true
  }
  const onRelease = () => {
    pressed.current = true
    if (sto.current) clearTimeout(sto.current)
    sto.current = setTimeout(() => {
      pressed.current = false
    }, 250)
  }
  useEffect(() => {
    const unsubscribeVal = outVal.onChange(v => pressed.current === true
      ? onChange(v)
      : null
    )
    return () => unsubscribeVal()
  }, [outVal, onChange])

  useEffect(() => {
    if (pressed.current === false) {
      const v = scaleItInv(min, max, scale, value)
      springVal.set(v)
    }
  }, [value, max, min, scale, springVal])

  return { val: outVal, spring: springVal, onPress, onRelease }
}
