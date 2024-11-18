import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// import logo from '../Assets/title_logo.webp';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const doctype: any = localStorage.getItem('doctype');
  const firstname = localStorage.getItem("firstname");
  console.log(firstname)

  const handleLogoClick = () => {
    console.log('Logo clicked, navigating to dashboard');
    navigate('/dashboard');
  };

  return (
    <>

      <header className="header-container">

        <div className="header-left">


          {/* <img src='logo1.png' alt="loginbg" /> */}

        </div>


        <div className="header-right">
          <div className="user-actions">
            {token ? (
              <div className="btn-group dropleft">
                <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img src='profile1.png' className="dropdown-toggle1 mr-3" aria-expanded="false" />
                  hi   {firstname}
                </span>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/update-password" className="dropdown-item">
                    Change Password
                  </Link>
                  <a className="dropdown-item" onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}>Logout</a>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">
                  Login
                </Link>
                <Link to="/" className="btn signup-btn">
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>


      {/* <div className="header-divider"></div> */}


      {token && (
        <div className="sidebar bg-white">
          <div className="sidebar-logo">
            <div onClick={handleLogoClick} className="logo">
              <img src="logo1.png" alt="EyeRefer" className="logo1-img" />
              <span className='logo-text'>EYE REFER</span>
              <hr />
            </div>
          </div>

          <nav className="nav-links ">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/patient" className="nav-link ">
              Patient
            </Link>
            {doctype === '1' && (
              <Link to="/appointments" className="nav-link">
                Appointments
              </Link>
            )}
            <Link to="/doctor" className="nav-link">
              Doctors
            </Link>
            <Link to="/chat" className="nav-link">
              Chat
            </Link>
            <Link to="/staff" className="nav-link">
              Staff
            </Link>
            {doctype === '2' && (
              <Link to="/add-patient" className="nav-link">
                Add Referral Patient
              </Link>
            )}
          </nav>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Header;
