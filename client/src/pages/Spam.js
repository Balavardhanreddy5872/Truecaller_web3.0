import React, { useContext } from 'react'
import Layout from '../components/Layout/Layout'
import { TruecallerContext } from '../context/TruecallerContext';

const Spam = () => {
  const { getAllSpam } = useContext(TruecallerContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nums = await getAllSpam()
    console.log(nums)
    // spamsearchNumber();
  }
  return (
    <Layout>
      <h1>spam numbers</h1>
      <form onSubmit={handleSubmit} style={{ position: 'absolute', top: 0, right: 0, margin: '100px' }}>
          <button style={{ padding: '10px 40px', background: '#0074D9', border: 'none', color: '#fff', cursor: 'pointer' }} type='submit'>GetNumbers</button>
        </form>
    </Layout>
  )
}

export default Spam
