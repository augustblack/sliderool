import React, { FC, useState } from 'react'
import {
  motion
} from 'framer-motion'

import Slider, { Orientation } from '../components/slider'
import { ScaleType } from '../components/sliderHook'
import { Toggle } from '../components/toggle'
import Button from '../components/button'
import Icons from '../components/icons'

const SendBus = () => {
  const [m, setM] = useState(false)
  const [b, setB] = useState(false)
  return (
    <div className='flex flex-row space-x-1 flex-none'>
      <Toggle
        description='send audio  to headphones'
        pressed={!m}
        Icon={Icons.Headset}
        size='24px'
        onClick={() => setM(i => !i)}
      />
      <Toggle
        description='send audio to broadcast'
        pressed={!b}
        Icon={Icons.Broadcast}
        size='24px'
        onClick={() => setB(i => !i)}
      />
      <div className='flex-grow'/>
      <Button kind='none' >
        <Icons.Clear size='24px' />
      </Button>
    </div>
  )
}

const text = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."

type ListProps = {
  withText ?: boolean
}

const List: FC<ListProps> = ({
  withText = false
}) => {
  return (
    <ul className='w-full space-y-1'>
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => <li key={i} className='p-4 rounded bg-gray-300' >{i} {withText ? text : '' } </li>)
      }
    </ul>
  )
}
type SProps = {
  trackSize?: number
  orientation?: Orientation
}
const S: FC<SProps> = ({
  trackSize = 192,
  orientation = 'vertical'
}) => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
  <Slider value={vol} onChange={setVol} formatFunc={formatFunc} min={0} max={1.5} scale={ScaleType.Log} trackSize={trackSize} orientation={orientation} >
    <div className='rounded w-12 flex justify-center'>vol</div>
  </Slider>
  )
}

const Alerts = () => {
  return (
    <motion.div
      className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 absolute left-0 top-0 w-screen h-screen bg-base-3'
      variants={{
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0 }
      }}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    >

      {/* left/top   */ }
      <div className='flex-shrink flex flex-col w-full sm:w-auto h-auto'>
        <SendBus />
        <div className='flex space-x-6 justify-center'>
          <S trackSize={216}/>
          <div className='flex flex-col space-y-2 '>
            <div className='flex flex-row space-x-6 justify-center'>
              <S trackSize={100} />
              <S trackSize={100} />
              <S trackSize={100} />
            </div>
            <S trackSize={200} orientation='horizontal' />
            <S trackSize={200} orientation='horizontal' />
          </div>
        </div>
      </div>

      {/* right/bottom   */ }
      <div className='flex-grow flex flex-col w-full h-auto sm:h-full '>

        <div className='flex-shrink flex w-full p-2 space-x-1'>
          <input className='flex-grow'/>
          <button>submit</button>
          <button>cancel</button>
        </div>

        <div className='flex-grow w-full bg-orange-200 p-1 overflow-y-auto h-24 '>
          <List withText={true} />
        </div>

        <div className='flex-grow w-full bg-yellow-200 p-1 overflow-y-auto h-24 '>
          <List />
        </div>

      </div>
    </motion.div>
  )
}

export default Alerts
