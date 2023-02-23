import React, { useEffect, useState } from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import Button from '../components/button'

export default function Document() {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.body.className = theme
  }, [theme])


  return (
    <Html>
      <Head>
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="any"
          href={'/favicon.svg'}
        />
        <link rel="icon" type="image/x-icon" href={'/favicon.ico'} />
      </Head>
      <body className={' p-4 bg-base-3 text-write-1 space-y-4 w-screen h-screen'} style={{ transition: 'background-color .25s' }}>
        <div className='flex flex-col space-x-2 h-full '>
          <div className='flex flex-row space-x-2 p-2'>
            <div className='flex-grow' />
            <Button kind='plain' label='dark' onClick={() => setTheme('dark')} />
            <Button kind='plain' label='light' onClick={() => setTheme('light')} />
          </div>
          <Main />
        </div>

        <NextScript />
      </body>
    </Html>
  )
}
