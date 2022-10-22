import React, { useState } from 'react'
import Slider, { ScaleType } from '../components/slider'
import { PlaylistDnD, Playlist } from '../components/playlist'

const SliderGroup = () => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
    <div className='bg-gradient-to-b from-red-300 to-red-400 p-4 rounded flex flex-row space-x-6 h-64 w-96'>
      <div className='w-10 flex-none'>
        <Slider value={vol} onChange={setVol} formatFunc={formatFunc} min={0} max={1} scale={ScaleType.Log}>
          <div className=''>vol</div>
        </Slider>
      </div>
      <div className='flex-grow flex flex-col space-y-6 w-full'>
        <Slider value={vol} onChange={setVol} orientation='horizontal' >
          <div className='rounded w-12 flex justify-center'>vol</div>
        </Slider>
        <Slider value={vol} onChange={setVol} orientation='horizontal' >
          <div className='rounded w-12 flex justify-center'>vol</div>
        </Slider>
      </div>
    </div>
  )
}

const Sliders = () => {
  const [playlist, setPlaylist] = useState<Playlist>([
    {
      isQueued: true,
      hasBuffer: false,
      key: 'aldksjfa',
      uri: 'wtf',
      title: 'you there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldkalfdjas',
      uri: 'wtf2',
      title: 'you hellow there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'asldfjkallls',
      uri: 'wtsss',
      title: 'you brown there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldkxxlfdjas',
      uri: 'wtf2xx',
      title: 'you xxx there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldal',
      uri: 'wtf2',
      title: 'you hellow there'
    }

  ])
  const orderPlaylist = (p: Playlist) => setPlaylist(p)
  return (
    <div className='flex flex-col space-y-6 flex-grow'>
      <div className='flex flex-row bg-base-2 rounded p-4 space-x-2 overflow-x-auto  '>
        <SliderGroup />
        <SliderGroup />
        <SliderGroup />
        <SliderGroup />
        <SliderGroup />
        <SliderGroup />
      </div>
      { /* include this to check for layout bug in framer-motion
          that seems to happen when we use 'layout' on  motion.div
         */ }
      <PlaylistDnD
        playlist={playlist}
        orderPlaylist={orderPlaylist}
      />

    </div>
  )
}

export default Sliders
