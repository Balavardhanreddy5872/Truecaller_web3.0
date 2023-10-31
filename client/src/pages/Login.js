import React from 'react'
import Layout from '../components/Layout/Layout'

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();


  };

  return (
    <Layout>
      <form className='container' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="emailHelp"  name='email'/>
        </div>
        <div className="mb-3">
          <label className="form-label">MobileNumber</label>
          <input type="text" className="form-control" id="mobile" name='mobile'/>
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name'/>
        </div>
        <button className="button"> Submit</button>
      </form>
    </Layout>
  )
}

export default Login

