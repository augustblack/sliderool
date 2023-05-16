import React, { FC, useState } from 'react'
import {
  LayoutGroup,
  useDragControls,
  AnimatePresence,
  motion,
  MotionConfig,
  Reorder
} from 'framer-motion'
import {
  Slider,
  Orientation,
  Button,
  FToggle,
  Icons
} from '../components/'


type MenuKind = 'levels' | 'list' | 'search'

type SProps = {
  orientation?: Orientation
  label ?: string
  layoutId?: string
  size ?: 'sm' | 'md' | 'lg'
  thumbSize ?: 'sm' | 'md' | 'lg'
}
export const S: FC<SProps> = ({
  orientation = 'vertical',
  label = 'vol',
  size= 'md',
  thumbSize= 'md',
}) => {
  const [vol, setVol] = useState(0)
    const formatFunc = (v: number) => v.toFixed(2).toString()
    return (
      <Slider value={vol} onChange={setVol} trackWidth={size} thumbSize={thumbSize} formatFunc={formatFunc} min={0} max={1.5} orientation={orientation} >
        <div className='rounded w-12 flex justify-center'>{label}</div>
      </Slider>
   )
}
type SmProps = {
toggleBig : () => void
}

const Small: FC<SmProps> = ({
  toggleBig
}) => (
  <motion.div
    // initial={false}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    layout className='w-full h-full bg-pink-800 '>
    <Button onClick={toggleBig}><Icons.Play size='36px' /></Button>
    <Button onClick={toggleBig}><Icons.List size='36px' /></Button>
  </motion.div>
)

type TrackProps = {
  id: string
  big: Array<string>
  setBig: React.Dispatch<React.SetStateAction<Array<string>>>
}

type SendBusProps = TrackProps & {
  menu: MenuKind
  setMenu: React.Dispatch<React.SetStateAction<MenuKind>>
}

const SendBus: FC<SendBusProps> = ({
    id,
    big,
    setBig,
    menu,
    setMenu
}) => {
  const [m, setM] = useState(true)
  const [b, setB] = useState(true)
  const toggleBig = () => setBig(b => b.includes(id)
    ? b.filter(x => x !== id)
    : b.concat(id)
  )

  return (
    <motion.div layout className='flex flex-row gap-1 flex-none'>
      <FToggle
        layout
        className='flex-none'
        description='send audio  to headphones'
        pressed={!m}
        Icon={Icons.Headset}
        size='24px'
        onClick={() => setM(i => !i)}
      />
      <FToggle
        layout
        className='flex-none'
        description='send audio to broadcast'
        pressed={!b}
        Icon={Icons.Broadcast}
        size='24px'
        onClick={() => setB(i => !i)}
      />
      <motion.div layout className='flex-grow flex flex-row gap-5 justify-center' >
        { big.includes(id)
        ? (
          <>
            <div className={'rounded p-2 ' + (menu === 'levels' ? 'bg-blue-200': '' )} onClick={() => setMenu('levels')}>
              <Icons.Levels size='24px' />
            </div>
            <div className={'rounded p-2 ' + (menu === 'list' ? 'bg-blue-200': '' )} onClick={() => setMenu('list')}>
              <Icons.List size='24px' />
            </div>
            <div className={'rounded p-2 ' + (menu === 'search' ? 'bg-blue-200': '' )} onClick={() => setMenu('search')}>
              <Icons.Search size='24px' />
            </div>
          </>
        )
        :null
       }
      </motion.div>
      <motion.button layout onClick={toggleBig} className="flex-none">
        <Icons.Clear size='24px' />
      </motion.button>
    </motion.div>
  )
}

type BigType = {
  id: string
}
const Levels: FC<BigType> = ({
   id
}) => (
  <motion.div
    key={id + 'levels'}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    layout
    className='w-full h-full bg-pink-600 flex portrait:flex-col landscape:flex-row p-2 gap-2'
  >
    <motion.div layout className="flex flex-col gap-2 portrait:h-2/5 landscape:h-full place-content-between">
      <motion.div className="flex flex-row gap-2 h-full place-content-between">
        <S size='md' label='hi' />
        <S size='md' label='md' />
        <S size='md' label='lo' />
      </motion.div>
      <S size='md' thumbSize='sm' orientation='horizontal' label='pan' />
    </motion.div>
    <motion.div className="flex flex-col gap-2 w-full portrait:h-3/5 place-content-between ">
      <S size='md' thumbSize='sm' orientation='horizontal' label='speed'/>
      <motion.div className='w-full place-content-between'>
        the track title
      </motion.div>
      <motion.div className='w-full flex flex-row bg-blue-200 place-content-between'>
        <Icons.Prev size="36px" />
        <Icons.Stop size="36px" />
        <Icons.Play size="36px" />
        <Icons.Loop size="36px" />
        <Icons.Next size="36px" />
      </motion.div>
      <S size='md' thumbSize='sm' orientation='horizontal' label='time'/>
    </motion.div>
  </motion.div>
)

