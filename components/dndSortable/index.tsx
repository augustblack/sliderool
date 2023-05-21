import React, { FC, useState } from 'react'
import { createPortal } from 'react-dom'
// import ClientOnlyPortal from './clientOnlyPortal'
import {
  DragEndEvent,
  DragStartEvent,
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DraggableSyntheticListeners,
  useSensor,
  useSensors,
  UniqueIdentifier
} from '@dnd-kit/core'
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

import {
  // restrictToVerticalAxis,
  restrictToWindowEdges,
  // restrictToFirstScrollableAncestor
} from '@dnd-kit/modifiers'

export type Media = {
  id: string
  title: string
  duration: number
  isQueued: boolean
}

export type Playlist = Map<UniqueIdentifier, Media>


import { CSS } from '@dnd-kit/utilities'
import Icons from '../icons'

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
          className="flex-none flex flex-row items-center"
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
  media: Media
  isDragging?: boolean
  onClick: () => void
  onDelete?: () => void
}

const itemClass = 'flex flex-row rounded md:text-lg relative items-center '
const SortableItem: FC<SortableItemProps> = ({
  id,
  media,
  isDragging = false,
  onClick
  // onDelete
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
    // transition
  } = useSortable({ id, transition: null })

  const style = {
    transform: CSS.Transform.toString(transform),
    WebkitTapHighlightColor: 'transparent'
    // transition
  }


  return (
    <div
      ref={setNodeRef}
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

type DisplayItemProps = {
  activeId: UniqueIdentifier | null
  playlist: Playlist
}

const DisplayItem: FC<DisplayItemProps> = ({
  activeId,
  playlist
}: DisplayItemProps) => {
  return activeId && playlist.get(activeId)
    ? (
      <div className={itemClass + ' shadow-2xl' + (playlist.get(activeId)?.isQueued ? ' bg-yellow-200' : ' bg-blue-300')}>
        <Item media={playlist.get(activeId)} isDragging={false}/>
      </div>
      )
    : null
}

type PlaylistDnDProps = {
  playlist: Playlist
  setPlaylist: (p: Playlist) => void
  onLoadIndex: (id: UniqueIdentifier) => void
  onDelete: (id: UniqueIdentifier) => void
}

export const PlaylistDnD: FC<PlaylistDnDProps> = ({
  playlist,
  setPlaylist,
  onLoadIndex,
  onDelete
}:PlaylistDnDProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (active.id !== over?.id) {
      const items = Array.from(playlist)
      const { oldIndex, newIndex } = items.reduce((acc, [id], idx) => ({
        oldIndex: id === active.id ? idx : acc.oldIndex,
        newIndex: id === over?.id ? idx : acc.newIndex
      }), { oldIndex: 0, newIndex: 0 })
      const newPlaylist = arrayMove(items, oldIndex, newIndex)
      return setPlaylist(new Map(newPlaylist))
    }
  }
  const handleDragCancel = () => setActiveId(null)

  return (
    <div
        className="space-y-1 select-none"
        style={{
          // necessary to prevent touch action from bubbling up to parent scrollable div
          touchAction: activeId === null ? 'auto' : 'none'
        }}
      >
      <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          //modifiers={[restrictToFirstScrollableAncestor]}
        >
        <SortableContext
            items={Array.from(playlist.keys())}
            strategy={verticalListSortingStrategy}
            >
          {
              Array.from(playlist).map(([id, m]) => <SortableItem
                  key={id}
                  id={id}
                  media={m}
                  isDragging={id === activeId}
                  onClick={() => onLoadIndex(id)}
                  onDelete={() => onDelete(id)}
                  />)
            }
        </SortableContext>
        {createPortal(
          (<DragOverlay
                // adjustScale={true}
                modifiers={[restrictToWindowEdges]}
              >
            <DisplayItem activeId={activeId} playlist={playlist} />
          </DragOverlay>),
          document.body
        )}
      </DndContext>
    </div>
  )
}
/*
const getEndOfPlaylist = R.compose(
  (a: Array<unknown>) => a.length,
  R.defaultTo([]),
  R.prop('media')
)
 */

// const wait = t => new Promise((resolve) => setTimeout(() => resolve(null), t))

export default PlaylistDnD
