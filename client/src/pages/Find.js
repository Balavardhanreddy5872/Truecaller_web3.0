import React, { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { TruecallerContext } from '../context/TruecallerContext';

const Find = () => {
  const { searchNumber, searchResult,addSpam,removeSpam} = useContext(TruecallerContext);
  const [spamData, setSpamData] = useState([]);
  const [spamTableData, setSpamTableData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchNumber();
  };

  const handleColor = (spamcount) => {
    if (spamcount === 0) {
      return 'lightgreen';
    } else if (spamcount <= 2) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const handleSpam = async (number, name, email) => {
    const existingData = spamData.find((data) => data.number === number);

    if (existingData) {
      existingData.spamcount += 1;
      setSpamData([...spamData]);
      alert(`${number} added to  spam`);
    } else {
      await addSpam(number);
      const newSpamData = [...spamData, { number, name, email, spamcount: 1 }];
      setSpamData(newSpamData);
      setSpamTableData(newSpamData);
      alert(`${number} added to  spam`);
    }
  };

  const removeFromSpam = async(number) => {
    await removeSpam(number);
    const updatedSpamData = spamData.map((data) => {
      if (data.number === number) {
        if (data.spamcount > 1) {
          data.spamcount -= 1;
        } else {
          return null;
        }
        alert(`${number} removed from spam`);
      }
      return data;
    });
    setSpamData(updatedSpamData.filter((data) => data !== null));
    setSpamTableData(spamTableData.filter((data) => data.number !== number));
  };

  const getSpamData = () => {
    setSpamData([...spamTableData]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedSpamTableData = spamTableData.map((data) => {
        if (data.spamcount > 0) {
          data.spamcount -= 1;
        }
        return data;
      });

      setSpamTableData(updatedSpamTableData);
    }, 15000);

    return () => clearInterval(interval);
  }, [spamTableData]);

  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 30 }}>Find_Numbers</h1>
        <form onSubmit={handleSubmit} style={{ position: 'absolute', top: 0, right: 0, margin: '100px' }}>
          <button style={{ padding: '10px 40px', background: '#0074D9', border: 'none', color: '#fff', cursor: 'pointer' }} type='submit'>Get Numbers</button>
        </form>
        <h1 style={{ fontSize: 30, marginTop: 60 }}>Numbers</h1>
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Number</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Gmail</th>
            <th style={{ border: '1px solid #000', padding: '8px' }}>Spam</th>
          </tr>
        </thead>
        <tbody>
          {searchResult.map((result, index) => (
            <tr key={index} style={{ backgroundColor: handleColor(result.spamcount || 0) }}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.Name}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.Number}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{result.email}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>
                <button
                  style={{ background: 'red', color: '#fff', cursor: 'pointer' }}
                  onClick={() => handleSpam(result.Number, result.Name, result.email)}
                >
                  Report Spam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div>
        <h1 style={{textAlign:'center'}}>Spam Data</h1>
        <br/>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Name</th>
              <th style ={{ border: '1px solid #000', padding: '8px' }}>Number</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Gmail</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Spam Count</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {spamData.map((data, index) => (
              <tr key={index} style={{ backgroundColor: handleColor(data.spamcount || 0) }}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{data.name}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{data.number}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{data.email}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{data.spamcount}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {data.spamcount === 0 ? (
                    <button
                      style={{ background: 'red', color: '#fff', cursor: 'pointer' }}
                      onClick={() => removeFromSpam(data.number)}
                    >
                      Remove from Spam
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <button
        onClick={getSpamData}
        style={{ padding: '10px 40px', background: 'red', border: 'none', color: '#fff', cursor: 'pointer' }}
      >
        Get Spam Data
      </button>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </Layout>
  );
};

export default Find;
