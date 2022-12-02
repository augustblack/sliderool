import React from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
// import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Swiper from '../components/swiper'

type Img = {
  src: string
  description: string
  position ?: string
}
type Track = {
  id: string,
  kind: 'mic' | 'webaudio' | 'player'
  vol: number
  img ?: Img
  bg: string
}

const tracks: Array<Track> = [
  {
    id: 'lajdlf',
    kind: 'mic',
    vol: 0.6,
    bg: 'bg-blue-200'
  },
  {
    id: 'jkfaso',
    kind: 'player',
    vol: 2,
    img: {
      src: 'https://unsplash.com/photos/1527pjeb6jg/download?force=true&w=640',
      description: 'mountain'
    },
    bg: 'bg-red-200'
  },
  {
    id: 'lajdlf',
    kind: 'webaudio',
    vol: 0.16,
    bg: 'bg-orange-200'
  },
  {
    id: 'skkkso',
    kind: 'player',
    vol: 0.3,
    img: {
      src: 'https://unsplash.com/photos/XIVDN9cxOVc/download?force=true&w=640',
      description: 'hacker'
    },
    bg: 'bg-green-200'
  },
  {
    id: 'dkaooa',
    kind: 'player',
    vol: 1.3,
    bg: 'bg-yellow-200'
  }
]
const Home: NextPage = () => {
  return (
    <div className='w-full h-full bg-red-100 flex flex-row'>
      <div className='flex-grow' />
      <div className='w-full md:w-5/6 lg:w-3/4 h-full bg-blue-100'>
        <Swiper length={tracks.length}>
          {({ wrappedIdx }) => {
            const t = tracks[wrappedIdx]
            return (
              <div key={t.id} className={'w-full h-full ' + t.bg + ' relative items-center justify-center'}>
              {t.img && <Image
                className='object-cover'
                draggable={false}
                src={t.img.src}
                alt={t.img.description}
                // placeholder='blur'
                fill={true}
                style={{
                  objectPosition: t.img.position || 'center'
                }}
              />
              }
              </div>
            )
          }}
        </Swiper>
      </div>
      <div className='flex-grow' />
    </div>
  )
}

export default Home
