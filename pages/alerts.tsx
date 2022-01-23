import React, { FC, useState } from 'react'
import Template from './template'
import { Alert, AlertProps } from '../components/alert'
// import Icons from '../components/icons'
// import Button from '../components/button'

const AlertClose: FC<AlertProps> = ({
  kind,
  children
}) => {
  const [, setOpen] = useState(true)
  return (
    <Alert kind={kind} onClose={() => setOpen(false)}>
      {children}
    </Alert>
  )
}
const Alerts = () => {
  return (
    <Template>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <Alert kind='info'>
          This is a basic info alert. You would use it sparingly or never in Mezcal.
        </Alert>
        <Alert kind='success'>
          This is a basic success alert. You would use it sparingly or never in Mezcal.
        </Alert>
        <Alert kind='warning'>
          This is a warning alert. You would use it sparingly or never in Mezcal.
        </Alert>
        <Alert kind='error'>
          This is an error alert. You would use it in Mezcal to indicate malfunction.
        </Alert>
      </div>
      <div className='bg-base-2 rounded p-4 space-y-2'>
        <div>An alert with a close function will have a X icon</div>
        <AlertClose kind='info'>
          This is a basic info alert. You would use it sparingly or never in Mezcal.
        </AlertClose>
        <AlertClose kind='success'>
          This is a basic success alert. You would use it sparingly or never in Mezcal.
        </AlertClose>
        <AlertClose kind='warning'>
          This is a warning alert. You would use it sparingly or never in Mezcal.
        </AlertClose>
        <AlertClose kind='error'>
          This is an error alert. You would use it in Mezcal to indicate malfunction.
        </AlertClose>
      </div>

    </Template>
  )
}

export default Alerts
