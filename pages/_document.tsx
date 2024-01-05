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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />
      </Head>
      <body className='bg-base-3 text-base-con w-screen h-screen light ' style={{ transition: 'background-color .25s' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
