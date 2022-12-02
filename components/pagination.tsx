import React, { FC, ReactNode } from 'react'

export type  PaginationProps = {
  currentIdx: number
  length: number
  keyPre: string 
  onChange: (idx: number) => void
}

export const Pagination: FC<PaginationProps> = ({ 
  currentIdx = 0,
  length = 0,
  keyPre='wtf',
  onChange
}) => (
<div className='flex flex-row gap-2'>
{
  Array.from({length}, (_, num) => currentIdx === num
      ? <button disabled={true} className="p-1 rounded bg-write-1 text-base-1 transition-colors duration-300 " key={keyPre + num}>{num+1}</button>
      : <button 
          className="p-1 rounded bg-base-1 text-write-1 cursor-pointer transition-colors duration-300 "
          key={keyPre + num}
          onClick={() => onChange(num)}
        >{num+1}</button>
    )
}
</div>
)


