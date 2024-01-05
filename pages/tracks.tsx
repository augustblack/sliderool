import React, { FC, SetStateAction, useState } from 'react'
import { Configure } from './forms'
import {
  Slider,
  Switch,
  Button,
  Toggle,
  Icons
} from '../components/'
const ChatMiniView = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow p-2 rounded'>hello</div>
      <input className='bg-base-1 text-base-con p-2 rounded ring-0 ring-offset-0' placeholder='hello' />
    </div>
  )
}


const Broadcast = () => {
  return (
    <div className='w-20 flex gap-2'>
      <Button kind='plain' label='dark' onClick={() => { document.body.classList.remove('light'); document.body.classList.add('dark') }} />
      <Button kind='plain' label='light' onClick={() => { document.body.classList.remove('dark'); document.body.classList.add('light') }} />
    </div>
  )
}
type SendBusProps = {
  big: boolean,
  className: string,
  setBig: React.Dispatch<SetStateAction<boolean>>
  children: React.ReactNode
}
export const SendBus: FC<SendBusProps> = ({
  big,
  setBig,
  className,
  children
}) => {
  const [m, setM] = useState(false)
  const [b, setB] = useState(false)
  return (
    <div className='flex flex-row gap-1 flex-none'>
      <Toggle
        label='toggle sending audio to headphones'
        pressed={!m}
        Icon={Icons.Headset}
        size='24px'
        onClick={() => setM(m => !m)}
        className={className}
      />
      <Toggle
        label='toggle sending audio to broadcast'
        pressed={!b}
        Icon={Icons.Broadcast}
        size='24px'
        onClick={() => setB(b => !b)}
        className={className}
      />
      <div className='flex-grow flex flex-row gap-5 justify-center' >
        {big
          ? children
          : null
        }
      </div>
      <Button kind='none' onClick={() => setBig(b => !b)} className={className}>
        {big
          ? <Icons.ChevronLeft size='24px' />
          : <Icons.ChevronRight size='24px' />
        }
      </Button>
    </div>
  )
}

export const Tracks = () => {
  const [big, setBig] = useState(false)
  const [s1, setS1] = useState(0)
  const [sw1, setSW1] = useState(false)
  const [sw2, setSW2] = useState(false)
  const [sw3, setSW3] = useState(false)
  const pCol = { track: 'bg-player-con focus:ring-player-1', thumb: 'bg-player-1 focus:ring-player-con' }
  const mCol = { track: 'bg-mic-con focus:ring-mic-1 ', thumb: 'bg-mic-1 focus:ring-mic-con' }

  const mSCol = { track: "bg-gradient-to-t from-mic-1 to-mic-2 text-mic-con focus:ring-mic-con", thumb: "bg-mic-con text-mic-1" }
  const pSCol = { track: "bg-gradient-to-t from-player-1 to-player-2 text-player-con focus:ring-player-con", thumb: "bg-player-con text-player-1" }

  const fCol = {
    track: 'bg-player-1 autofill:bg-player-1 autofill:text-player-con text-player-con accent-player-con focus:ring-player-con',
    thumb: 'bg-player-con autofill:bg-player-con text-player-1 accent-player-1 focus:ring-player-1'
  }

  return (
    <div className="h-screen w-screen overscroll-contain flex flex-col gap-1 p-1 lg:gap-2 lg:p-2 bg-base-4">
      <div className='flex flex-row w-full select-none gap-1 md:gap-2 overflow-x-auto relative flex-grow'>

        <div className={"h-full rounded p-1 bg-gradient-to-b from-mic-2 to-mic-3 text-mic-con transition-all " + (big ? 'w-96' : 'w-48')}>
          <div className='flex flex-col w-full h-full'>
            <SendBus big={big} setBig={setBig} className="focus:ring-mic-con "><div>hello</div></SendBus>
            <div className='flex flex-row w-full flex-grow'>
              <Slider
                value={s1}
                onChange={setS1}
                colors={mSCol}
              />
              <Button kind="none" className="flex-grow ">
                <Icons.Mic size="54px" />
              </Button>
              {big &&
                <div className="flex-grow w-full flex gap-2">
                  <div className="flex flex-col gap-2">
                    <Switch colors={mCol} label='test' pressed={sw1} onClick={() => setSW1(s => !s)} />
                    <Switch colors={mCol} label='test' pressed={sw2} onClick={() => setSW2(s => !s)} />
                    <Switch colors={mCol} label='test' pressed={sw3} onClick={() => setSW3(s => !s)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="bg-mic-con text-mic-1 rounded p-1 px-2 hover:text-mic-con hover:bg-mic-1 focus:ring-mic-1"
                    >hello</Button>
                    <Button
                      className="bg-mic-con text-mic-1 rounded p-1 px-2 hover:text-mic-con hover:bg-mic-1 focus:ring-mic-1"
                    >goodbye</Button>

                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className={"h-full rounded p-1 bg-gradient-to-b from-player-1 to-player-2 text-player-con transition-all " + (big ? 'w-96' : 'w-48')}>
          <div className='flex flex-col w-full h-full'>
            <SendBus big={big} setBig={setBig} className="focus:ring-player-con "><div>hello</div></SendBus>
            <div className='flex flex-row flex-grow'>
              <Slider
                value={s1}
                onChange={setS1}
                colors={pSCol}
              />
              <Button kind="none" className="flex-grow">
                <Icons.Play size="54px" />
              </Button>
              {big &&
                <div className="flex-grow w-full rounded flex gap-2">
                  <div className="flex flex-col gap-2">
                    <Switch colors={pCol} label='test' pressed={sw1} onClick={() => setSW1(s => !s)} />
                    <Switch colors={pCol} label='test' pressed={sw2} onClick={() => setSW2(s => !s)} />
                    <Switch colors={pCol} label='test' pressed={sw3} onClick={() => setSW3(s => !s)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="bg-player-con text-player-1 rounded p-1 px-2 hover:text-player-con hover:bg-player-1"
                    >hello</Button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className={"h-full rounded p-1 bg-gradient-to-b from-player-1 to-player-2 text-player-con transition-all " + (big ? 'w-auto' : 'w-48')}>
          <div className='flex flex-col w-full h-full'>
            <SendBus big={big} setBig={setBig} className="focus:ring-player-con "><div>hello</div></SendBus>
            <div className='flex flex-row flex-grow'>
              <Slider
                value={s1}
                onChange={setS1}
                colors={pSCol}
              />
              <Button kind="none" className="flex-grow">
                <Icons.Play size="54px" />
              </Button>
              {big && <div className=""><Configure colors={fCol} /></div>
              }
            </div>
          </div>
        </div>

      </div>
      <div className={"transition-all duration-500 flex-grow flex portrait:flex-col w-full h-auto landscape:flex-row-reverse " +
        (big ? "portrait:h-2/5 landscape:h-1/6 landscape:md:h-1/6 landscape:lg:h-2/5" : "portrait:h-2/3 landscape:h-1/3 landscape:lg:h-2/3")}
      >
        <div className='portrait:h-1/5 w-full landscape:w-1/3 landscape:lg:w-1/5 overflow-y-auto' >
          <Broadcast />
        </div>

        <div className='portrait:h-4/5 w-full landscape:w-2/3 landscape:lg:w-4/5 rounded bg-base-3 p-1'>
          <ChatMiniView />
        </div>
      </div>
    </div >

  )
}


export default Tracks
