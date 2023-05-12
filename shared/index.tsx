import React, { FC, ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { Button } from '../components'

export type NavProps = {
  children?: ReactNode
}

export const Menu = () => (
  <div className='flex flex-col gap-2 lg:gap-4 px-1 lg:px-4' >
    <Link href='/alerts'>Alerts</Link>
    <Link href='/accordians'>Accordians</Link>
    <Link href='/swipers'>Swipers</Link>
    <Link href='/buttons'>Buttons</Link>
    <Link href='/toggles'>Toggles</Link>
    <Link href='/tabs'>Tabs</Link>
    <Link href='/modals'>Modals</Link>
    <Link href='/menus'>Menus</Link>
    <Link href='/forms'>Forms</Link>
    <Link href='/icons'>Icons</Link>
    <Link href='/sliders'>Sliders</Link>
    <Link href='/playlists'>Playlists</Link>
    <div>----</div>
    <Link href='/tracks'>Tracks</Link>
    <Link href='/tracksUp'>TracksUp</Link>
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
      <div className='flex flex-col space-x-2 h-full w-full ' draggable={false}>
        <div className='flex flex-row space-x-2 p-2 w-full'>
          <div className='flex-grow' />
          <Button kind='plain' label='dark' onClick={ () => { document.body.classList.remove('light'); document.body.classList.add('dark') }} />
          <Button kind='plain' label='light' onClick={ () => { document.body.classList.remove('dark'); document.body.classList.add('light')}} />
        </div>

        <div className='flex flex-row gap-2 md:gap-8 p-2 md:p-4 h-full w-full'>
          <Menu />
          <div className='gap-0 lg:gap-2 items-center w-full overflow-x-hidden' draggable={false}>
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
