import React from 'react'
import { Link } from 'react-router-dom'

const Fotter = () => {
  return (
    <div className="footer">
      <h2 className="text-center">All Right Reserved &copy; TrueCaller</h2>
      <p className="text-center mt-3">
        <Link to="/aboutus">About</Link>|<Link to="/find">Find</Link>
      </p>
    </div>
  )
}

export default Fotter
