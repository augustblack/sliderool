import React, { FC, useState, useEffect, useRef, ReactNode } from 'react'
import type { NextPage } from 'next'
import {
  motion,
  MotionConfig,
  AnimatePresence,
  PanInfo,
  Reorder,
  useDragControls
} from 'framer-motion'
import { Icons, Toggle, Button, Slider, Orientation } from '../components/'

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export const SendBus = () => {
  const [m, setM] = useState(false)
  const [b, setB] = useState(false)
  return (
    <motion.div layout="position" className="flex flex-row space-x-1 flex-none">
      <Toggle
        description="send audio  to headphones"
        pressed={!m}
        Icon={Icons.Headset}
        size="24px"
        onClick={() => setM((i) => !i)}
      />
      <Toggle
        description="send audio to broadcast"
        pressed={!b}
        Icon={Icons.Broadcast}
        size="24px"
        onClick={() => setB((i) => !i)}
      />
      <div className="flex-grow" />
      <Button kind="none">
        <Icons.Clear size="24px" />
      </Button>
    </motion.div>
  )
}

export type SProps = {
  orientation?: Orientation
  layoutId?: string
}
const S: FC<SProps> = ({
  layoutId,
  orientation = 'vertical'
}) => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
    <Slider
      key={layoutId}
      value={vol}
      onChange={setVol}
      formatFunc={formatFunc}
      min={0}
      max={1.5}
      orientation={orientation}
    >
      <div className="rounded w-12 flex justify-center">vol</div>
    </Slider>
  )
}
const text =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."

type ListProps = {
  withText?: boolean
}

const List: FC<ListProps> = ({ withText = false }) => {
  return (
    <motion.ul layout="position" className="w-full space-y-1">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
        <li key={i} className="p-4 rounded bg-gray-300">
          {i} {withText ? text : ''}{' '}
        </li>
      ))}
    </motion.ul>
  )
}

type Track = {
  id: string
  kind: 'mic' | 'webaudio' | 'player'
  vol: number
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
    bg: 'bg-red-200'
  },
  {
    id: 'lajxxlf',
    kind: 'webaudio',
    vol: 0.16,
    bg: 'bg-orange-200'
  },
  {
    id: 'skkkso',
    kind: 'player',
    vol: 0.3,
    bg: 'bg-green-200'
  },
  {
    id: 'dkaooa',
    kind: 'player',
    vol: 1.3,
    bg: 'bg-yellow-200'
  },
  {
    id: '..sl1',
    kind: 'player',
    vol: 1.3,
    bg: 'bg-pink-400'
  },
  {
    id: 'alsiio',
    kind: 'player',
    vol: 1.3,
    bg: 'bg-slate-200'
  }
]

const tracksMap = new Map(tracks.map((t) => [t.id, t]))

type TrackViewProps = {
  className: string
  id: string
  isSel: boolean
  goUp: (id: string) => void
}

const TrackView: FC<TrackViewProps> = ({
  id,
  goUp
}) => {
  const dragControls = useDragControls()
  const onClick = () => {
    goUp(id)
  }

  return (
    <motion.div
      layout
      layoutId={`track_lt_${id}`}
      className="flex-shrink flex flex-col w-full sm:w-auto h-auto w-64"
    >
      <SendBus />
      <motion.div
        layout="position"
        layoutId={`track_l_${id}`}
        className="flex space-x-2 justify-center h-56"
      >
        <S layoutId={'vol' + id} />

        <div className="flex flex-col ">
          <div className="text-2xl flex w-full justify-center select-none">
            00:00
          </div>
          <div>
            <Icons.Play size="48px" />
          </div>
          <div>
            <Button onClick={onClick}>
              <Icons.List size="36px" />
            </Button>
          </div>
          <div className="flex-grow" />
          <div className="flex-none flex flex-row w-full">
            <div className={'flex-grow flex items-end justify-center pb-2'}>
              <Icons.DoubleArrow size="18px" fill="#374151" />{' '}
              {/* grey-700 */}
            </div>
            <div
              className={'flex-none'}
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <Icons.DragHandle size="36px" fill="#374151" /> {/* grey-700 */}
            </div>
          </div>
        </div>
        <div className="relative select-none h-56 w-3">
          <motion.div
            style={{
              rotate: 270,
              originX: 0,
              originY: 0.0,
              translateY: 220,
              translateX: -2
            }}
            className="absolute text-sm text-gray-700 truncate h-4 w-56 "
          >
            The Fucking Title of the Track
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

type Directions = 'L' | 'R' | 'D' | 'U'
type TrackFullProps = {
  className: string
  id: string
  direction: Directions
  goLeft: () => void
  goDown: () => void
  goRight: () => void
}

const TrackFull: FC<TrackFullProps> = ({
  className,
  id,
  direction,
  goLeft,
  goDown,
  goRight
}) => {
  const variants = {
    enter: (dir: Directions) => ({
      zIndex: 20,
      x: dir === 'L' ? '-100%' : dir === 'R' ? '100%' : 0
    }),
    exit: (dir: Directions) => ({
      transition: { delay: 0 },
      zIndex: 14,
      scale: 0.5,
      opacity: 0.2,
      x: dir === 'L' ? '100%' : dir === 'R' ? '-100%' : 0
    }),
    center: {
      zIndex: 30,
      scale: 1,
      x: 0
    }
  }
  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold) {
      goRight()
    } else if (swipe > swipeConfidenceThreshold) {
      goLeft()
    }
  }

  // className="flex-none flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 absolute top-0 w-full h-full bg-base-3"
  return (
    <motion.div
      layout
      layoutId={'track' + id}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      custom={direction}
      className={
        className + ' flex-none w-full h-full absolute top-0 overflow-hidden '
      }
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      onDragEnd={onDragEnd}
    >
      {/* left/top   */}
      <motion.div
        layoutId={`track_lt_${id}`}
        className="flex-grow flex flex-col w-full sm:w-auto h-auto"
        onDoubleClick={goDown}
      >
        <SendBus />
        <motion.div
          layoutId={`track_l_${id}`}
          className="flex space-x-2 justify-center h-56"
        >
          <S layoutId={'vol' + id} />
          <div className="flex flex-col space-y-2 ">
            <div className="flex-grow flex flex-row space-x-6 justify-center">
              <S />
              <S />
              <S />
            </div>
            <S orientation="horizontal" />
            <S orientation="horizontal" />
          </div>
        </motion.div>
      </motion.div>

      {/* right/bottom   */}
      <motion.div
        layoutId={`track_rb_${id}`}
        className={'flex-grow flex flex-col w-full h-auto sm:h-full '}
      >
        <div className="flex-shrink flex w-full p-2 space-x-1">
          <input className="flex-grow" />
          <button>submit</button>
          <button>cancel</button>
        </div>

        <div className="flex-grow w-full bg-orange-200 p-1 overflow-y-auto h-24 ">
          <List withText={true} />
        </div>

        <div className="flex-grow w-full bg-yellow-200 p-1 overflow-y-auto h-24 ">
          <List />
        </div>
      </motion.div>
    </motion.div>
  )
}
type ContainerProps = {
  selected: string | null
  tracksOrder: Array<string>
  setTracksOrder: (s: Array<string>) => void
  children: ReactNode

}
const Container: FC<ContainerProps> = ({
  selected,
  tracksOrder,
  setTracksOrder,
  children
}) => selected
  ? <motion.div
      key="container"
      layout
      layoutId="container"
      className={'flex-none flex flex-row w-full h-full space-x-0'}
    >{children}</motion.div>
  : <Reorder.Group
      as='div'
      layout
      key="container"
      layoutId="container"
      className='flex-none flex flex-row w-full space-x-1 relative overflow-x-auto'
      axis="x"
      values={tracksOrder}
      onReorder={setTracksOrder}
    >{children}</Reorder.Group>

