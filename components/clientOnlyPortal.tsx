import { useRef, useEffect, useState, FC } from 'react'
import { createPortal } from 'react-dom'

const ClientOnlyPortal: FC = ({ children }) => {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.body
    setMounted(true)
  }, [])

  return mounted ? createPortal(children, ref.current) : null
}

export default ClientOnlyPortal
