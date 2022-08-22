import React from 'react'
import Navbar from '../components/parts/navbar'
import Head from 'next/head';
import Footer from '../components/parts/footer'

export default function layout({ children, title }) {
  return (
    <>
      <Navbar />

      <div className='min-h-screen mb-auto'>
        <Head>
          <title>{title}</title>
          <meta name="Data Siswa" content="Website Data Siswa" />
          <link rel="icon" href="/assets/images/logo.png" />
        </Head>
        {children}
      </div>

      <Footer />
    </>
  )
}
