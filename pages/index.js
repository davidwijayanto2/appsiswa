import React from 'react'
import Layout from '../components/layoutadmin';
import { getCookie } from 'cookies-next';
import { cookieOpt } from '../utils/common_data';

export async function getServerSideProps({ req, res }) {
  const token = getCookie('token', { req, res });
  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      }
    }
  }
  return {
    props: {}
  }
}

export default function index() {
  return (
    <Layout title="Data Siswa">

    </Layout>
  )
}
