import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import '../css/find.css';
import { TruecallerContext } from '../context/TruecallerContext';

const Find = () => {
  const { searchNumber, searchResult } = useContext(TruecallerContext);

  const handlesubmit = (e) => {
    e.preventDefault();
    searchNumber();
  }

  const handleColor = (spamcount) => {
    return spamcount > 0 ? 'red-background' : '';
  };

  return (
    <Layout>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Search for Numbers</h1>
        <form onSubmit={handlesubmit}>
          <button style={{ padding: '10px 20px', background: '#0074D9', border: 'none', color: '#fff', cursor: 'pointer' }} type='submit'>Search</button>
        </form>
        <h1 style={{ fontSize: 18, marginTop: 20 }}>Find Your Numbers</h1>
      </div>
      <table className="number-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Email</th>
            <th>Spam</th>
            <th>Spam Count</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map((number, index) => (
            <tr key={index} className={handleColor(number.spamcount.toNumber())}>
              <td>{number.Name}</td>
              <td>{number.Number}</td>
              <td>{number.email}</td>
              <td>{number.spam ? 'Yes' : 'No'}</td>
              <td>{number.spamcount.toNumber()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default Find;
