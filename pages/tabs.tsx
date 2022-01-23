import React from 'react'
import { Tabs, Tab } from '../components/tabs'

const TabPage = () => {
  return (
    <div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <Tabs headers={[
          { name: 'info', label: 'Info' },
          { name: 'stats', label: 'Stats' },
          { name: 'record', label: 'Record' },
          { name: 'icecast', label: 'Icecast' }
        ]}>
          <Tab name='info'>
            Some info.
          </Tab>
          <Tab name='stats'>
            Some stats
          </Tab>
          <Tab name='record'>
            Some records
          </Tab>
          <Tab name='icecast'>
            Some icecast.
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default TabPage
