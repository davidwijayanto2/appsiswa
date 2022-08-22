import React, { useState } from 'react'
import SideBar from './parts/sidebar'
import Navbar from './parts/navbaradmin'
import Head from 'next/head';
import Footer from './parts/footeradmin'

export default function layoutAdmin({ children, title, subtitle }) {
  const [isShow, setShow] = useState(false);
  return (
    <>
      <Head>
        <title>{title}</title>        
      </Head>
      <SideBar isShow={isShow} setShow={setShow} />
      <div className="ml-auto w-full lg:w-[77.6%] xl:w-[78%] 2xl:w-[85.2%] bg-admin flex flex-col h-full scrollbar scrollbar-thumb-slate-300 scrollbar-track-gray-100">
        <Navbar isShow={isShow} setShow={setShow} subtitle={subtitle} />
        <div className="mb-auto">
          {children}
        </div>
        <Footer />
      </div>
    </>
  )
}
