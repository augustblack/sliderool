import React, { FC, useState, useRef, useEffect } from 'react'
// import * as R from 'ramda'
// import SearchSelector from './search'
import {
  AnimatePresence,
  motion,
  Reorder,
  // useMotionValue,
  DragControls,
  useDragControls
} from 'framer-motion'

import Icons from './icons'

type MediaBase = {
  uri: string
  type?: string // mime
  description?: string
  duration?: number // in seconds
  name?: string
  size?: number // in bytes
  title?: string
  artist?: string
  album?: string
  tags?: Array<string>
  tempTime?: number // for youtube, urls only last 6 hours
  tempUrl?: string // youtube temp url
  cors?: boolean // if we need to proxy the uri or not
}

export type Media = MediaBase & {
  key: string
  isQueued: boolean
  hasBuffer: boolean
}

export type Playlist = Array<Media>

type ItemProps = {
  media: Media
  onClick?: () => void
  onDelete?: () => void
  controls: DragControls
}
const Item: FC<ItemProps> = ({
  media,
  onClick = () => null,
  onDelete = () => null,
  controls
}: ItemProps) => {
  const textRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  // const downloadUri = useStore(state => state.downloadUri)

  const onDownloadClick = () => {
    // downloadUri(media.uri)
    setMenuOpen(false)
  }
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(mo => !mo)
  }

  useEffect(() => {
    const t = menuOpen
      ? setTimeout(() => setMenuOpen(false), 3000)
      : null
    return () => {
      if (t) {
        clearTimeout(t)
      }
    }
  }, [menuOpen])

  return (
    <>
      <div className='flex-none '>
        <AnimatePresence>
          {menuOpen &&
            <motion.div
              className='flex flex-row space-x-1 items-center rounded-l'
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 118 }}
              exit={{ opacity: 0, width: 0 }}
            >
              <div
                className={'flex-none rounded p-2 ml-1 ' + (media.hasBuffer ? 'bg-gray-200' : 'bg-green-200')}
                onPointerUp={onDownloadClick}
              >
                <Icons.Download size='32px' fill='#34D399' />
              </div>
              <div
                className="flex-none rounded p-2 bg-red-200"
                onPointerUp={onDelete}
              >
                <Icons.Delete size='32px' fill='#DC2626' />
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
      <div
        className='flex-none p-2'
        onClick={toggleMenu}>
        {
          menuOpen
            ? <Icons.Prev size='40px' /> // <Icons.ChevronLeft size='40px'/>
            : <Icons.Next size='40px' />
        }
      </div>
      <div
        ref={textRef}
        className='flex-grow p-2 pl-0'
        onPointerDown={onClick}
      >
        {media.title || media.name}
      </div>
      <div className='flex-none hidden sm:inline-block text-sm md:text-md ml-2 mr-4'>{media.duration}</div>
      <div
        className="flex-none flex flex-row items-center"
        style={{
          touchAction: 'none'
        }}
        onPointerDown={(e) => controls.start(e)}
      >
        <Icons.DragHandle size='36px' />
      </div>

    </>
  )
}

type SortableItemProps = {
  media: Media
  isDragging?: boolean
  onClick: () => void
  onDelete: () => void
}

const itemClass = 'flex flex-row rounded md:text-lg relative items-center'
const SortableItem: FC<SortableItemProps> = ({
  media,
  onClick,
  onDelete
}: SortableItemProps) => {
  const controls = useDragControls()
  // const mainRef = useRef(null)
  // const width = useMotionValue(0)
  // const downloads = useStore(state => state.downloads)
  /*
  useEffect(() => {
    const d = downloads.get(media.uri)
    if (d) {
      const w = mainRef.current.offsetWidth
      animate(width, 20 + ((w - 20) * (d.receivedLength / d.contentLength)), { ease: 'easeOut', duration: 0.1 })
    } else {
      animate(width, 0, { ease: 'easeOut', duration: 0.01 })
    }
  }, [downloads, width, media.uri])
   */

  return (
    <Reorder.Item
      value={media}
      dragListener={false}
      dragControls={controls}
      className={itemClass + (media.isQueued ? ' bg-yellow-200' : ' bg-gray-300')}
      initial={{ opacity: 0, y: 0, scale: 0.25 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    // ref={mainRef}
    >
      <Item media={media} onClick={onClick} onDelete={onDelete} controls={controls} />
      { /* <motion.div className='absolute animate-pulse h-3 rounded-b left-0 bottom-0 bg-green-400 w-full' style={{ width }} /> */}
    </Reorder.Item>
  )
}

type PlaylistDnDProps = {
  playlist: Playlist
  orderPlaylist: (p: Playlist) => void
  // onLoadIndex: (id: number) => void
  // onDelete: (id: number) => void
}
export const PlaylistDnDNoMemo: FC<PlaylistDnDProps> = ({
  playlist,
  orderPlaylist
  // onLoadIndex,
  // onDelete
}) => {
  console.log('playlist render')
  return (
    <Reorder.Group
      layoutScroll
      axis="y"
      className="space-y-1 select-none"
      values={playlist}
      onReorder={orderPlaylist}
    >
      <AnimatePresence>
        {
          playlist.map((m) => <SortableItem
            key={m.key}
            media={m}
            onClick={() => null}
            onDelete={() => null}
          />)
        }
      </AnimatePresence>
    </Reorder.Group>
  )
}
export const PlaylistDnD = React.memo(PlaylistDnDNoMemo)
