import React, { useState } from 'react'
import { IconToggle, Toggle, Switch, Icons } from '../components'
import { Template } from '../shared'

const Head = () => {
  const [pressed, setPressed] = useState(false)
  return <Toggle label='send audio  to headphones' pressed={pressed} Icon={Icons.Headset} size='32px' onClick={() => setPressed(p => !p)} />
}
const Broad = () => {
  const [pressed, setPressed] = useState(false)
  return <Toggle label='send audio to broadcast' pressed={pressed} Icon={Icons.Broadcast} size='32px' onClick={() => setPressed(p => !p)} />
}

const SSwitch = () => {
  const [pressed, setPressed] = useState(false)
  return <Switch label='send on or off' pressed={pressed} onClick={() => setPressed(p => !p)} />
}

const TogglePage = () => (
  <Template>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <Head />
      <Broad />
    </div>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;IconToggle&gt; or Switch</div>
      <div className='flex flex-row space-x-2'>
        <IconToggle Icon={Icons.Mic} label='mic is on' />
        <IconToggle pressed={true} Icon={Icons.Mic} label='mic is off' />
      </div>
    </div>
    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;IconToggle&gt; wit size</div>
      <div className='space-x-2'>
        <IconToggle Icon={Icons.Headset} size='32px' label='headset is on' />
        <IconToggle Icon={Icons.Headset} size='32px' pressed={true} label='headset is off' />
        <IconToggle Icon={Icons.Broadcast} size='24px' label='broadcast is on' />
        <IconToggle Icon={Icons.Broadcast} size='24px' label='broadcast is off' pressed={true} />
        <IconToggle Icon={Icons.Mic} size='18px' label='mic is on' />
        <IconToggle Icon={Icons.Mic} size='18px' label='mic is off' pressed={true} />
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;Toggle&gt; with size. Requires OnOffProps where an Icon has a one icon each for on and off. </div>
      <div className='space-x-2'>
        <Toggle Icon={Icons.Headset} size='32px' label='sized headset on' />
        <Toggle Icon={Icons.Headset} size='32px' label='sized headset off' pressed={true} />
        <Toggle Icon={Icons.Broadcast} size='32px' label='sized broadcast on' />
        <Toggle Icon={Icons.Broadcast} size='32px' label='sized broadcast off' pressed={true} />
      </div>
    </div>

    <div className='bg-base-2 rounded p-4 space-y-2'>
      <div>Basic &lt;Switch&gt; </div>
      <div className='space-x-2'>
        <SSwitch />
      </div>
    </div>


  </Template>
)

export default TogglePage
