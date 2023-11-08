import React, { useContext, useState, Fragment } from 'react';
import Layout from '../components/Layout/Layout';
import { TruecallerContext } from '../context/TruecallerContext';
import image from '../images/Eo_circle_green_checkmark.svg.png'
const Aboutus = () => {
  const { searchValue, search } = useContext(TruecallerContext);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSearch = () => {
    if (mobileNumber.trim() !== '') {
      searchValue(mobileNumber);
    }
  };

  const verificationStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  };

  const tickStyle = {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  };

  const verificationText = {
    color: 'green',
    fontSize: '40px',
  };

  return (
    <Layout>
      <div style={containerStyle}>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>
          Search
        </button>
      </div>

      {search.length > 0 && (
        <div style={resultsContainerStyle}>
          <ul style={resultsListStyle}>
            {search.map((result, index) => (
              <Fragment key={index}>
                <li style={resultItemStyle}>
                  <p>Name: {result.mobileNumber}</p>
                  <p>Email: {result.name}</p>
                  <p>Number: {result.email}</p>
                </li>
                <div style={verificationStyle}>
                  <img src={image} alt="Tick Icon" style={tickStyle} /><br/>
                  <p style={verificationText}>Verified by Truecaller</p>
                </div>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '20px auto',
};

const inputStyle = {
  width: '300px',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginRight: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const resultsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '20px',
  borderRadius: '10px',
  marginTop: '20px',
};

const resultsListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const resultItemStyle = {
  padding: '10px',
  background: 'white',
  border: '1px solid #ccc',
  margin: '10px 0',
  borderRadius: '5px',
};

export default Aboutus;
