import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  createContext
} from 'react';

import { createPortal } from 'react-dom';

import Icons from '../icons'

import {
  // CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  PointerSensor,
  // useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  // KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
  DraggableSyntheticListeners,
  useDroppable
} from '@dnd-kit/core';

import {
  AnimateLayoutChanges,
  arrayMove,
  SortableContext,
  useSortable,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  // SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
  coordinateGetter as multipleContainersCoordinateGetter
} from './keyCoords'


const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export type Media = {
  id: string
  title: string
  duration: number
  isQueued: boolean
}

export type Playlist = Array<Media>

type ItemProps = {
  isDragging: boolean
  media: Media
  listeners?: DraggableSyntheticListeners
  onClick ?: () => void
  onDelete ?: () => void
}
const Item: FC<ItemProps> = ({
  // isDragging,
  media,
  listeners = {},
  onClick = () => null
  // onDelete = () => null
}: ItemProps) => {

  return (
    <div className='flex flex-row flex-none '>
      <div
          className='flex-grow p-2 pl-0'
          onPointerDown={onClick}
        >
        {media.title}
      </div>
      <div className='flex-none sm:inline-block text-sm md:text-md ml-2 mr-4'>{media.duration}</div>
      <button
          style={{
            touchAction: 'none'
          }}
          {...listeners}
        >
        <Icons.DragHandle size='36px' />
      </button>
    </div>
  )
}

type SortableItemProps = {
  id: UniqueIdentifier
  trackId: UniqueIdentifier
  media: Media
  isDragging?: boolean
  onClick: () => void
  onDelete?: () => void
  disabled: boolean
}

type SortableItemData = {
  trackId: UniqueIdentifier
}

const SortableItem: FC<SortableItemProps> = ({
  id,
  trackId,
  media,
  isDragging = false,
  onClick,
  disabled
  // onDelete
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id, data: { trackId } as SortableItemData })

  const style = {
    transform: CSS.Transform.toString(transform),
    WebkitTapHighlightColor: 'transparent',
    transition
  }


  return (
    <div
      ref={disabled ? undefined: setNodeRef}
      style={style}
      className={'bg-blue-100 ' + (isDragging ? ' opacity-25 flex-none' : 'flex-none')}
      {...attributes}
    >
      <Item
        media={media}
        listeners={listeners}
        onClick={onClick}
        // onDelete={onDelete}
        isDragging={isDragging}
        />
    </div>
  )
}
/*
const itemClass = 'flex flex-row rounded md:text-lg relative items-center '
type DisplayItemProps = {
  activeId: UniqueIdentifier | null
  playlist: Playlist
}

const DisplayItem: FC<DisplayItemProps> = ({
  activeId,
  playlist
}: DisplayItemProps) => {
  const media = playlist.get(activeId || '')
  return media
    ? (
      <div className={itemClass + ' shadow-2xl' + (media.isQueued ? ' bg-yellow-200' : ' bg-blue-300')}>
        <Item media={media} isDragging={false}/>
      </div>
      )
    : null
}
*/

type SortablePlaylistProps = {
  playlist: Playlist
  setPlaylist: (p: Playlist) => void
  onLoadIndex: (id: UniqueIdentifier) => void
  onDelete: (id: UniqueIdentifier) => void
  activeId ?: UniqueIdentifier
  isSortingTracks: boolean
  trackId: UniqueIdentifier
}

export const SortablePlaylist: FC<SortablePlaylistProps> = ({
    activeId,
    playlist,
    // setPlaylist,
    onLoadIndex,
    onDelete,
    isSortingTracks,
    trackId
}) => {
  return (
    <div
        className="space-y-1 select-none"
        style={{
          // necessary to prevent touch action from bubbling up to parent scrollable div
          touchAction: activeId === null ? 'auto' : 'none'
        }}
      >
      <SortableContext
        items={playlist}
        strategy={verticalListSortingStrategy}
        >
        {
              playlist.map( m => <SortableItem
                  key={m.id}
                  id={m.id}
                  media={m}
                  isDragging={m.id === activeId}
                  onClick={() => onLoadIndex(m.id)}
                  onDelete={() => onDelete(m.id)}
                  disabled={isSortingTracks}
                  trackId={trackId}
                  />)
            }
      </SortableContext>
    </div>
  )
}


