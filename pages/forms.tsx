import React, { FC } from 'react'
import { Form, Colors } from '../components/'
import { Template } from '../shared'

const verify = (v: string) => new Promise((resolve, reject) => v && v.trim().length > 0
  ? resolve(v)
  : reject(new Error('Must have a non-zero length string'))
)
const verifyNum = (min: number, max: number) => (v: string) => new Promise((resolve, reject) => v && parseInt(v) >= min && parseInt(v) <= max
  ? resolve(v)
  : reject(new Error('Must have a number betweeen ' + min + ' and ' + max))
)

type ConfigureProps = {
  colors?: Colors
  close?: () => void
}
export const Configure: FC<ConfigureProps> = ({
  colors,
  close = () => null
}: ConfigureProps) => {
  const onSubmit = (v: unknown) => {
    console.log('here', v)
  }
  return (
    <div className='p-2'>
      <Form
        colors={colors}
        name='configure'
        onSubmit={onSubmit}
        afterSubmit={close}
        onCancel={close}
        items={[
          { field: 'username', label: 'Icecast Username', init: 'source', type: 'text', verify },
          { field: 'password', label: 'Icecast Password', init: '', type: 'password', verify },
          { field: 'server', label: 'Server', init: '', type: 'text', verify },
          { field: 'port', label: 'Port', init: '8000', type: 'number', verify },
          { field: 'mount', label: 'Mount', init: 'test.webm', verify },
          { field: 'name', label: 'Name', placeholder: 'name of icecast stream', init: '', verify: () => Promise.resolve(true) },
          { field: 'description', label: 'Description', placeholder: 'description of stream', init: '', verify: () => Promise.resolve(true) },
          {
            field: 'protocol',
            label: 'Protocol',
            init: 'ice2',
            type: 'radio',
            options: [
              { f: 'ice2', l: 'v2 protocol' },
              { f: 'ice1', l: 'legacy v1 protocol' }
            ],
          },
          {
            field: 'format',
            label: 'Format',
            init: 'webm',
            type: 'radio',
            options: [
              { f: 'webm', l: (<span>webm <span className="text-xs">(best quality, least CPU, ffox/chrome only)</span></span>) },
              { f: 'mp3', l: (<span>mp3 <span className="text-xs">(works on ffox/chrome/safari)</span></span>) }
            ],
          },
          {
            field: 'ssl',
            label: 'Use TLS/SSL',
            init: 'no',
            type: 'radio',
            options: [
              { f: 'no', l: (<span>no <span className='text-xs'>(most icecast servers are not configured for SSL/TLS)</span></span>) },
              { f: 'yes', l: (<span>yes <span className='text-xs'>(newer icecast configs need TLS/SSL)</span></span>) }
            ],
          }
        ]}

      />
    </div>
  )
}

const FormPage = () => {
  return (
    <Template>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <Configure close={() => null} />
      </div>
    </Template>
  )
}

export default FormPage
