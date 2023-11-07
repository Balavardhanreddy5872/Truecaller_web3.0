import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import '../css/Homepage.css';
import { TruecallerContext } from '../context/TruecallerContext';
import yourImage from '../images/2.jpeg';
const Homepage = () => {
  const { connectWallet, currentAccount } = useContext(TruecallerContext);


  return (
    <Layout>
      <div>
      <div className="container"style={{display:'flex'}}>
        <div className="header" >
        <h1>Decentralized < br /><br /> True Caller <br /><br />Application</h1><br/><br/>
        {!currentAccount && (
          <button className="button" onClick={connectWallet}>
            Connect to Wallet
          </button>
        )}
        </div>
        <div style={{marginLeft: '200px'}}>
          <img
            src={yourImage}
            alt="./alt/"
            style={{height:'350px',}}
          />
          </div>
          <br/>
        <br />
        <br />
      </div>
      </div>
      
    </Layout>
  );
};

export default Homepage;
