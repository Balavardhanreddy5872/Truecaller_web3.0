import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import { TruecallerContext } from '../context/TruecallerContext';

const Find = () => {
  const { searchNumber, searchResult } = useContext(TruecallerContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchNumber();
  }

  const handleColor = (spamcount) => {
    return spamcount > 0 ? 'red' : 'lightred';
  };

  const handleSpam = (email) => {
    // Write your logic to handle spam reports here
    console.log(`Reported spam for mobile number: ${email}`);
  };

  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Find_Numbers</h1>
        <form onSubmit={handleSubmit} style={{ position: 'absolute', top: 0, right: 0, margin: '100px' }}>
          <button style={{ padding: '10px 40px', background: '#0074D9', border: 'none', color: '#fff', cursor: 'pointer' }} type='submit'>GetNumbers</button>
        </form>
        <h1 style={{ fontSize: 18, marginTop: 60 }}>Numbers</h1>
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Number</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Gmail</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Spam</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Spam Count</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Report Spam</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map((result, index) => (
            <tr key={index} style={{ backgroundColor: handleColor(result.spamcount.toNumber()) }}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.Name}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.Number}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.email}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.spam ? 'Yes' : 'No'}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.spamcount.toNumber()}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>
                <button style={{ background: 'red', color: '#fff', cursor: 'pointer' }} onClick={() => handleSpam(result.Number)}>Report Spam</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default Find;
