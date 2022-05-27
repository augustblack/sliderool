import React, { FC } from 'react'
import Form from '../components/form'

const verify = (v:string) => new Promise((resolve, reject) => v && v.trim().length > 0
  ? resolve(v)
  : reject(new Error('Must have a non-zero length string'))
)
const verifyNum = (min: number, max:number) => (v:string) => new Promise((resolve, reject) => v && parseInt(v) >= min && parseInt(v) <= max
  ? resolve(v)
  : reject(new Error('Must have a number betweeen ' + min + ' and ' + max))
)

type ConfigureProps = {
  close: () => void
}
const Configure :FC<ConfigureProps> = ({
  close
}: ConfigureProps) => {
  const onSubmit = () => {
    console.log('here')
  }
  return (
    <div className='p-4 max-w-xl'>
    <Form
      name='configure'
      onSubmit={onSubmit}
      afterSubmit={close}
      onCancel={close}
      items={[
        { field: 'display', label: 'Display Name', init: '', type: 'text', verify },
        {
          field: 'prebuffer',
          label: (<div className=''><div>Buffer 2-50</div><div className='text-sm font-normal'>(higher=better, more latency)</div></div>),
          init: '20',
          type: 'number',
          verify: verifyNum(2, 50),
          args: { min: '2', max: '50', step: '1' }
        },
        {
          field: 'quality',
          label: (<div className=''><div>Encoder Quality 1-10</div><div className='text-sm font-normal'>(higher=better, more cpu)</div></div>),
          init: '10',
          type: 'number',
          verify: verifyNum(1, 10),
          args: { min: '1', max: '10', step: '1' }
        }
      ]}
    />
  </div>
  )
}

const FormPage = () => {
  return (
    <div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <Configure close={() => null} />
      </div>
    </div>
  )
}

export default FormPage
