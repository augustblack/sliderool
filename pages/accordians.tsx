import React, { ReactNode, useState } from 'react'
import { Accordion } from '../components'
import { Template } from '../shared'

type AccItem = {
  header: ReactNode
  child: ReactNode
}

const booya: Record<string, AccItem> = {
  'ayao': {
    header: (<div><strong>conductions series</strong> is going on</div>),
    child: (<div><div ><a target="_blank" className="bg-blue-200 text-gray-900 pl-1 pr-1 undefined" href="https://conduction.wavefarm.org" rel="noreferrer">The Conduction Series</a> is a monthly live collaborative radio series airing on Wave Farm’s WGXC 90.7-FM Radio for Open Ears in New York’s Upper Hudson Valley.  It consists of a core group of sound and transmission artists from various locations who come together with other remote participants to perform a kind of live media archeaology together.</div></div>)
  },
  'bllao': {
    header: (<div>Fundamental Radio</div>),
    child: (<div><div ><a target="_blank" className="bg-blue-200 text-gray-900 pl-1 pr-1 undefined" href="http://funda.ment.org" rel="noreferrer">Fundamental Radio</a> is a monthly live collaborative radio series airing on Wave Farm’s WGXC 90.7-FM Radio for Open Ears in New York’s Upper Hudson Valley.  It consists of a core group of sound and transmission artists from various locations who come together with other remote participants to perform a kind of live media archeaology together.</div></div>)
  },
  'lao2': {
    header: (<div>We Are Here FM</div>),
    child: (<div><div ><a target="_blank" className="bg-blue-200 text-gray-900 pl-1 pr-1 undefined" href="https://wearehere.fm" rel="noreferrer">We Are Here FM</a> is a monthly live collaborative radio series airing on Wave Farm’s WGXC 90.7-FM Radio for Open Ears in New York’s Upper Hudson Valley.  It consists of a core group of sound and transmission artists from various locations who come together with other remote participants to perform a kind of live media archeaology together.</div></div>)
  }

}

const Accordians = () => {
  const [expanded, setExpanded] = useState<string>('')
  return (
    <Template>
      <div className='w-full flex flex-col gap-1'>
        {
          Object.entries(booya).map(([id, { header, child }]) => (
            <Accordion
              key={id}
              id={id}
              expanded={expanded}
              setExpanded={setExpanded}
              header={header}
              headerClass={'p-2 rounded ' + (expanded === id ? 'bg-blue-200' : 'bg-write-2 text-base-1')}
            >{child}</Accordion>
          ))
        }
      </div>
    </Template>
  )
}

export default Accordians
