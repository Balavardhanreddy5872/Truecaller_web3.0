import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
        <img src='/images/truecaller-720x573.avif' style={{width:'50px',height:'50px',borderRadius:'100px'}} alt='none'/>
          <Link className="navbar-brand mx-4" to="/">TrueCaller</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-4">
                <NavLink className="nav-link " to="/"><i class="fa fa-home" /> Home</NavLink>
              </li>
              <li className="nav-item mx-4">
                <NavLink className="nav-link " to="/find"> <i class="fa-solid fa-magnifying-glass"></i> Find</NavLink>
              </li>
              <li className="nav-item mx-4">
                <NavLink className="nav-link " to="/aboutus"> <i class="fa-solid fa-address-card fa-beat"></i>  Aboutus</NavLink>
              </li>
              <li className="nav-item mx-4">
                <NavLink className="nav-link " to="/spam"> <i class="fa-solid fa-bug"></i> Spam</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <NavLink className="nav-link " to="/login"> <i class="fa-regular fa-user fa-beat-fade"></i> Login</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </>
  )
}

export default Header
