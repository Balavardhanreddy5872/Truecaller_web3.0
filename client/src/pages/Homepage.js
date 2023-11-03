import React, { useContext } from 'react'
import Layout from '../components/Layout/Layout'
import '../css/Homepage.css'
import { TruecallerContext } from '../context/TruecallerContext'
const Homepage = () => {
  const {connectWallet, currentAccount} = useContext(TruecallerContext);

  return (
    <Layout>
      <div className="container">
        <h1>Decentralized < br /><br /> True Caller <br /><br />Application</h1>
        <br />
        <br />
        {!currentAccount && (<button className='button' onClick={connectWallet}>Connect to Wallet</button>)}
      </div>
    </Layout>

  )
}

export default Homepage
