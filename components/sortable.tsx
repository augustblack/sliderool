import React, {
  FC,
  useState,
  useRef,
  DragEventHandler,
  createContext,
  useContext,
  DragEvent
} from 'react'

type DragRect = DOMRect & {id:string} | undefined

type DragType = {
  dragging: string
  onDragEnter: (rect: DragRect) => void
}
const DragggingContext = createContext<DragType>({
  dragging: '',
  onDragEnter: () => null
})

type SortItemProps = {
  id: string
  className?: string
  children: React.ReactNode
}

export const SortItem: FC<SortItemProps> = ({
  id,
  className,
  children
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const { dragging, onDragEnter } = useContext(DragggingContext);

  const dragEnter = () => onDragEnter(divRef.current
    ? Object.assign(divRef.current.getBoundingClientRect(), { id: divRef.current.id })
    : undefined
  )

  return (
    <div
      ref={divRef}
      draggable={true}
      onDragEnter={dragEnter}
      className={className + (dragging === id ? ' opacity-30' : '' )}
      id={id}
    >
      {children}
    </div>
  )
}

type SortableProps = {
  listId: string
  values: Array<string>
  className?: string
  onReorder: (a: Array<string>) => void
  children: React.ReactElement<SortItemProps>[] | React.ReactElement<SortItemProps>
}

export const Sortable: FC<SortableProps> = ({
    listId,
    values,
    onReorder,
    className,
    children
}) => {
  const [dragging, setDragging] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const valuesMinus = useRef<Array<string>>(values)
  const dragId = useRef<string>('')
  const dragCounter = useRef<number>(0)
  // const targetId = useRef<string>('')
  const targetRect = useRef<DragRect>(undefined)

  const setDragId = (id: string) => {
    valuesMinus.current = values.filter(i => i !== id)
    dragId.current = id
    setDragging(id)
    //console.log('setting dragid', dragId.current, valuesMinus.current)
  }

  const dragStart: DragEventHandler<HTMLDivElement> = (e) => {
    dragCounter.current =0
    const id = (e.target as HTMLDivElement).id
    console.log('drag start on', listId, 'with', id, 'dragCounter', dragCounter.current)
    if (id && values.includes(id) ) {
      e.dataTransfer.setData('text', id)
      setDragId(id)
    }
  }


  const dragOver: DragEventHandler<HTMLDivElement> = (e: DragEvent) => {
    e.preventDefault()
    // console.log(targetRect.current?.id, dragId.current)
    if (dragId.current === '') return
    if (targetRect.current?.id === dragId.current) return
    const newOrder = valuesMinus.current.reduce((acc, i) => {
      if (i === targetRect.current?.id) {
        if (e.clientX > (targetRect.current.x + targetRect.current.width/2)) {
          acc.push(i)
          acc.push(dragId.current)
        } else {
          acc.push(dragId.current)
          acc.push(i)
        }
      } else {
        acc.push(i)
      }
      return acc
    }, [] as Array<string>)
    // console.log('newOrder is zero', newOrder, targetRect.current?.id, valuesMinus.current)
    onReorder(newOrder)
    // console.log(e.target.id)
  }

  const drop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    console.log("dropped on", listId, e.dataTransfer.getData('text'))
  }

  const dragEnd: DragEventHandler<HTMLDivElement> = () => {
    // console.log('drag end on', listId)
    setDragging('')
    dragId.current = ''
    dragCounter.current= 0
    targetRect.current = undefined
  }

  const dragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    // console.log('drag leave on', listId, dragCounter.current, e.target)
    if (dragCounter.current === 0) {
      console.log('  -- leave on', listId, dragCounter.current )
      //console.log('-- drag container')
    }
   }

  const dragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragCounter.current === 0) {
      console.log('drag enter on', listId, dragCounter.current)
    }
    dragCounter.current++
   }

  const onDragEnter = (rect: DragRect) => {
    if (rect && rect !== targetRect.current) {
      targetRect.current = rect
      // console.log('drag Enter', rect, targetRect.current)
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onDragStart={dragStart}
      onDragOver={dragOver}
      onDragEnd={dragEnd}
      onDragLeave={dragLeave}
      onDragEnter={dragEnter}
      onDrop={drop}
     >
      <DragggingContext.Provider value={{ dragging, onDragEnter }}>
        { children }
      </DragggingContext.Provider>

    </div>
  )
}

export default Sortable
