import React, { useState } from 'react'
import {
  Slider,
  ModalWithClose
} from '../components/index'
import { useSlider, ScaleType } from '../components/sliderHook'

const Sliders = () => {
  const [vol, setVol] = useState(0)
  const [showOne, setShowOne] = useState(false)
  const setV = (v:number) => setVol(v)
  const volSlider = useSlider({
    value: vol,
    onChange: setV,
    min: 0,
    max: 1.3,
    scale: ScaleType.Log
  })

  return (
    <div>
      <div className='flex flex-row bg-base-2 rounded p-4 space-x-2'>
        <Slider slider={volSlider} trackSize={220} >
          <div className='rounded w-12 flex justify-center'>vol</div>
        </Slider>
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
        <ModalWithClose open={showOne} setOpen={setShowOne} buttonProps={{ label: 'plain modal', kind: 'plain' }}>
          <div className='flex flex-row bg-base-2 rounded p-4 space-x-2 z-[100]'>
            <Slider slider={volSlider} trackSize={220} >
              <div className='rounded w-12 flex justify-center'>vol</div>
            </Slider>
            <div className='flex flex-col space-y-2'>
              <Slider slider={volSlider} trackSize={220} orientation='horizontal' >
                <div className='rounded w-12 flex justify-center'>volH</div>
              </Slider>
              <Slider slider={volSlider} trackSize={120} orientation='horizontal' >
                <div className='rounded w-12 flex justify-center'>volH2</div>
              </Slider>
            </div>
          </div>
        </ModalWithClose>

      </div>
    </div>
  )
}

export default Sliders