type PlayerTrackProps = {
  id: UniqueIdentifier
  type: TrackType
  playlist: Playlist
  setPlaylist: (p: Playlist) => void
  isSortingTracks: boolean
}
const PlayerTrack: FC<PlayerTrackProps> = ({
  id,
  type,
  playlist,
  setPlaylist,
  isSortingTracks
}) => {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container'
    },
    animateLayoutChanges,
  })

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container')
    : false

  return (
    <div
      // ref={isSortingTracks ? setNodeRef : undefined}
      ref={setNodeRef}
      className={ "p-2 w-96 flex-none flex flex-col " + (isOverContainer ? 'bg-blue-200' : 'bg-red-200')}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
    >
      <div className='w-full flex'>
        <div className="flex-grow">{id}</div>
        <button
          style={{
            touchAction: 'none'
          }}
          {...attributes}
          {...listeners}
        >
          <Icons.DragHandle size='36px' />
        </button>
      </div>

      { type === 'player'
        ? (
          <ul className="h-full w-full overflow-y-auto">
            <SortablePlaylist
              playlist={playlist}
              setPlaylist={setPlaylist}
              onLoadIndex={() => null}
              onDelete={() => null}
              activeId={active?.id}
              isSortingTracks={isSortingTracks}
              trackId={id}
            />
          </ul>
        )
        : <div />
      }
    </div>
  )
}

type MainDropProps = {
  className?: string
  children: React.ReactNode
}

const MainDrop: FC<MainDropProps> = ({
  className,
  children
}) => {
  const {
    setNodeRef
  } = useDroppable({
    id: 'main'
  })

  return (
    <div
      ref={setNodeRef}
      className={ className }
    >
      {children}
    </div>
  )
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

type TrackType = 'mic' | 'player'
export type Track = {
  id: UniqueIdentifier
  type: TrackType
  playlist ?: Playlist
}
export type TracksType = Map<UniqueIdentifier, Track>

export type MoveMediaArgs = {
  fromTrack: UniqueIdentifier
  toTrack: UniqueIdentifier
  overId: UniqueIdentifier
  activeId: UniqueIdentifier
  modifier: number
}

export type TracksContextType = {
  tracksOrder: Array<UniqueIdentifier>
  setTracksOrder: (t: Array<UniqueIdentifier>) => void
  tracks: TracksType
  setPlaylist: (trackId: UniqueIdentifier, playlist: Playlist) => void
  // setTracks: (tracks: TracksType) => void
  moveMedia: (mma: MoveMediaArgs) => void
}

export const TracksContext = createContext<TracksContextType>({
  tracksOrder: [],
  setTracksOrder: () => null,
  tracks: new Map(),
  setPlaylist: () => null,
  //setTracks: () => null,
  moveMedia: () => null
})

export const Tracks = () => {

  const {
    tracksOrder,
    setTracksOrder,
    moveMedia,
    tracks
  } = useContext(TracksContext);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: multipleContainersCoordinateGetter,
    })
  )
  const isSortingTracks: boolean = activeId && tracks.get(activeId) ? true : false

  const onDragCancel = () => setActiveId(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [tracks])

    const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
      if (activeId && tracks.get(activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => tracks.get(container.id)
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId !== null) {
        /*
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }
        */

        if (tracks.get(overId )) {
          const containerItems = (tracks?.get(overId)?.playlist || []).map(m => m.id)

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(String(container.id))
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];

    }
    , [activeId, tracks])

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{
            droppable: {
                strategy: MeasuringStrategy.Always
            }
        }}
        onDragStart={({ active })=> setActiveId(active.id)}
        onDragOver={({ active, over }) => {
            console.log("onDragOver", active, over)
            const overId = over?.id || ""
            if (overId === '' || tracks.get(active.id)) {
              return
            }
            const activeContainer = tracks.get(active.id)
            const overContainer = tracks.get(overId)
            if (overContainer || activeContainer) {
              console.log("onDragOver container", active, over)
              return
            }
            if (active.data.current?.hasOwnProperty('trackId') && over?.data.current?.hasOwnProperty('trackId')) {
              // we have sub track items being dragged
              const fromTrack = active.data.current.trackId
              const toTrack = over.data.current.trackId
              if (!fromTrack || !toTrack || fromTrack === toTrack) {
                return
              }
              const isBelowOverItem =
                  over &&
                  active.rect.current.translated &&
                  active.rect.current.translated.top >
                  over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0

              recentlyMovedToNewContainer.current = true
              moveMedia({ fromTrack, toTrack, modifier, overId, activeId: active.id })

            }

        }}
        onDragEnd={({ active, over }) => {
            console.log("onDragEnd", active, over)
            setActiveId(null)
            const activeContainer = tracks.get(active.id)
            const overContainer = tracks.get(over?.id || '')
            if (overContainer || activeContainer) {
              if (over?.id && active.id !== over.id) {
                const oldIndex = tracksOrder.indexOf(active.id)
                const newIndex = tracksOrder.indexOf(over.id)
                const newTracks = arrayMove(tracksOrder, oldIndex, newIndex)
                return setTracksOrder(newTracks)
              }
            }
              const isBelowOverItem =
                  over &&
                  active.rect.current.translated &&
                  active.rect.current.translated.top >
                  over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0


            moveMedia({
              fromTrack:active.data.current?.trackId,
              toTrack: over?.data.current?.trackId,
              modifier,
              overId: over?.id || '',
              activeId: active.id
            })
        }}
        onDragCancel={onDragCancel}
        >
        <MainDrop className='w-full h-screen bg-blue-400'>
          <>
            <div className="flex flex-row w-full h-64 overflow-x-auto ">
              <SortableContext
              items={tracksOrder}
              strategy={horizontalListSortingStrategy}
            >
                {
                    tracksOrder.map((containerId) => (
                      <PlayerTrack
                        key={containerId}
                        id={containerId}
                        type={tracks?.get(containerId)?.type || 'mic'}
                        playlist={tracks?.get(containerId)?.playlist || []}
                        setPlaylist={() => null}
                        isSortingTracks={isSortingTracks}
                      />
                    ))
                }
              </SortableContext>
            </div>
            {
            createPortal(
              <DragOverlay dropAnimation={dropAnimation} >
                { activeId
                    ? tracks.get(activeId)
                        ? <div className={""}>track: {activeId}</div>
                        : <div className={""}>playlist item: {activeId}</div>
                    : null
                  }
              </DragOverlay>
              , document.body)
            }
          </>
        </MainDrop>
      </DndContext>
  )
}

