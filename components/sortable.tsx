import React, {
  FC,
  // useState,
  useRef,
  DragEventHandler,
  createContext,
  useContext,
  DragEvent,
  useEffect
} from 'react'

export type TargetInfo = {
  containerId: string
  x:number
  y:number
  width:number
  height:number
  id:string
}

export type DragState = 'dragging' | 'limbo' | 'copying'

export type DragInfo = TargetInfo & {
  state: DragState
  data: unknown
}

export type DragContextType = {
  dragItemInfo: DragInfo
  targetItemInfo: TargetInfo
  setDragInfo: (info: DragInfo) => void
  setTargetInfo: (info: TargetInfo) => void
}

export const DragContext = createContext<DragContextType>({
  dragItemInfo: { containerId:'', x:0, y:0, width: 0, height: 0, id: '', data: {}, state: 'dragging' },
  targetItemInfo: { containerId: '', x:0, y:0, width: 0, height: 0, id: '' },
  setDragInfo: () => null,
  setTargetInfo: () => null
})
type PushIt = {
  addedDragItem: boolean
  length: number
  values: Array<string>
}

export const pushItem = ( p: PushIt, id: string, dragId : string) => {
  if (id === dragId ) {
    if (p.addedDragItem === false) {
      p.values.push(id)
      p.addedDragItem = true
    }
  } else {
    p.values.push(id)
  }
}

type SortItemProps = {
  id: string
  containerId: string
  className?: string
  children: React.ReactNode
}

export const SortItem: FC<SortItemProps> = ({
  id,
  containerId,
  className,
  children
}) => {
  const { dragItemInfo, setDragInfo, setTargetInfo } = useContext(DragContext);
  const divRef = useRef<HTMLDivElement>(null)
  /*
  useEffect(() => {
    if ( targetItemInfo.id === id) {
      console.log('scrolling into view')
      divRef.current?.scrollIntoView()
    }
  }, [id, dragItemInfo, targetItemInfo])
  */

  const dragStart: DragEventHandler<HTMLDivElement> = (e) => {
    // should set the data here

    e.dataTransfer.setData("text", id);
    // e.dataTransfer.effectAllowed = "copyMove";
    const br = divRef.current?.getBoundingClientRect() || { x:0, y:0, width: 0, height: 0, id: '', data: {} }
    setDragInfo(Object.assign(br, { id, containerId, data: {}, state: 'dragging' as DragState }))
    console.log('dragStart child', id)
  }

  const dragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    setDragInfo({ x:0, y:0, width: 0, height: 0, id: '', containerId:'', data: {}, state:'dragging' })
    console.log('drag end', containerId, e)
  }

  const dragEnter: DragEventHandler<HTMLDivElement> = (e: DragEvent) => {
    e.preventDefault()
    // e.stopPropagation()
    const br = divRef.current?.getBoundingClientRect() || { x:0, y:0, width: 0, height: 0, id: '', data: {} }
    setTargetInfo(Object.assign(br, { id, containerId, data: {} }))
  }

  return (
    <div
      ref={divRef}
      draggable={true}
      onDragStart={dragStart}
      onDragEnter={dragEnter}
      onDragEnd={dragEnd}
      // onDragLeave={dragLeave}
      className={className + (dragItemInfo.id === id
        ? dragItemInfo.state === 'dragging'
          ? ' opacity-30'
          : dragItemInfo.state === 'limbo'
              ? ' hidden'
              : ' '
        : ''
      )}
      id={id}
    >
      {children}
    </div>
  )
}

type SortableProps = {
  containerId: string
  values: Array<string>
  className?: string
  onReorder: (a: Array<string>) => void
  children: React.ReactElement<SortItemProps>[] // | React.ReactElement<SortItemProps>
}

