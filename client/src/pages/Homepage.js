import React from 'react'
import Layout from '../components/Layout/Layout'
import '../css/Homepage.css'
const Homepage = () => {
  const connect_to_wallet = () => {

  }
  return (
    <Layout>
      <div className="container">
        <h1>Decentralized < br /><br /> True Caller <br /><br />Application</h1>
        <br />
        <br />
        <button className='button' onClick={connect_to_wallet}>Connect to Wallet</button>
      </div>
    </Layout>

  )
}

export default Homepage
