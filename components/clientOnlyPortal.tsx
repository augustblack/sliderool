import { useRef, useEffect, useState, FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ClientOnlyPortalProps = {
  children: ReactNode
}
const ClientOnlyPortal: FC<ClientOnlyPortalProps> = ({
  children
}) => {
  const ref = useRef<HTMLElement>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.body
    setMounted(true)
  }, [])

  return mounted ? createPortal(children, ref.current as HTMLElement) : null
}

export default ClientOnlyPortal
