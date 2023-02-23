import React, { useState } from 'react'
import Slider, { ScaleType, SpringOpts, DefaultSpringOpts } from '../components/slider'
import { Button } from '../components'

const SliderGroupWithOpts = () => {
  const [vol, setVol] = useState(0)
  const [pan, setPan] = useState(0)
  const [sopts, setSopts] = useState<SpringOpts>(DefaultSpringOpts)
  const setSlider = () => setVol(Math.random)

  const setStiffness = (stiffness: number) =>
    setSopts((so) => Object.assign({}, so, { stiffness }))

  const setDamping = (damping: number) =>
    setSopts((so) => Object.assign({}, so, { damping }))

  const setMass = (mass: number) => {
    setSopts((so) => Object.assign({}, so, { mass }))
  }
  const formatPan = (v: number) =>
    v >= 0 ? v.toFixed(2) + ' R' : 'L ' + Math.abs(v).toFixed(2)

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-400 p-4 rounded flex flex-row space-x-6 h-96 ">
      <Slider value={vol} onChange={setVol} min={0} max={2} springOpts={sopts}>
        <div>vol</div>
      </Slider>
      <div className="flex-none w-64 flex flex-col space-y-4 h-2/3">
        <Slider
          value={pan}
          onChange={setPan}
          orientation="horizontal"
          min={-1}
          max={1}
          formatFunc={formatPan}
        >
          <div>pan</div>
        </Slider>
        <div className="flex-grow w-full flex flex-row place-content-between">
          <Slider
            value={sopts.stiffness}
            onChange={setStiffness}
            min={0.0001}
            max={2000}
          />
          <Slider
            value={sopts.damping}
            onChange={setDamping}
            min={0.001}
            max={200}
          />
          <Slider value={sopts.mass} onChange={setMass} min={0} max={2} />
        </div>
      </div>
      <Button onClick={setSlider} label="Random" kind="plain"/>
    </div>
  )
}

const SliderGroup = () => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
    <div className='bg-gradient-to-b from-red-300 to-red-400 p-4 rounded flex flex-row space-x-6 h-96 w-96'>
      <div className='w-10 flex-none'>
        <Slider value={vol} onChange={setVol} formatFunc={formatFunc} min={0} max={1} scale={ScaleType.Log} trackWidth='sm' thumbSize='sm'>
          <div>vol</div>
          <div>hmm</div>
        </Slider>
      </div>
      <div className='flex-grow flex flex-col space-y-6 w-full'>
        <Slider value={vol} onChange={setVol} orientation='horizontal' trackWidth='sm' thumbSize='md'>
          <div className=''>vol</div>
          <div className=''>something</div>
        </Slider>
        <Slider value={vol} onChange={setVol} orientation='horizontal' >
          <div className=''>vol</div>
        </Slider>
      </div>
    </div>
  )
}

const Sliders = () => {
  return (
    <div className='flex flex-row bg-base-2 rounded p-2 lg:p-4 gap-2 overflow-x-auto w-full '>
      <SliderGroup />
      <SliderGroupWithOpts />
    </div>
  )
}

export default Sliders
