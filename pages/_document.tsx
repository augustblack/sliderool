import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
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
      <body className='bg-base-3 text-write-1 w-screen h-screen ' style={{ transition: 'background-color .25s' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
