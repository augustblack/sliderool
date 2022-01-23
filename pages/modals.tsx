import React, { useState } from 'react'
// import { IconToggle, Toggle } from '../components/toggle'
import Icons from '../components/icons'
import { Modal, ModalWithClose } from '../components/modal'
import Button from '../components/button'

const Buttons = () => {
  const [showOne, setShowOne] = useState(false)
  const [showTwo, setShowTwo] = useState(false)
  const [showThree, setShowThree] = useState(false)
  return (
    <div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <Modal open={showOne} setOpen={setShowOne} buttonProps={{ label: 'plain modal', kind: 'plain' }}>
          <div className='w-96 h-64 p-4'>
            Hello. This is a modal or also known as a dialog. This one is plain with nuthin in it. It should still have focus on open.
            You should be able to hit ESC to close.  The focus should then return to the button.
          </div>
        </Modal>
      </div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <ModalWithClose open={showTwo} setOpen={setShowTwo} buttonProps={{ label: 'modal w/close', kind: 'plain' }}>
          <div className='w-96 p-4'>
            <div>Hello. This is a longer text to fill out the space.</div>
            <div>It&apos;s possible you would likely have some buttons and</div>
            <div>other schnick schnock in here
              to make things seem fuller and funner.
            </div>
          </div>
        </ModalWithClose>
      </div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <ModalWithClose
          open={showThree}
          setOpen={setShowThree}
          buttonProps={{ label: 'modal w/menu', kind: 'plain' }}
          menu={(
            <div className='flex flex-row space-x-2 pl-4 pt-3'>
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
          )}

        >
          <div className='w-auto md:w-96 p-4'>
            Hello. This is a longer text to fill out the space.  It&apos;s possible you would likely have some buttons and other schnick schnock in here
            to make things seem fuller and funner.
          </div>
        </ModalWithClose>
      </div>

    </div>
  )
}

export default Buttons
