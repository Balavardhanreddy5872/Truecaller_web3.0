import React from 'react'
import Fotter from './Fotter'
import Header from './Header'

const Layout = ({children}) => {
  return (
    <>
       <Header />
        <main style={{minHeight:'70vh'}}>{children}</main>
       <Fotter />
    </>
  )
}

export default Layout