const Playlist: FC<BigType> = ({
   id
}) => (
  <motion.div
    key={id + 'levels'}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    layout className='w-full h-full bg-pink-600 flex flex-col p-2 gap-2'
  >
    <div className="flex-grow w-full overflow-y-auto h-24 flex flex-col gap-1 ">
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
    </div>
  </motion.div>
)
const Search: FC<BigType> = ({
   id
}) => (
  <motion.div
    key={id + 'levels'}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    layout
    className='w-full h-full bg-pink-600 flex flex-col p-2 gap-2 '
  >
    <div className="flex-grow w-full overflow-y-auto h-24 flex flex-col gap-1 ">
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
      <div className='rounded p-2 bg-gray-200' >one</div>
    </div>

  </motion.div>
)

type ControlsProps = {
  id: string
  menu: MenuKind
}
const Controls: FC<ControlsProps> = ({
   id,
   menu
}) => menu === 'levels'
  ? <Levels id={id} />
  : menu === 'list'
    ? <Playlist id={id} />
    : <Search id={id} />

export const Track: FC<TrackProps> = ({
  id,
  big,
  setBig
}) => {
  // const [big, setBig] = useState(false)
  const [menu, setMenu] = useState<MenuKind>('levels')
  const dragControls = useDragControls()
  const toggleBig = () => setBig(b => b.includes(id)
    ? b.filter(x => x !== id)
    : b.concat(id)
  )
  return (
    <motion.div
      //value={id}
      dragListener={false}
      layout
      // dragControls={dragControls}
      className={'snap-center flex flex-col flex-none gap-1 rounded bg-red-100 p-1 overflow-hidden ' +
        (big.includes(id) ? "w-full sm:w-3/4 md:w-2/3 xl:w-1/3" : "w-32") }
    >
      <SendBus
        key={id}
        id={id}
        big={big}
        setBig={setBig}
        menu={menu}
        setMenu={setMenu}
      />

      {/* bottom   */}
      <motion.div layout className='w-full h-full bg-green-400 flex flex-row '>
        <S thumbSize='lg'/>
        <motion.div layout className='flex-grow '>
          <AnimatePresence initial={false} mode="wait">
            { big.includes(id)
            ? <Controls id={id} menu={menu} />
            : <Small toggleBig={toggleBig} key={'small' + id} />
          }
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>

  )
}
export const Tracks = () => {
  const [tracksOrder, setTracksOrder] = useState(['one', 'two', 'three', 'four', 'five'])
  const [big, setBig] = useState<Array<string>>([])
  return (
    <div className="h-screen w-screen overscroll-contain flex flex-col">
      <MotionConfig transition={{ duration: 1, type: 'tween', ease: 'easeInOut' }}>
        <LayoutGroup>
          <motion.div
            layout
            layoutScroll
            className={'flex flex-row bg-green-100 w-full h-full select-none gap-2 overflow-x-auto snap-x snap-mandatory ' +
            (big.length ? "portrait:h-4/5 landscape:h-5/6 landscape:md:h-5/6 landscape:lg:h-3/5" : "portrait:h-1/3 landscape:h-2/3 landscape:lg:h-1/3") }
          >
            {
                tracksOrder.map(id => (
                  <Track
                  key={id}
                  id={id}
                  big={big}
                  setBig={setBig}
                />
              ))
            }
          </motion.div>
          <motion.div layout className="flex-grow flex portrait:flex-col landscape:flex-row-reverse bg-orange-200 w-full h-auto">
            <div className='bg-orange-400 portrait:w-full landscape:w-1/5 h-full' />
            <div className='bg-orange-600 portrait:w-full landscape:w-4/5 h-full'>chat</div>
          </motion.div>
        </LayoutGroup>
      </MotionConfig>
    </div>
  )
}


export default Tracks
