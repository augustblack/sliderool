import React, { FC } from 'react'

export type PaginationProps = {
  currentIdx: number
  length: number
  onChange: (idx: number) => void
}

export const PaginationNumbers: FC<PaginationProps> = ({
  currentIdx = 0,
  length = 0,
  onChange
}) => (
  <div className='flex flex-row gap-2'>
    {
  Array.from({ length }, (_, num) => currentIdx === num
      ? <button disabled={true} className="p-1 rounded bg-write-1 text-base-1 transition-colors duration-300 " key={num}>{num+1}</button>
      : <button
          className="p-1 rounded bg-base-1 text-write-1 cursor-pointer transition-colors duration-300 "
          key={num}
          onClick={() => onChange(num)}
        >{num+1}</button>
    )
}
  </div>
)
export const Pagination: FC<PaginationProps> = ({
  currentIdx = 0,
  length = 0,
  onChange
}) => (
  <div className='flex flex-row gap-2'>
    {
  Array.from({ length }, (_, num) => currentIdx === num
      ? <button disabled={true} className="rounded-full w-4 h-4 bg-write-1 text-base-1 transition-colors duration-300 opacity-10 " key={num} />
      : <button
          className="rounded-full w-4 h-4 bg-base-1 text-write-1 cursor-pointer transition-colors duration-300 "
          key={num}
          onClick={() => onChange(num)}
        />
    )
}
  </div>
)
