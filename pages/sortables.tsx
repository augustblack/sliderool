import React from 'react'
import dynamic from 'next/dynamic'
import { Template } from '../shared'

const Mixer = dynamic(() => import('../components/dndSortable/tracks'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

const Page = () => {
  return (
    <Template>
      <Mixer />
    </Template>
  )
}

export default Page
