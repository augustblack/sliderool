import '../styles/global.css'
import React, { FC, ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { AppProps } from 'next/app'
import Button from '../components/button'

type NavProps = {
  children?: ReactNode
}

const Menu = () => (
  <div className='flex flex-col space-y-4 p-4' >
    <Link href='/alerts'>Alerts</Link>
    <Link href='/accordians'>Accordians</Link>
    <Link href='/buttons'>Buttons</Link>
    <Link href='/toggles'>Toggles</Link>
    <Link href='/tabs'>Tabs</Link>
    <Link href='/labels'>Labels</Link>
    <Link href='/modals'>Modals</Link>
    <Link href='/menus'>Menus</Link>
    <Link href='/forms'>Forms</Link>
    <Link href='/icons'>Icons</Link>
    <div>----</div>
    <Link href='/slider'>Slider</Link>
    <Link href='/rails'>Rails</Link>
  </div>
)

const Template: FC<NavProps> = ({
  children
}) => {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className={' p-4 bg-base-3 text-write-1 space-y-4 w-screen h-screen'} style={{ transition: 'background-color .25s' }}>
      <Head>
        <title>s l i d e r o o l</title>
      </Head>
      <div className='flex flex-col space-x-2 h-full '>
        <div className='flex flex-row space-x-2 p-2'>
          <div className='flex-grow' />
          <Button kind='plain' label='dark' onClick={() => setTheme('dark')} />
          <Button kind='plain' label='light' onClick={() => setTheme('light')} />
        </div>
        <div className='flex flex-row space-x-8 p-4 h-full'>
          <Menu />
          <div className='space-y-2 items-center w-full h-full' >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const MyApp: FC<AppProps> = ({
  Component,
  pageProps
}: AppProps) => {
  return (<Template>
    <Component {...pageProps} />
  </Template>
  )
}
export default MyApp