const dec2hex = (dec: number) => dec.toString(16).padStart(2, '0')

// generateId :: Integer -> String
const generateId = (len:number) : string => {
  const arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

const b = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']


const SortablePage = () => {
  const [tracks, setTracks] = useState<Map<UniqueIdentifier, Track>>(new Map(
    b.map((_, idx) => {
      const id = generateId(5)
      return [id, {
        id,
        type: idx === 3 ? 'mic' :'player',
        playlist: b.map((m,idx) => {
          const mid = generateId(5)
          return {
            id: mid,
            title: id + '-' + mid + '-' + m,
            duration: idx,
            isQueued: false
          }
        })
      }]
    })
  ))

  const [tracksOrder, setTracksOrder] = useState<Array<UniqueIdentifier>>( Array.from(tracks.keys()) )

  const moveMedia = ({ fromTrack, toTrack, modifier, overId, activeId }: MoveMediaArgs) => {
    const from = tracks.get(fromTrack)
    const to = tracks.get(toTrack)
    console.log('move media', modifier, toTrack)
    if (to && from ) {
      if (fromTrack === toTrack) {
        const oldIndex = (to.playlist || []).findIndex(m => m.id === activeId)
        const newIndex = (to.playlist || []).findIndex(m => m.id === overId)
        to.playlist = arrayMove((to.playlist || []), oldIndex, newIndex)
        /*
        const media = (to?.playlist || []).find(m => m.id === activeId)
        const toPlaylist = (to?.playlist || []).reduce((acc, m) => {
          if (m.id === overId && media) {
            if (modifier === 1) {
              acc.push(media)
              acc.push(m)
            } else {
              acc.push(m)
              acc.push(media)
            }
          } else if (m.id !== activeId) {
            acc.push(m)
          }
          return acc
        }, [] as Playlist)
        to.playlist = toPlaylist
        */
        return setTracks(new Map(tracks))
      }
      let media: Media
      const fromPlaylist = (from?.playlist || [] ).reduce((acc, m) => {
        if (m.id === activeId) {
          media = m
        } else {
          acc.push(m)
        }
        return acc
      }, [] as Playlist)

      const toPlaylist = (to?.playlist || []).reduce((acc, m) => {
        if (m.id === overId && media) {
          if (modifier === 0) {
            acc.push(media)
            acc.push(m)
          } else {
            acc.push(m)
            acc.push(media)
          }
        } else {
          acc.push(m)
        }
        return acc
      }, [] as Playlist)
      from.playlist = fromPlaylist
      to.playlist = toPlaylist
      setTracks(new Map(tracks))
    }
  }

  return (
    <TracksContext.Provider value={{
        setTracksOrder: setTracksOrder,
        tracksOrder:tracksOrder,
        tracks:tracks,
        moveMedia: moveMedia,
        setPlaylist:() =>null
      }}
    >
      <div className='h-full p-4'>
        <Tracks />
      </div>
    </TracksContext.Provider>
    )
}

export default SortablePage
