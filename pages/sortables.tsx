import React, { FC, useState } from 'react'
import { Sortable, SortItem, DragContext, DragInfo, TargetInfo } from '../components'
import { Template } from '../shared'

type DefProps = {
  containerId: string
  values: Array<string>
  onReorder: React.Dispatch<React.SetStateAction<Array<string>>>
}

const Def: FC<DefProps> = ({
  containerId,
  values,
  onReorder
}) => {
  return (
    <Sortable
      containerId={containerId}
      values={values}
      onReorder={onReorder}
      className={'flex flex-row bg-green-100 select-none gap-2 overflow-x-auto snap-x snap-mandatory w-1/2 '}
      >
      {
      values.map(id => (
        <SortItem
          key={id}
          id={id}
          containerId={containerId}
          className={"snap-center flex-none w-32 h-64 bg-red-500 rounded"}
      >
          <div className='p-4 bg-blue-300'>
            {id}
          </div>
          <div className='w-12 h-12 bg-blue-600' />
        </SortItem>

      ))
      }
    </Sortable>
  )

}

const SortablesPage = () => {
  const [values1, onReorder1] = useState(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'])
  const [values2, onReorder2] = useState(['1', '2', '3', '4'])

  const [dragItemInfo, setDragInfo] = useState<DragInfo>({ x:0, y:0, width: 0, height: 0, id: '', containerId:'', data: {}, state:'dragging' })
  const [targetItemInfo, setTargetInfo] = useState<TargetInfo>({ x:0, y:0, width: 0, height: 0, id: '', containerId:'' })

  return (
    <Template>
      <DragContext.Provider value={{
      dragItemInfo,
      targetItemInfo,
      setDragInfo,
      setTargetInfo,

      }}>

        <div className="flex flex-col gap-4 w-4/5">
          <Def values={values1} onReorder={onReorder1} containerId='toplist' />
          <Def values={values2} onReorder={onReorder2} containerId='bottomlist' />
        </div>
      </DragContext.Provider >
    </Template>
  )
}

export default SortablesPage
