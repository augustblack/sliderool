import '../styles/global.css'
import React, { FC } from 'react'
import { AppProps } from 'next/app'
const MyApp: FC<AppProps> = ({
  Component,
  pageProps
}: AppProps) => {
  return (<Component {...pageProps} />)
}
export default MyApp
