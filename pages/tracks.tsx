import React, { FC, ReactNode, useState } from 'react'
import {
  DragControls,
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
  Toggle,
  Icons
} from '../components/'

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
      <div className='flex-grow' />
      <Button kind='none' >
        <Icons.Clear size='24px' />
      </Button>
    </div>
  )
}

const text = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."

type ListProps = {
  withText?: boolean
}

const List: FC<ListProps> = ({
  withText = false
}) => {
  return (
    <ul className='w-full space-y-1'>
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => <li key={i} className='p-4 rounded bg-gray-300' >{i} {withText ? text : ''} </li>)
      }
    </ul>
  )
}

type SProps = {
  orientation?: Orientation
  layoutId?: string
}
const S: FC<SProps> = ({
  orientation = 'vertical'
}) => {
  const [vol, setVol] = useState(0)
  const formatFunc = (v: number) => v.toFixed(2).toString()
  return (
    <Slider value={vol} onChange={setVol} formatFunc={formatFunc} min={0} max={1.5} orientation={orientation} >
      <div className='rounded w-12 flex justify-center'>vol</div>
    </Slider>
  )
}

type SmallShellContainerProps = {
  id: string
  children: ReactNode
  dragControls?: DragControls
}

type ShellContainerProps = SmallShellContainerProps & {
  big: boolean
}

const SmallContainer: FC<SmallShellContainerProps> = ({
  id,
  dragControls,
  children
}) => {
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={dragControls}
      className='flex flex-col sm:flex-row space-y-1 sm:space-y-0 space-x-0 sm:space-x-1 bg-base-2 rounded '
    >{children}</Reorder.Item>
  )
}

export const ShellContainer: FC<ShellContainerProps> = ({
  id,
  big,
  dragControls,
  children
}) => big
  ? (
    <motion.div
        layoutId={`track_${id}`}
        className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 absolute left-0 w-full h-screen md:w-full bg-base-3'
      >{children}</motion.div>
    )
  : (
    <SmallContainer id={id} dragControls={dragControls}>{children}</SmallContainer>
    )

type TrackShellProps = {
  id: string
  big: boolean
  dragControls?: DragControls
  controls: ReactNode
  content: ReactNode
}

export const TrackShell: FC<TrackShellProps> = ({
  id,
  big,
  dragControls,
  controls,
  content
}) => {
  return (
    <ShellContainer id={id} big={big} dragControls={dragControls}>

      {/* left/top   */}
      <motion.div layoutId={`track_lt_${id}`} className='flex-shrink flex flex-col w-full sm:w-auto h-auto'>
        <SendBus />
        <motion.div layoutId={`track_l_${id}`} className='flex space-x-2 justify-center'>
          <S layoutId={id} />
          {
            controls
          }
        </motion.div>
      </motion.div>

      {/* right/bottom   */}
      <motion.div
        layoutId={`track_rb_${id}`}
        className={big
          ? 'flex-grow flex flex-col w-full h-auto sm:h-full '
          : 'flex-grow flex flex-col w-full h-auto sm:h-full '
        }
      >
        {
          content
        }
      </motion.div>
    </ShellContainer>
  )
}
type TrackProps = {
  id: string
  onSelect: () => void
}
export const TrackBig: FC<TrackProps> = ({
  id,
  onSelect
}) => {
  return (
    <TrackShell
      id={id}
      big={true}
      controls={
        <div className='flex flex-col space-y-2 '>
          <div className='flex flex-row space-x-6 justify-center'>
            <S />
            <S />
            <S />
          </div>
          <S orientation='horizontal' />
          <S orientation='horizontal' />
        </div>
      }
      content={
        <>
          <div className='flex-shrink flex w-full p-2 space-x-1'>
            <input className='flex-grow' />
            <button onClick={onSelect} >submit</button>
            <button>cancel</button>
          </div>

          <div className='flex-grow w-full bg-orange-200 p-1 overflow-y-auto h-24 '>
            <List withText={true} />
          </div>

          <div className='flex-grow w-full bg-yellow-200 p-1 overflow-y-auto h-24 '>
            <List />
          </div>
        </>
      }
    />
  )
}

export const TrackSmall: FC<TrackProps> = ({
  id,
  onSelect
}) => {
  const dragControls = useDragControls()
  return (
    <TrackShell
      id={id}
      big={false}
      dragControls={dragControls}
      controls={
        <>
          <div className='flex flex-col '>
            <div className='text-2xl flex w-full justify-center'>00:00</div>
            <div><Icons.Play size='48px' /></div>
            <div >
              <Button onClick={onSelect}><Icons.List size='36px' /></Button>
            </div>
            <div className='flex-grow' />
            <div className='flex-none flex flex-row w-full' >
              <div className={'flex-grow flex items-end justify-center pb-2'}>
                <Icons.DoubleArrow size='18px' fill='#374151' /> {/* grey-700 */}
              </div>
              <div
                className={'flex-none'}
                style={{ touchAction: 'none' }}
                onPointerDown={(e) => dragControls.start(e)}
              >
                <Icons.DragHandle size='36px' fill='#374151' /> {/* grey-700 */}
              </div>
            </div>
          </div>
          <div className='relative select-none h-56 w-3'>
            <motion.div
              style={{ rotate: 270, originX: 0, originY: 0.0, translateY: 220, translateX: -2 }}
              className='absolute text-sm text-gray-700 truncate h-4 w-56 '
            >
              The Fucking Title of the Track
            </motion.div>
          </div>

        </>
      }
      content={null}
    />
  )
}
export const Tracks = () => {
  const [tracksOrder, setTracksOrder] = useState(['one', 'two', 'three', 'four', 'five'])
  const [selectedTrack, setSelectedTrack] = React.useState<string | null>(null)
  return (
    <div className="flex flex-row space-x-2 h-auto w-96 overflow-x-auto">
      <MotionConfig
        transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
      >
        <AnimatePresence>
          <Reorder.Group
            layoutId='tracksGroup'
            layoutScroll
            axis="x"
            className={'flex w-full overflow-x-auto select-none ' + (selectedTrack ? '' : 'space-x-1 lg:space-x-2')}
            values={tracksOrder}
            onReorder={setTracksOrder}
          >
            {
              tracksOrder.map(id => (
                <TrackSmall
                  key={id}
                  id={id}
                  onSelect={() => setSelectedTrack(id)}
                />
              ))
            }
          </Reorder.Group>
          {selectedTrack && (
            <TrackBig
              id={selectedTrack}
              onSelect={() => setSelectedTrack(null)}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  )
}

export default Tracks
