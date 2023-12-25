import React, { FC, ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Button } from '../components'

export type NavProps = {
  children?: ReactNode
}

export const Menu = () => (
  <div className='flex flex-col gap-2 md:gap-4 ml-8 flex-none' >
    <Link href='/alerts'>Alerts</Link>
    <Link href='/accordians'>Accordians</Link>
    <Link href='/swipers'>Swipers</Link>
    <Link href='/buttons'>Buttons</Link>
    <Link href='/toggles'>Toggles</Link>
    <Link href='/tabs'>Tabs</Link>
    <Link href='/modals'>Modals</Link>
    <Link href='/sortables'>Sortable</Link>
    <Link href='/menus'>Menus</Link>
    <Link href='/forms'>Forms</Link>
    <Link href='/icons'>Icons</Link>
    <Link href='/sliders'>Sliders</Link>
    <Link href='/playlists'>Playlists</Link>
    <div>----</div>
    <Link href='/tracks'>Tracks</Link>
  </div>
)

export const Template: FC<NavProps> = ({
  children
}) => {
  return (
    <>
      <Head>
        <title>s l i d e r o o l</title>
      </Head>
      <div className='flex flex-col gap-2 h-screen w-screen ' draggable={false}>
        <div className='flex flex-row gap-2 w-full'>
          <div className='flex-grow' />
          <Button kind='plain' label='dark' onClick={() => { document.body.classList.remove('light'); document.body.classList.add('dark') }} />
          <Button kind='plain' label='light' onClick={() => { document.body.classList.remove('dark'); document.body.classList.add('light') }} />
        </div>

        <div className='flex flex-row gap-10 h-full w-full '>
          <Menu />
          <div className='items-center flex-grow h-full' draggable={false}>
            {children}
          </div>
        </div>
      </div>
    </>
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