export const Sortable: FC<SortableProps> = ({
    containerId,
    values,
    onReorder,
    className,
    children
}) => {
  const { dragItemInfo, setDragInfo, targetItemInfo } = useContext(DragContext);

  const containerRef = useRef<HTMLDivElement>(null)
  const minusValues = useRef(values)

  const dragCounter = useRef<number>(0)

  const dragStart: DragEventHandler<HTMLDivElement> = (e) => {
    // we don't get the dragItemInfo fast enough when we sit it in the child dragStart
    const dragId = (e.target as HTMLDivElement).id
    minusValues.current = values.filter(v => v!== dragId)
    console.log('dragStart', dragItemInfo, minusValues.current, (e.target as HTMLDivElement).id)
  }

  const dragOver: DragEventHandler<HTMLDivElement> = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (dragItemInfo.id !== '' && targetItemInfo.id !== dragItemInfo.id) {
      // if (dragItemInfo.containerId !== containerId ) return
      // console.log('over', targetItemInfo.id, dragItemInfo.id)

      const newOrder = minusValues.current.reduce((acc, i, idx, arr ) => {
          if (i === targetItemInfo.id ) {
            if (e.clientX > (targetItemInfo.x + targetItemInfo.width/2)) {
              acc.values.push(i)
              acc.values.push(dragItemInfo.id)
              acc.addedDragItem = true
            } else {
              acc.values.push(dragItemInfo.id)
              acc.values.push(i)
              acc.addedDragItem = true
            }
          } else {
          acc.values.push(i)
          }
          if (idx === arr.length -1 && !acc.addedDragItem) {
          acc.values.push(dragItemInfo.id)
          }
          return acc
          }, { addedDragItem: false, length: minusValues.current.length, values: [] as Array<string> })
      // console.log('newOrder is zero', newOrder, targetRect.current?.id, valuesMinus.current)
      onReorder(newOrder.values)
        // console.log(e.target.id)
    }
    const br = containerRef.current?.getBoundingClientRect() || { left:0, top: 0, width:0, height: 0 }
    if (e.clientX > (br.left + br.width * 0.7)) {
      containerRef.current?.scrollBy({ top:0, left: 3, behavior: 'smooth' })
      console.log('scrollBy right')
      return
    }
    if (e.clientX > br.left && e.clientX < br.left + br.width * 0.1) {
      containerRef.current?.scrollBy({ top:0, left: -1, behavior: 'smooth' })
      console.log('scrollBy left')
      return
    }


  }

  const drop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    dragCounter.current = 0
    console.log("dropped on", containerId, e.dataTransfer.getData('text'))
    setDragInfo({ x:0, y:0, width: 0, height: 0, id: '', containerId:'', data: {}, state:'dragging' })
  }

  const dragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    console.log(containerId, 'enter on', Date.now() )
    if (dragItemInfo.containerId !== containerId) {
      e.dataTransfer.dropEffect = "none"
    }
    // e.stopPropagation()
    setDragInfo(Object.assign({}, dragItemInfo, { state:'dragging' }))
    // console.log('enter on', containerId )
  }

  const dragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    // e.stopPropagation()
    const br = containerRef.current?.getBoundingClientRect() || { left:0, top: 0, width:0, height: 0 }
    console.log('leave on', containerId, e.clientY, br) //, e.clientX, containerRef.current?.getBoundingClientRect().x)
    if (
      (e.clientX < br.left || e.clientX > (br.left + br.width)) ||
      (e.clientY < br.top || e.clientY >= (br.top + br.height))) {
      console.log('  --', containerId, 'leave on', Date.now() )
      setDragInfo(Object.assign({}, dragItemInfo, { state:'limbo' }))
      return
    }
   }

  return (
    <div
      ref={containerRef}
      className={className}
      onDragStart={dragStart}
      onDragOver={dragOver}
      // onDragEnd={dragEnd}
      onDragLeave={dragLeave}
      onDragEnter={dragEnter}
      onDrop={drop}
      style ={{ scrollBehavior: 'smooth' }}
     >
      { children }
    </div>
  )
}

export default Sortable
