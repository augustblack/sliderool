import React from 'react'
// import Link from 'next/link'
import Button from '../components/button'
import Icons from '../components/icons'
import Template from './template'

const Buttons = () => (
  <Template>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=plain</div>
      <div className='flex flex-row space-x-2'>
        <Button label='one' kind='plain'/>
        <Button label='one' kind='plain'/>
        <Button kind='plain' className='flex flex-row space-x-4'>
          <Icons.Mic size='24px' />
          <div>mic</div>
        </Button>
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=outline</div>
      <div className='flex flex-row space-x-2'>
        <Button label='one' kind='outline'/>
        <Button label='one' kind='outline'/>
        <Button label='one' kind='outline'/>
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=none</div>
      <div className='flex flex-row space-x-2'>
        <Button kind='none'>
          <Icons.Headset size='24px' />
        </Button>
        <Button kind='none'>
          <Icons.Play size='24px' />
        </Button>
        <Button kind='none'>
          <Icons.Pending size='24px' />
        </Button>
        <Button kind='none'>
          <Icons.List size='24px' />
        </Button>

      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=round</div>
      <div className='flex flex-row space-x-2'>
        <Button kind='round' className='w-12 h-12 bg-base-1'>
          <Icons.Headset size='36px' />
        </Button>
        <Button kind='round' className='w-12 h-12 bg-base-3'>
          <Icons.Play size='24px' />
        </Button>
        <Button kind='round' className='w-12 h-12'>
          <Icons.Pending size='24px' />
        </Button>
        <Button kind='round' className='w-10 h-10'>
          <Icons.List size='24px' />
        </Button>

      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Button group <span className='text-red-400'>NEEDS WORK</span></div>
      <div className='space-x-0 first:rounded-l last:rounded-r rounded-md border border-write-1'>
        <Button kind='group'>
          <Icons.Headset size='24px' />
        </Button>
        <Button kind='group'>
          <Icons.Play size='24px' />
        </Button>
        <Button kind='group'>
          <Icons.Pending size='24px' />
        </Button>
        <Button kind='group'>
          <Icons.List size='24px' />
        </Button>

      </div>
    </div>
  </Template>
)

export default Buttons
