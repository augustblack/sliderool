import React, { FC, useState } from 'react'
import { Sortable, SortItem } from '../components'
import { Template } from '../shared'

type DefProps = {
  listId: string
  values: Array<string>
  onReorder: React.Dispatch<React.SetStateAction<Array<string>>>
}

const Def: FC<DefProps> = ({
  listId,
  values,
  onReorder
}) => {
  return (
    <Sortable
      listId={listId}
      values={values}
      onReorder={onReorder}
      className={'flex flex-row bg-green-100 w-full select-none gap-2 overflow-x-auto snap-x snap-mandatory '}
      >
      {
      values.map(id => (
        <SortItem
          key={id}
          id={id}
          className={"snap-center w-32 h-64 bg-red-500 rounded"}
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
  const [values1, onReorder1] = useState(['one', 'two', 'three', 'four', 'five'])
  const [values2, onReorder2] = useState(['six', 'seven', 'eight', 'nine'])
  return (
    <Template>
      <div className="flex flex-col gap-4">
        <Def values={values1} onReorder={onReorder1} listId='toplist' />
        <Def values={values2} onReorder={onReorder2} listId='bottomlist' />
      </div>
    </Template>
  )
}

export default SortablesPage
