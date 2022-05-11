import React, { useState } from 'react'
import Slider from '../components/slider'
import { ScaleType } from '../components/sliderHook'

const Sliders = () => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
    <div>
      <div className='flex flex-row bg-base-2 rounded p-4 space-x-2'>
        <div className='bg-gradient-to-b from-red-300 to-red-400 p-4 w-64 rounded flex flex-row'>
          <Slider value={vol} onChange={setVol} formatFunc={formatFunc} min={0} max={1.5} scale={ScaleType.Log}>
            <div className='rounded w-12 flex justify-center'>vol</div>
          </Slider>
          <Slider value={vol} onChange={setVol} orientation='horizontal' trackSize={150} >
            <div className='rounded w-12 flex justify-center'>vol</div>
          </Slider>
        </div>
      </div>
    </div>
  )
}
/*
const Sliders = () => {
  const [vol, setVol] = useState(0)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  console.log('sliders')

  const volSlider = useSlider({
    mounted: mounted.current,
    value: vol,
    onChange: setVol,
    min: 0,
    max: 1.3,
    scale: ScaleType.Log
  })

  return (
    <div>
      <div className='flex flex-row bg-base-2 rounded p-4 space-x-2'>
        <div className='bg-gradient-to-b from-red-300 to-red-400 p-4 w-64 rounded'>
          <Slider slider={volSlider} trackSize={220} >
            <div className='rounded w-12 flex justify-center'>vol</div>
          </Slider>
        </div>
        <div className='flex flex-col space-y-2'>
          <Slider slider={volSlider} trackSize={220} orientation='horizontal' >
            <div className='rounded w-12 flex justify-center'>volH</div>
          </Slider>
          <Slider slider={volSlider} trackSize={120} orientation='horizontal' >
            <div className='rounded w-12 flex justify-center'>volH2</div>
          </Slider>
        </div>
      </div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <ModalButtonWithClose buttonProps={{ label: 'plain modal', kind: 'plain' }}>
          <div className='flex flex-row bg-base-2 rounded p-4 space-x-2' style={{ zIndex: 99 }}>
            <div className='bg-gradient-to-b from-gray-300 to-gray-400 p-4 w-64 rounded'>
              <Slider slider={volSlider} trackSize={220} >
                <div className='rounded w-12 flex justify-center'>vol</div>
              </Slider>
            </div>
            <div className='flex flex-col space-y-2'>
              <Slider slider={volSlider} trackSize={220} orientation='horizontal' >
                <div className='rounded w-12 flex justify-center'>volH</div>
              </Slider>
              <Slider slider={volSlider} trackSize={120} orientation='horizontal' >
                <div className='rounded w-12 flex justify-center'>volH2</div>
              </Slider>
            </div>
          </div>
        </ModalButtonWithClose>

      </div>
    </div>
  )
}
 */

export default React.memo(Sliders)
