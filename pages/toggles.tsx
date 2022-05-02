import React, { useState } from 'react'
import { IconToggle, Toggle } from '../components/toggle'
import Icons from '../components/icons'
const Head = () => {
  const [pressed, setPressed] = useState(false)
  return <Toggle description='send audio  to headphones' pressed={pressed} Icon={Icons.Headset} size='32px' onClick={() => setPressed(p => !p)}/>
}
const Broad = () => {
  const [pressed, setPressed] = useState(false)
  return <Toggle description='send audio to broadcast' pressed={pressed} Icon={Icons.Broadcast} size='32px' onClick={() => setPressed(p => !p)}/>
}
const TogglePage = () => (
  <div>
    <div className='bg-base-2 rounded p-4 space-y-2'>
    <Head />
    <Broad />
    </div>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;IconToggle&gt; or Switch</div>
      <div className='flex flex-row space-x-2'>
        <IconToggle Icon={Icons.Mic} description='mic is on'/>
        <IconToggle pressed={true} Icon={Icons.Mic} description='mic is off'/>
      </div>
    </div>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;IconToggle&gt; wit size</div>
      <div className='space-x-2'>
        <IconToggle Icon={Icons.Headset} size='32px' description='headset is on'/>
        <IconToggle Icon={Icons.Headset} size='32px' pressed={true} description='headset is off'/>
        <IconToggle Icon={Icons.Broadcast} size='24px' description='broadcast is on'/>
        <IconToggle Icon={Icons.Broadcast} size='24px' description='broadcast is off' pressed={true} />
        <IconToggle Icon={Icons.Mic} size='18px' description='mic is on'/>
        <IconToggle Icon={Icons.Mic} size='18px' description='mic is off' pressed={true} />
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;Toggle&gt; with size. Requires OnOffProps where an Icon has a one icon each for on and off. </div>
      <div className='space-x-2'>
        <Toggle Icon={Icons.Headset} size='32px' description='sized headset on'/>
        <Toggle Icon={Icons.Headset} size='32px' description='sized headset off' pressed={true} />
        <Toggle Icon={Icons.Broadcast} size='32px' description='sized broadcast on' />
        <Toggle Icon={Icons.Broadcast} size='32px' description='sized broadcast off' pressed={true} />
      </div>
    </div>

  </div>
)

export default TogglePage
