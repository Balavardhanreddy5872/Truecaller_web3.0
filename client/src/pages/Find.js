import React from 'react'
import Layout from '../components/Layout/Layout'
import '../css/find.css'

const Find = () => {
  return (
    <Layout>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Search for Numbers</h1>
        <input type="text" style={{ padding: 10, width: 400 }} placeholder="Search your Number..." />
        <button style={{ padding: '10px 20px', background: '#0074D9', border: 'none', color: '#fff', cursor: 'pointer' }}>Search</button>
        <h1 style={{ fontSize: 18, marginTop: 20 }}>Find Your Numbers</h1>
      </div>

    </Layout>
  )
}

export default Find
