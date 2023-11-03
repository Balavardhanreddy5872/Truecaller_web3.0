import React, { useContext } from 'react';
import Layout from '../components/Layout/Layout';
import { TruecallerContext } from '../context/TruecallerContext';

const Login = () => {
  
  const { formData, handleChange, AddCaller } = useContext(TruecallerContext);

  const handleSubmit = (e) => {
    const { email, mobileNumber, Name } = formData;
    e.preventDefault();
    
    if (!email) {
      alert("Email is required");
      return;
    }
    if (!Name) {
      alert("Name is required");
      return;
    }
    if (!mobileNumber) {
      alert("Mobile Number is required");
      return;
    }
  
    // adding Addcaller props.
    AddCaller();
  };

  return (
    <Layout>
      <form className='container' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={(e) => handleChange(e, 'email')} />
        </div>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Mobile Number</label>
          <input type="text" className="form-control" id="mobile" name='mobileNumber' onChange={(e) => handleChange(e, 'mobileNumber')} />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='Name' onChange={(e) => handleChange(e, 'Name')} />
        </div>
        <button className="button" type="submit">Submit</button>
      </form>
    </Layout>
  );
}

export default Login;