const getLeftItem = (tracksOrder: Array<string>, id: string | null) => {
  const idx = tracksOrder.findIndex((tid) => tid === id) || 0
  const selected = idx - 1 < 0 ? tracksOrder.length - 1 : idx - 1
  return tracksOrder[selected]
}

const getRightItem = (tracksOrder: Array<string>, id: string | null) => {
  const idx = tracksOrder.findIndex((tid) => tid === id) || 0
  const selected = idx + 1 > tracksOrder.length - 1 ? 0 : idx + 1
  return tracksOrder[selected]
}

type HomeState = {
  selected: string | null
  dir: Directions
}
const Home: NextPage = () => {
  const [tracksOrder, setTracksOrder] = useState(
    Array.from(tracksMap).map(([id]) => id)
  )
  const [state, setState] = useState<HomeState>({ selected: null, dir: 'U' })
  const selOld = useRef<string | null>(null)

  useEffect(() => {
    selOld.current = state.selected
  }, [state.selected])

  const goLeft = () =>
    setState((s) => ({
      selected: getLeftItem(tracksOrder, s.selected),
      dir: 'L'
    }))
  const goRight = () =>
    setState((s) => ({
      selected: getRightItem(tracksOrder, s.selected),
      dir: 'R'
    }))
  const goUp = (id: string | null) =>
    setState({
      selected: id,
      dir: 'U'
    })

  const goDown = () => setState({ selected: null, dir: 'D' })
  return (
    <div className="w-full h-full flex flex-col flex-grow relative overflow-hidden">
      <MotionConfig transition={{ duration: 3, ease: 'easeOut', delay: 1 }}>
        <AnimatePresence custom={state.dir}>
          {state.selected
            ? (
              <TrackFull
                key={'blah' + state.selected}
                className={'rounded ' + tracksMap.get(state.selected)?.bg}
                id={state.selected}
                direction={state.dir}
                goLeft={goLeft}
                goDown={goDown}
                goRight={goRight}
              />
              )

            : <Reorder.Group
              as='div'
              layout
              key="container"
              layoutId="container"
              className='flex-none flex flex-row w-full space-x-1 relative overflow-x-auto'
              axis="x"
              values={tracksOrder}
              onReorder={setTracksOrder}
            >{
                tracksOrder.map((id) => (
                  <Reorder.Item
                    as='div'
                    layout
                    layoutId={'track' + id}
                    key={'blah' + id}
                    value={id}
                    className={
                      'rounded ' +
                      tracksMap.get(id)?.bg +
                      ' ' + 'flex-none h-full p-2 overflow-hidden'}
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                      transition: { duration: 2, ease: 'easeIn' }
                    }}
                  >
                    <TrackView
                      isSel={(selOld.current === id)}
                      className=''
                      id={id}
                      goUp={goUp}
                    />
                  </Reorder.Item>
                ))
              }
            </Reorder.Group>
          }
        </AnimatePresence>
      </MotionConfig>
    </div >
  )
}

export default Home
