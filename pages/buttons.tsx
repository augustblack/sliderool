import React from 'react'
import Button from '../components/button'
import Icons from '../components/icons'
import { Template } from '../shared'

const Buttons = () => (
  <Template>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=plain</div>
      <div className='flex flex-row space-x-2'>
        <Button label='one' kind='plain' />
        <Button label='one' kind='plain' />
        <Button kind='plain' className='flex flex-row space-x-4'>
          <Icons.Mic size='24px' />
          <div>mic</div>
        </Button>
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=outline</div>
      <div className='flex flex-row space-x-2'>
        <Button label='one' kind='outline' />
        <Button label='one' kind='outline' />
        <Button label='one' kind='outline' />
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Buttons of kind=none</div>
      <div className='flex flex-row space-x-2'>
        <Button kind='none' className="">
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
      <div>Button group </div>
      <div className='w-1/3'>
        <div className='flex flex-row w-auto border border-1 border-base-con rounded'>
          <Button kind='group'>
            <Icons.Headset size='32px' />
          </Button>
          <Button kind='group'>
            <Icons.Play size='32px' />
          </Button>
          <Button kind='group'>
            <Icons.Pending size='32px' />
          </Button>
          <Button kind='group'>
            <Icons.List size='32px' />
          </Button>

        </div>
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Button group </div>
      <div className='w-2/3'>
        <form className='flex flex-row w-auto border border-1 border-base-con rounded'>
          <div className='rounded-l flex-grow flex space-x-2 bg-gray-100 items-center border-r border-1 border-base-con '>
            <input placeholder='search' className='flex-grow text-xl bg-gray-100 ring-0' />
          </div>
          <Button kind='group' label='submit' className='flex-none bg-green-200 text-green-900' />
          <Button kind='group' label='cancel' className='flex-none' />
        </form>
      </div>
    </div>

  </Template>
)

export default Buttons
