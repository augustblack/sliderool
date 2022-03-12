import React, { FC, ReactNode } from 'react'
import { Tabs, Tab } from '../components/tabs'

const TabDiv: FC<{children:ReactNode}> = ({
  children
}) => <div className="p-2">{children}</div>

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
            <TabDiv>
            Some info. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </TabDiv>
          </Tab>
          <Tab name='stats'>
            <TabDiv>
            <b>Some Stats.</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </TabDiv>
          </Tab>
          <Tab name='record'>
            <TabDiv>
            <b>Some Record.</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </TabDiv>

          </Tab>
          <Tab name='icecast'>
            <TabDiv>
            <b>Some Icecast.</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </TabDiv>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default TabPage
